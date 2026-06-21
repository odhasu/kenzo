import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPT, extractJson } from '@/lib/ai-prompt'
import { DEFAULT_PROPS } from '@/lib/templates'
import { callAI } from '@/lib/ai-provider'
import type { Block, BlockType, FunnelSettings } from '@/types/blocks'

const VALID_BLOCK_TYPES: BlockType[] = [
  'heading', 'text', 'button', 'image', 'form',
  'ic-hero', 'ic-ticker', 'ic-cards', 'ic-faq', 'ic-apply', 'ic-cta', 'ic-results',
]

function sanitizeBlocks(raw: unknown[]): Block[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((b): b is Record<string, unknown> => typeof b === 'object' && b !== null)
    .map((b) => {
      const type = b.type as string
      if (!type || !VALID_BLOCK_TYPES.includes(type as BlockType)) return null

      const defaults = DEFAULT_PROPS[type as BlockType]
      const props = typeof b.props === 'object' && b.props !== null
        ? { ...defaults, ...(b.props as Record<string, unknown>) }
        : { ...defaults }

      return {
        id: (b.id as string) || crypto.randomUUID(),
        type: type as BlockType,
        props,
      } as Block
    })
    .filter((b): b is Block => b !== null)
}

function sanitizeSettings(raw: unknown, fallback: FunnelSettings): FunnelSettings {
  if (typeof raw !== 'object' || raw === null) return fallback
  const s = raw as Record<string, unknown>
  return {
    theme: (['dark-green', 'dark-minimal', 'light-clean', 'light-blue'].includes(s.theme as string) ? s.theme : fallback.theme) as FunnelSettings['theme'],
    accentColor: typeof s.accentColor === 'string' ? s.accentColor : fallback.accentColor,
    bgColor: typeof s.bgColor === 'string' ? s.bgColor : fallback.bgColor,
    textColor: typeof s.textColor === 'string' ? s.textColor : fallback.textColor,
    font: typeof s.font === 'string' ? s.font : fallback.font,
    headingFont: typeof s.headingFont === 'string' ? s.headingFont : fallback.headingFont,
    fontScale: typeof s.fontScale === 'number' ? s.fontScale : fallback.fontScale,
    letterSpacing: (['tight', 'normal', 'wide'].includes(s.letterSpacing as string) ? s.letterSpacing : fallback.letterSpacing) as FunnelSettings['letterSpacing'],
    fontWeight: (['regular', 'medium', 'bold'].includes(s.fontWeight as string) ? s.fontWeight : fallback.fontWeight) as FunnelSettings['fontWeight'],
    maxWidth: typeof s.maxWidth === 'number' ? s.maxWidth : fallback.maxWidth,
    sectionSpacing: (['compact', 'normal', 'spacious'].includes(s.sectionSpacing as string) ? s.sectionSpacing : fallback.sectionSpacing) as FunnelSettings['sectionSpacing'],
    borderRadius: typeof s.borderRadius === 'number' ? s.borderRadius : fallback.borderRadius,
    buttonStyle: (['filled', 'outline', 'ghost'].includes(s.buttonStyle as string) ? s.buttonStyle : fallback.buttonStyle) as FunnelSettings['buttonStyle'],
    buttonSize: (['sm', 'md', 'lg'].includes(s.buttonSize as string) ? s.buttonSize : fallback.buttonSize) as FunnelSettings['buttonSize'],
    buttonRadius: typeof s.buttonRadius === 'number' ? s.buttonRadius : fallback.buttonRadius,
    glowEnabled: typeof s.glowEnabled === 'boolean' ? s.glowEnabled : fallback.glowEnabled,
    gradientHeadlines: typeof s.gradientHeadlines === 'boolean' ? s.gradientHeadlines : fallback.gradientHeadlines,
    glassmorphism: typeof s.glassmorphism === 'boolean' ? s.glassmorphism : fallback.glassmorphism,
    tickerSpeed: typeof s.tickerSpeed === 'number' ? s.tickerSpeed : fallback.tickerSpeed,
    background: (['none', 'gradient', 'particles', 'grid', 'glow', 'aurora', 'dots', 'noise', 'waves', 'stars'].includes(s.background as string) ? s.background : fallback.background) as FunnelSettings['background'],
    pageTitle: typeof s.pageTitle === 'string' ? s.pageTitle : fallback.pageTitle,
    faviconUrl: typeof s.faviconUrl === 'string' ? s.faviconUrl : fallback.faviconUrl,
    ogImage: typeof s.ogImage === 'string' ? s.ogImage : fallback.ogImage,
    pixelId: typeof s.pixelId === 'string' ? s.pixelId : fallback.pixelId,
    customCss: typeof s.customCss === 'string' ? s.customCss : fallback.customCss,
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { blocks: inputBlocks, settings: inputSettings, answers, message } = await request.json()

    if (!answers && !message) {
      return NextResponse.json({ error: 'Missing answers or message' }, { status: 400 })
    }

    // Build context from answers
    let answersBlock = ''
    if (answers) {
      answersBlock = '\n\nBUSINESS CONTEXT (from onboarding):\n'
      answersBlock += Object.entries(answers)
        .filter(([, v]) => v)
        .map(([k, v]) => `- ${k}: "${v}"`)
        .join('\n')
    }

    const blocksContext = inputBlocks
      ? `\n\nCURRENT PAGE STATE:\nBlocks: ${JSON.stringify(inputBlocks, null, 2)}\nSettings: ${JSON.stringify(inputSettings, null, 2)}`
      : ''

    const userPrompt = `You are building a funnel page. The user is answering questions about their business. Update the page progressively as you learn more.

${answersBlock}
${blocksContext}

USER MESSAGE: "${message || 'Start building the funnel based on what you know so far.'}"

INSTRUCTIONS:
- If this is the first message: pick a template skeleton based on what you know (Waitlist / Application / VSL / Agency), create the initial blocks.
- If there are existing blocks: modify/improve them based on the new information — update copy, add sections, refine settings.
- Write specific, concrete copy using the details provided. No generic filler.
- Return the COMPLETE blocks array and COMPLETE settings object every time.
- Include a short explanation of what you changed and why.`

    const response = await callAI(userPrompt, {
      systemPrompt: SYSTEM_PROMPT,
      jsonMode: true,
      retries: 1,
    })

    const responseText = response.text

    // Parse + sanitize
    const cleanText = extractJson(responseText)
    let parsed: { blocks?: unknown[]; settings?: unknown; explanation?: string }

    try {
      parsed = JSON.parse(cleanText)
    } catch {
      console.error('Failed to parse AI JSON:', responseText)
      return NextResponse.json(
        { error: 'PARSE_ERROR', message: 'AI returned invalid JSON.', raw: responseText },
        { status: 500 },
      )
    }

    const sanitizedBlocks = sanitizeBlocks(parsed.blocks || [])
    const sanitizedSettings = sanitizeSettings(parsed.settings || {}, inputSettings || {})

    // Save chat messages
    try {
      await supabase.from('chat_messages').insert([
        {
          user_id: user.id,
          console_type: 'create',
          role: 'user',
          content: message || 'Build my funnel',
        },
        {
          user_id: user.id,
          console_type: 'create',
          role: 'assistant',
          content: parsed.explanation || 'Funnel updated.',
        },
      ])
    } catch (dbErr) {
      console.error('Failed to save chat message:', dbErr)
    }

    return NextResponse.json({
      blocks: sanitizedBlocks,
      settings: sanitizedSettings,
      explanation: parsed.explanation || 'Funnel updated based on your answers.',
    })
  } catch (error: unknown) {
    console.error('build-funnel API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: errorMessage },
      { status: 500 },
    )
  }
}
