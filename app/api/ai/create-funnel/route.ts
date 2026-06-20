import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SYSTEM_PROMPT = `You are Kenzo AI, a design-focused funnel building assistant.
Your task is to generate a custom, high-converting funnel landing page (a JSON array of blocks and a settings object) based on the user's brand profile and questionnaire answers.

Here is the schema of the blocks you can generate:
1. 'heading': props: { text: string }
2. 'text': props: { text: string }
3. 'button': props: { label: string; href: string }
4. 'image': props: { src: string; alt: string }
5. 'form': props: { fields: ("email" | "name" | "phone")[] }
6. 'ic-hero': props: { badge: string; headline: string; subtext: string; ctaLabel: string; ctaHref: string }
7. 'ic-ticker': props: { items: string[] }
8. 'ic-cards': props: { headline: string; cards: { title: string; desc: string; bullets: string[] }[]; ctaLabel: string; ctaHref: string }
9. 'ic-faq': props: { headline: string; items: { q: string; a: string }[] }
10. 'ic-apply': props: { headline: string; subtext: string }
11. 'ic-cta': props: { label: string; href: string; subtext: string }
12. 'ic-results': props: { headline: string; photos: string[] }

Every block must have:
- "id": a unique string (generate a random UUID)
- "type": one of the block type strings above
- "props": matching the schema for that block type

Here is the schema of the global settings:
- "accentColor": hex color (default: "#39FF14")
- "bgColor": hex color (default: "#050505")
- "textColor": hex color (default: "#ffffff")
- "font": string (one of: 'Inter', 'Satoshi', 'DM Sans', 'Poppins', 'Plus Jakarta Sans', 'Space Grotesk', 'Montserrat')
- "tickerSpeed": number (between 8 and 80)
- "pageTitle": string
- "faviconUrl": string

Copywriting & Brand Alignment Rules:
1. Niche & Value Prop: Read the user's business niche and key benefits. Write copy that is extremely specific to their business. Do not write generic templates.
2. Target Audience: Adjust terminology to target the user's specified audience.
3. Tone of Voice: Match their requested tone (e.g. highly professional business expert, warm/encouraging, direct). Write naturally; avoid robotic AI cliché words like "embark", "testament", "unlock", "delve". Keep it humanized and strong.
4. Social Proof: If the user wants to show screenshots or results, generate an 'ic-results' block suggesting relevant photo layouts.
5. Form fields: If the user collects detailed info, use form fields or ic-apply block containing fields.
6. Icons/Emojis: Do NOT use cartoon emojis. Use high-class icons or clean arrows (like '→', '↗', '⚡', '★').

Always return a valid JSON object matching this exact structure:
{
  "blocks": [...],
  "settings": {...}
}

Do NOT wrap the output in markdown code blocks. Return ONLY the raw JSON object.`

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Verify Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { answers, chatHistory } = await request.json()
    if (!answers || !answers.name) {
      return NextResponse.json({ error: 'Missing funnel name or survey answers' }, { status: 400 })
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY
    if (!deepseekKey) {
      return NextResponse.json({ error: 'NO_API_KEY', message: 'DeepSeek API key is not configured.' }, { status: 400 })
    }

    // 2. Build User Prompt from Survey Answers
    const userPrompt = `Generate a customized funnel page based on the following questionnaire responses:
- Funnel Name: "${answers.name}"
- Business Niche: "${answers.niche}"
- Target Customer: "${answers.audience}"
- Core Offer Price Point: "${answers.price}"
- Tone of Voice: "${answers.tone}"
- Primary Call to Action Goal: "${answers.goal}"
- Social Proof Types: "${answers.socialProof}"
- Aesthetics & Color Preferences: "${answers.aesthetics}"
- Key Benefits of Offer: "${answers.benefits}"
- Experience Required: "${answers.requisites}"`

    const baseModel = process.env.DEEPSEEK_API_MODEL || 'deepseek-chat'
    const model = (baseModel === 'deepseek-v4-pro' || baseModel === 'deepseek-v4-flash')
      ? 'deepseek-chat'
      : baseModel

    // 3. Call DeepSeek
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`DeepSeek API error: ${res.status} ${errText}`)
    }

    const data = await res.json()
    const responseText = data.choices?.[0]?.message?.content || ''

    // Clean up response text in case markdown blocks are returned
    let cleanText = responseText.trim()
    if (cleanText.includes('```json')) {
      cleanText = cleanText.split('```json')[1].split('```')[0].trim()
    } else if (cleanText.includes('```')) {
      cleanText = cleanText.split('```')[1].split('```')[0].trim()
    }

    const parsedData = JSON.parse(cleanText)
    const blocks = parsedData.blocks || []
    const settings = parsedData.settings || {}

    // Make sure pageTitle is set
    if (!settings.pageTitle) {
      settings.pageTitle = answers.name
    }

    // 4. Save Funnel to Supabase
    const slug = answers.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .insert({ name: answers.name, slug, user_id: user.id })
      .select()
      .single()

    if (funnelError) {
      throw new Error(`Supabase Funnel insert failed: ${funnelError.message}`)
    }

    // Save Page details
    const { error: pageError } = await supabase
      .from('pages')
      .insert({
        funnel_id: funnel.id,
        slug: 'main',
        title: 'Main Page',
        content: blocks,
        settings: settings,
        order: 0,
      })

    if (pageError) {
      throw new Error(`Supabase Page insert failed: ${pageError.message}`)
    }

    // Save wizard chat messages
    if (chatHistory && chatHistory.length > 0) {
      try {
        const dbMessages = chatHistory.map((m: { role: string; content: string }) => ({
          user_id: user.id,
          funnel_id: funnel.id,
          console_type: 'editor',
          role: m.role,
          content: m.content,
        }))
        await supabase.from('chat_messages').insert(dbMessages)
      } catch (dbErr) {
        console.error('Failed to save wizard chat messages to Supabase:', dbErr)
      }
    }

    return NextResponse.json({ success: true, funnelId: funnel.id })

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Create funnel API error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: errMsg }, { status: 500 })
  }
}
