import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractJson } from '@/lib/ai-prompt'

const PLANNER_PROMPT = `You are a funnel strategist who has built hundreds of high-ticket coaching/reselling/agency funnels converting at 3-8%. You know which sections work for which offer types.

Given a style archetype and business answers, choose the best ordered set of section component types from this exact allowed list:
[heading, text, button, image, form, ic-hero, ic-ticker, ic-cards, ic-faq, ic-apply, ic-cta, ic-results]

RULES:
- Always start with ic-hero as the first section.
- Always end with ic-cta as the last section.
- Include ic-ticker after the hero for social proof / benefits scrolling.
- Include ic-cards for explaining the offer / system / steps.
- Include ic-results if social proof includes screenshots/revenue/stats/before-after.
- Include ic-faq if there are likely objections to address.
- Include ic-apply if the goal is "Apply via form".
- Include form if the goal is "Direct purchase" or "Book a call".
- 5-8 sections total. Don't bloat.
- Keep the archetype as a starting point but adjust based on answers.

Then ask 3-5 specific follow-up questions about the offer itself. These must be concrete — ask about:
  - What exactly is included (modules, calls, community, bonuses)?
  - The transformation/result (what does the customer achieve? timeline?)
  - Price justification (why is it worth the price? what's the alternative cost?)
  - Guarantee/risk reversal (refund policy, trial period?)
  - Who it's NOT for (disqualify bad-fit customers)
  - Urgency/scarcity (limited spots? deadline? price increase?)

Return JSON only: { "sections": string[], "followupQuestions": [{ "key": string, "question": string }] }

Section type array MUST only contain valid types from the allowed list. Follow-up question keys must be kebab-case slugs (e.g. "whats-included", "transformation-timeline").`

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { styleName, archetypeSections, answers } = await request.json()
    if (!answers || !archetypeSections) {
      return NextResponse.json({ error: 'Missing style, archetype, or answers' }, { status: 400 })
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY
    if (!deepseekKey) {
      return NextResponse.json({ error: 'NO_API_KEY', message: 'DeepSeek API key is not configured.' }, { status: 400 })
    }

    const userPrompt = `Style: "${styleName}"
Archetype starting sections: [${archetypeSections.join(', ')}]

Business answers:
- Name: "${answers.name}"
- Niche: "${answers.niche}"
- Audience: "${answers.audience}"
- Price: "${answers.price}"
- Tone: "${answers.tone}"
- Goal: "${answers.goal}"
- Social Proof: "${answers.socialProof}"

Choose the best sections for this specific funnel and generate follow-up questions.`

    const baseModel = process.env.DEEPSEEK_API_MODEL || 'deepseek-chat'
    const model = (baseModel === 'deepseek-v4-pro' || baseModel === 'deepseek-v4-flash')
      ? 'deepseek-chat'
      : baseModel

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: PLANNER_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`DeepSeek API error: ${res.status} ${errText}`)
    }

    const data = await res.json()
    const responseText = data.choices?.[0]?.message?.content || ''

    const cleanText = extractJson(responseText)

    const parsed = JSON.parse(cleanText)

    // Validate sections are all valid block types
    const validTypes = ['heading', 'text', 'button', 'image', 'form', 'ic-hero', 'ic-ticker', 'ic-cards', 'ic-faq', 'ic-apply', 'ic-cta', 'ic-results']
    const sections = (parsed.sections || []).filter((s: string) => validTypes.includes(s))
    const followupQuestions = parsed.followupQuestions || []

    return NextResponse.json({ sections, followupQuestions })

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Plan funnel API error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: errMsg }, { status: 500 })
  }
}
