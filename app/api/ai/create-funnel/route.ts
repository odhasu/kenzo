import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPT } from '@/lib/ai-prompt'
import type { BlockType, ThemeId, BackgroundId } from '@/types/blocks'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Verify Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      answers,
      chatHistory,
      plannedSections,
      theme,
      background,
    } = await request.json()

    if (!answers || !answers.name) {
      return NextResponse.json({ error: 'Missing funnel name or survey answers' }, { status: 400 })
    }

    if (!plannedSections || !Array.isArray(plannedSections) || plannedSections.length === 0) {
      return NextResponse.json({ error: 'Missing plannedSections (component plan required)' }, { status: 400 })
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY
    if (!deepseekKey) {
      return NextResponse.json({ error: 'NO_API_KEY', message: 'DeepSeek API key is not configured.' }, { status: 400 })
    }

    // 2. Build User Prompt from all answers + constraints
    // Separate base question answers from follow-up answers
    const baseKeys = ['name', 'niche', 'audience', 'price', 'tone', 'goal', 'socialProof']
    const followupEntries = Object.entries(answers).filter(([k]) => !baseKeys.includes(k))

    let followupBlock = ''
    if (followupEntries.length > 0) {
      followupBlock = '\n\nDeeper offer details (use this to write specific, concrete copy — not generic filler):\n'
      followupBlock += followupEntries.map(([k, v]) => `- ${k}: "${v}"`).join('\n')
    }

    const userPrompt = `Generate a customized funnel page.

BASE ANSWERS:
- Funnel Name: "${answers.name}"
- Business Niche: "${answers.niche}"
- Target Customer: "${answers.audience}"
- Core Offer Price Point: "${answers.price}"
- Tone of Voice: "${answers.tone}"
- Primary Call to Action Goal: "${answers.goal}"
- Social Proof Types: "${answers.socialProof}"
${followupBlock}

CONSTRAINTS:
- SECTION ORDER (EXACT): You MUST generate blocks for ONLY these section types, in this exact order: [${plannedSections.join(', ')}]
- Do NOT add, remove, or reorder sections. Generate exactly one block per type in the given order.
- THEME: "${theme || 'dark-green'}"
- BACKGROUND: "${background || 'none'}"

WRITING INSTRUCTIONS:
- Write detailed, specific copy using the deeper offer details above.
- Every headline, bullet point, and FAQ answer must reference concrete details from the offer (not generic filler).
- Use the tone and voice specified. Match the price point's sophistication.
- For social proof: if screenshots/revenue stats requested, populate ic-results photos as empty string array ([""]). If text reviews requested, weave testimonials into cards/FAQ.
- Generate unique UUIDs for each block id.
- Form fields: include ["email", "name", "phone"] unless the goal suggests otherwise.`

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
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
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

    // Ensure defaults for critical fields
    if (!settings.theme) {
      settings.theme = (theme as ThemeId) || 'dark-green'
    }
    if (!settings.background) {
      settings.background = (background as BackgroundId) || 'none'
    }
    if (!settings.pageTitle) {
      settings.pageTitle = answers.name
    }

    // 4. Save Funnel to Supabase
    const baseSlug = answers.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'funnel'
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`

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
