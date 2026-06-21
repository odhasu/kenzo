import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractJson } from '@/lib/ai-prompt'
import { callAI } from '@/lib/ai-provider'
import { TEMPLATES } from '@/lib/templates'

const TEMPLATE_LIST = Object.values(TEMPLATES).map(t =>
  `- ${t.id}: "${t.name}" — ${t.description} (archetype: ${t.archetype}, theme: ${t.theme}, sections: [${t.blockOrder.join(', ')}])`
).join('\n')

const PLANNER_PROMPT = `You are a funnel strategist who has built hundreds of high-ticket coaching/reselling/agency funnels converting at 3-8%. You know which sections work for which offer types.

Given a style archetype and business answers, you must:
1. Pick the best TEMPLATE from the library below (return its id).
2. Choose the best ordered set of section component types.

Allowed section types: [heading, text, button, image, form, ic-hero, ic-ticker, ic-cards, ic-faq, ic-apply, ic-cta, ic-results]

--- TEMPLATE LIBRARY ---
${TEMPLATE_LIST}

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
- Pick a template whose theme and archetype match the offer type.

Then ask 3-5 specific follow-up questions about the offer itself. These must be concrete — ask about:
  - What exactly is included (modules, calls, community, bonuses)?
  - The transformation/result (what does the customer achieve? timeline?)
  - Price justification (why is it worth the price? what's the alternative cost?)
  - Guarantee/risk reversal (refund policy, trial period?)
  - Who it's NOT for (disqualify bad-fit customers)
  - Urgency/scarcity (limited spots? deadline? price increase?)

Return JSON only: { "templateId": string, "sections": string[], "followupQuestions": [{ "key": string, "question": string }] }

templateId must be one of: ${Object.keys(TEMPLATES).join(', ')}. Section type array MUST only contain valid types. Follow-up question keys must be kebab-case slugs (e.g. "whats-included", "transformation-timeline").`

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

    const userPrompt = `Style: "${styleName}"
Archetype starting sections: [${archetypeSections.join(', ')}]
Available templates: ${Object.keys(TEMPLATES).join(', ')}

Business answers:
- Name: "${answers.name}"
- Niche: "${answers.niche}"
- Audience: "${answers.audience}"
- Price: "${answers.price}"
- Tone: "${answers.tone}"
- Goal: "${answers.goal}"
- Social Proof: "${answers.socialProof}"

Pick the best template from the library, choose the best sections for this specific funnel, and generate follow-up questions.`

    const response = await callAI(userPrompt, {
      systemPrompt: PLANNER_PROMPT,
      jsonMode: true,
      retries: 1,
    })

    const cleanText = extractJson(response.text)
    const parsed = JSON.parse(cleanText)

    // Validate sections are valid block types
    const validTypes = ['heading', 'text', 'button', 'image', 'form', 'ic-hero', 'ic-ticker', 'ic-cards', 'ic-faq', 'ic-apply', 'ic-cta', 'ic-results']
    const sections = (parsed.sections || []).filter((s: string) => validTypes.includes(s))
    const followupQuestions = parsed.followupQuestions || []

    // Validate templateId
    const templateId = TEMPLATES[parsed.templateId] ? parsed.templateId : 'innercircle'

    return NextResponse.json({ sections, followupQuestions, templateId })
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Plan funnel API error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: errMsg }, { status: 500 })
  }
}
