import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPT, extractJson } from '@/lib/ai-prompt'
import { callAI, resolvePrefer, createSimulatedStream } from '@/lib/ai-provider'
import type { Block, FunnelSettings, BlockType } from '@/types/blocks'
import { DEFAULT_PROPS } from '@/lib/templates'

// ── Types ────────────────────────────────────────────────────────────────────────

interface Op {
  op: 'add_block' | 'update_block' | 'delete_block' | 'move_block' | 'update_settings'
  id?: string
  type?: BlockType
  props?: Record<string, unknown>
  after?: string | null
  patch?: Partial<FunnelSettings>
}

interface ParsedAIResponse {
  ops?: Op[]
  blocks?: Block[]
  settings?: Partial<FunnelSettings> | null
  explanation: string
}

// ── Validation ───────────────────────────────────────────────────────────────────

function validateBlockProps(type: BlockType, props: Record<string, unknown>): Record<string, unknown> {
  const defaults = DEFAULT_PROPS[type] as unknown as Record<string, unknown> | undefined
  if (!defaults) return props // unknown type, pass through
  // Merge with defaults so missing fields are filled
  // But keep provided values where present
  const result = { ...defaults }
  for (const key of Object.keys(props)) {
    if (props[key] !== undefined && props[key] !== null) {
      result[key] = props[key]
    }
  }
  return result
}

// ── Ops engine ───────────────────────────────────────────────────────────────────

function applyOps(currentBlocks: Block[], currentSettings: FunnelSettings, ops: Op[], settingsPatch?: Partial<FunnelSettings> | null): { blocks: Block[]; settings: FunnelSettings } {
  let blocks = [...currentBlocks]
  let settings = { ...currentSettings }

  for (const op of ops) {
    switch (op.op) {
      case 'add_block': {
        if (!op.id || !op.type) break
        const safeProps = validateBlockProps(op.type, op.props || {})
        const newBlock: Block = { id: op.id, type: op.type, props: safeProps } as unknown as Block
        if (op.after) {
          const idx = blocks.findIndex(b => b.id === op.after)
          blocks.splice(idx >= 0 ? idx + 1 : blocks.length, 0, newBlock)
        } else {
          blocks.unshift(newBlock)
        }
        break
      }
      case 'update_block': {
        if (!op.id) break
        const existing = blocks.find(b => b.id === op.id)
        if (!existing) break
        const merged = { ...existing.props as unknown as Record<string, unknown>, ...op.props }
        const safeProps = validateBlockProps(existing.type, merged)
        blocks = blocks.map(b => b.id === op.id ? { ...b, props: safeProps } as unknown as Block : b)
        break
      }
      case 'delete_block': {
        if (!op.id) break
        blocks = blocks.filter(b => b.id !== op.id)
        break
      }
      case 'move_block': {
        if (!op.id) break
        const idx = blocks.findIndex(b => b.id === op.id)
        if (idx === -1) break
        const [moved] = blocks.splice(idx, 1)
        if (op.after) {
          const targetIdx = blocks.findIndex(b => b.id === op.after)
          blocks.splice(targetIdx >= 0 ? targetIdx + 1 : blocks.length, 0, moved)
        } else {
          blocks.unshift(moved)
        }
        break
      }
      case 'update_settings': {
        if (op.patch) {
          settings = { ...settings, ...op.patch }
        }
        break
      }
    }
  }

  // Apply settings patch from top-level too (for rebuild mode)
  if (settingsPatch) {
    settings = { ...settings, ...settingsPatch }
  }

  return { blocks, settings }
}

// ── Context builders ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildBusinessContext(supabaseClient: any, funnelId: string): Promise<string | null> {
  try {
    const { data: funnel } = await supabaseClient
      .from('funnels')
      .select('business_profile_id')
      .eq('id', funnelId)
      .single()
    if (!funnel?.business_profile_id) return null

    const { data: profile } = await supabaseClient
      .from('business_profiles')
      .select('*')
      .eq('id', funnel.business_profile_id)
      .single()
    if (!profile) return null

    return [`Business Profile:`,
      `- Name/Offer: ${profile.name || profile.offer_name || 'N/A'}`,
      `- Niche: ${profile.niche || 'N/A'}`,
      `- Price: $${profile.price || profile.price_range || 'N/A'}`,
      `- Audience: ${profile.audience || profile.target_audience || 'N/A'}`,
      `- Voice/Tone: ${profile.voice || profile.brand_voice || profile.tone || 'N/A'}`,
      `- Main Objection: ${profile.objection || profile.main_objection || 'N/A'}`,
      `- Social Proof: ${profile.social_proof || 'N/A'}`,
    ].join('\n')
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildRecentMessages(supabaseClient: any, sessionId: string, limit = 6): Promise<string | null> {
  try {
    const { data: messages } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!messages?.length) return null
    return messages.reverse().map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
  } catch {
    return null
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const { blocks, settings, prompt, model: reqModel, funnelId, sessionId } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Build enhanced system prompt with context
    let systemPrompt = SYSTEM_PROMPT

    // Inject business profile context
    if (funnelId && user) {
      const bizContext = await buildBusinessContext(supabase, funnelId)
      if (bizContext) {
        systemPrompt += `\n\n--- BUSINESS CONTEXT (use this for copy specifics) ---\n${bizContext}`
      }
    }

    // Inject recent chat messages for continuity
    if (sessionId && user) {
      const recent = await buildRecentMessages(supabase, sessionId)
      if (recent) {
        systemPrompt += `\n\n--- RECENT CONVERSATION ---\n${recent}`
      }
    }

    // Build user prompt
    const userPrompt = [
      `Current blocks (JSON array, DO NOT re-emit unchanged blocks — use ops):`,
      JSON.stringify(blocks, null, 2),
      ``,
      `Current settings:`,
      JSON.stringify(settings, null, 2),
      ``,
      `User request: ${prompt}`,
    ].join('\n')

    // Resolve model preference
    const prefer = resolvePrefer(reqModel)

    // Call AI with retries
    const response = await callAI(userPrompt, {
      systemPrompt,
      jsonMode: true,
      retries: 2,
      prefer,
    })

    const cleanText = extractJson(response.text)

    // Parse AI response
    let parsed: ParsedAIResponse
    try {
      const raw = JSON.parse(cleanText)
      parsed = {
        ops: raw.ops,
        blocks: raw.blocks,
        settings: raw.settings,
        explanation: raw.explanation || 'Page updated.',
      }
    } catch {
      console.error('Failed to parse AI JSON:', response.text)
      return NextResponse.json(
        { error: 'PARSE_ERROR', message: 'AI returned invalid JSON.', raw: response.text },
        { status: 500 },
      )
    }

    // Apply ops or full rebuild
    let resolvedBlocks: Block[]
    let resolvedSettings: FunnelSettings

    if (parsed.ops && Array.isArray(parsed.ops) && parsed.ops.length > 0) {
      // Ops mode — apply targeted changes
      try {
        const result = applyOps(blocks as unknown as Block[], settings as FunnelSettings, parsed.ops, parsed.settings)
        resolvedBlocks = result.blocks
        resolvedSettings = result.settings
      } catch (err) {
        console.error('Ops application failed:', err)
        // Fallback: return current state unchanged
        resolvedBlocks = blocks as unknown as Block[]
        resolvedSettings = settings as FunnelSettings
        parsed.explanation = 'Error applying changes — funnel unchanged. ' + (parsed.explanation || '')
      }
    } else if (parsed.blocks && Array.isArray(parsed.blocks)) {
      // Full rebuild mode — validate all blocks
      try {
        resolvedBlocks = (parsed.blocks as unknown as Block[]).map(b => {
          const safeProps = validateBlockProps(b.type, b.props as unknown as Record<string, unknown>)
          return { ...b, props: safeProps } as unknown as Block
        })
        resolvedSettings = { ...settings, ...(parsed.settings || {}) } as FunnelSettings
      } catch (err) {
        console.error('Full rebuild validation failed:', err)
        resolvedBlocks = blocks as unknown as Block[]
        resolvedSettings = settings as FunnelSettings
        parsed.explanation = 'Error validating rebuild — funnel unchanged. ' + (parsed.explanation || '')
      }
    } else {
      // No ops and no blocks — nothing to apply
      resolvedBlocks = blocks as unknown as Block[]
      resolvedSettings = settings as FunnelSettings
    }

    // Save chat messages (with session handling)
    let resolvedSessionId = sessionId || null
    try {
      if (user) {
        // Auto-create session if none
        if (!resolvedSessionId && funnelId) {
          const autoTitle = prompt.slice(0, 40) + (prompt.length > 40 ? '…' : '')
          const { data: newSession } = await supabase
            .from('chat_sessions')
            .insert({ user_id: user.id, funnel_id: funnelId, title: autoTitle })
            .select('id')
            .single()
          if (newSession) resolvedSessionId = newSession.id
        }

        if (resolvedSessionId) {
          await supabase.from('chat_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', resolvedSessionId)
        }

        await supabase.from('chat_messages').insert([
          { user_id: user.id, funnel_id: funnelId || null, session_id: resolvedSessionId, console_type: 'editor', role: 'user', content: prompt },
          { user_id: user.id, funnel_id: funnelId || null, session_id: resolvedSessionId, console_type: 'editor', role: 'assistant', content: parsed.explanation },
        ])
      }
    } catch (dbErr) {
      console.error('Failed to save chat message:', dbErr)
    }

    // Stream or return
    const streamParam = new URL(request.url).searchParams.get('stream')
    if (streamParam !== 'false') {
      // SSE streaming response
      const finalData = {
        blocks: resolvedBlocks,
        settings: resolvedSettings,
        explanation: parsed.explanation,
        _provider: response.provider,
        _model: response.model,
        _sessionId: resolvedSessionId,
      }

      return new Response(
        createSimulatedStream(parsed.explanation, finalData),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        },
      )
    }

    // Non-streaming fallback
    return NextResponse.json({
      blocks: resolvedBlocks,
      settings: resolvedSettings,
      explanation: parsed.explanation,
      _provider: response.provider,
      _model: response.model,
      _sessionId: resolvedSessionId,
    })
  } catch (error: unknown) {
    console.error('API route error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: errorMessage },
      { status: 500 },
    )
  }
}
