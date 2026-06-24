import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPT, extractJson } from '@/lib/ai-prompt'
import { callAI, callAIStream } from '@/lib/ai-provider'
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

interface AIResponse {
  action: 'talk' | 'clarify' | 'edit'
  reply: string
  question?: string
  ops?: Op[]
  blocks?: Block[]
  settings?: Partial<FunnelSettings>
}

// ── Validation ───────────────────────────────────────────────────────────────────

function validateBlockProps(type: BlockType, props: Record<string, unknown>): Record<string, unknown> {
  const defaults = DEFAULT_PROPS[type] as unknown as Record<string, unknown> | undefined
  if (!defaults) return props
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
          blocks.push(newBlock)
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

    return ['Business Profile:',
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
async function buildRecentMessages(supabaseClient: any, funnelId: string, limit = 8): Promise<string | null> {
  try {
    const { data: messages } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('funnel_id', funnelId)
      .eq('console_type', 'editor')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!messages?.length) return null
    return messages.reverse().map((m: { role: string; content: string }) =>
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n')
  } catch {
    return null
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const { blocks, settings, prompt, funnelId, targetBlockId } = await request.json()

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
    if (funnelId && user) {
      const recent = await buildRecentMessages(supabase, funnelId)
      if (recent) {
        systemPrompt += `\n\n--- RECENT CONVERSATION ---\n${recent}`
      }
    }

    // Build user prompt — scope to target block if inspecting
    let contextBlocks: string | null = null
    if (targetBlockId && Array.isArray(blocks)) {
      const target = (blocks as Block[]).find((b: Block) => b.id === targetBlockId)
      if (target) {
        systemPrompt += `\n\n--- INSPECT MODE ---\nThe user has selected section "${targetBlockId}" (type: ${target.type}) for editing. Focus your ops ONLY on this block unless the user asks to change other parts of the page.`
        contextBlocks = JSON.stringify([target], null, 2)
      }
    }

    const userPrompt = [
      `Current blocks (JSON array, DO NOT re-emit unchanged blocks — use ops):`,
      contextBlocks || JSON.stringify(blocks, null, 2),
      ``,
      `Current settings:`,
      JSON.stringify(settings, null, 2),
      ``,
      `User request: ${prompt}`,
      targetBlockId ? `\n(the user has block "${targetBlockId}" selected in the editor — scope edits to it)` : '',
    ].join('\n')

    // ── Try streaming (DeepSeek with reasoning) first, fall back to non-streaming ──

    const encoder = new TextEncoder()
    let streamedText = ''
    let thinkingText = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Try real streaming first
          let streamSucceeded = false
          try {
            for await (const delta of callAIStream(userPrompt, {
              systemPrompt,
              jsonMode: true,
              retries: 0,
              prefer: 'deepseek',
            })) {
              if (delta.type === 'thinking') {
                thinkingText += delta.delta
                controller.enqueue(encoder.encode(`event: thinking\ndata: ${JSON.stringify({ delta: delta.delta })}\n\n`))
              } else if (delta.type === 'done' && delta.text) {
                streamedText = delta.text
                streamSucceeded = true
              }
            }
          } catch (streamErr) {
            console.warn('AI stream failed, falling back to non-streaming:', streamErr)
          }

          // Fall back to non-streaming if streaming failed or returned no text
          if (!streamSucceeded || !streamedText) {
            try {
              const response = await callAI(userPrompt, {
                systemPrompt,
                jsonMode: true,
                retries: 2,
                prefer: 'deepseek',
              })
              streamedText = response.text
              // Emit a short thinking preamble for consistent UX
              if (!thinkingText) {
                controller.enqueue(encoder.encode(`event: thinking\ndata: ${JSON.stringify({ delta: 'Thinking about your request…' })}\n\n`))
              }
            } catch (aiErr) {
              const errMsg = aiErr instanceof Error ? aiErr.message : 'AI call failed'
              controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify({ action: 'talk', reply: `Sorry, I ran into an issue: ${errMsg}`, blocks, settings })}\n\n`))
              controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`))
              controller.close()
              return
            }
          }

          // ── Parse AI response ──────────────────────────────────────────────
          const cleanText = extractJson(streamedText)

          let parsed: AIResponse
          try {
            const raw = JSON.parse(cleanText)

            // Normalize action — treat unknown/missing as 'talk' (safe default)
            const validActions = ['talk', 'clarify', 'edit']
            const action: AIResponse['action'] = validActions.includes(raw.action) ? raw.action : 'talk'

            parsed = {
              action,
              reply: typeof raw.reply === 'string' ? raw.reply : (raw.explanation || 'Done.'),
              question: typeof raw.question === 'string' ? raw.question : undefined,
              ops: raw.ops,
              blocks: raw.blocks,
              settings: raw.settings,
            }
          } catch {
            console.error('Failed to parse AI JSON:', streamedText)
            controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify({ action: 'talk', reply: 'I had trouble processing that. Could you rephrase?', blocks, settings })}\n\n`))
            controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`))
            controller.close()
            return
          }

          // ── Apply edits only when action='edit' ────────────────────────────
          let resolvedBlocks: Block[] = blocks as unknown as Block[]
          let resolvedSettings: FunnelSettings = settings as FunnelSettings

          if (parsed.action === 'edit') {
            // Ignore stray ops on non-edit actions (already handled by action check)
            if (parsed.ops && Array.isArray(parsed.ops) && parsed.ops.length > 0) {
              try {
                const result = applyOps(blocks as unknown as Block[], settings as FunnelSettings, parsed.ops, parsed.settings)
                resolvedBlocks = result.blocks
                resolvedSettings = result.settings
              } catch (err) {
                console.error('Ops application failed:', err)
                // Funnel stays unchanged on error
              }
            } else if (parsed.blocks && Array.isArray(parsed.blocks)) {
              // Full rebuild
              try {
                resolvedBlocks = (parsed.blocks as unknown as Block[]).map(b => {
                  const safeProps = validateBlockProps(b.type, b.props as unknown as Record<string, unknown>)
                  return { ...b, props: safeProps } as unknown as Block
                })
                resolvedSettings = { ...settings, ...(parsed.settings || {}) } as FunnelSettings
              } catch (err) {
                console.error('Full rebuild validation failed:', err)
                // Funnel stays unchanged on error
              }
            } else if (parsed.settings && Object.keys(parsed.settings).length > 0) {
              // Settings-only edit
              resolvedSettings = { ...settings, ...parsed.settings } as FunnelSettings
            }
            // If no ops, no blocks, no settings — it's an edit with nothing to change (e.g. "make it better" but AI returned empty ops). Keep unchanged.
          }
          // For talk/clarify: resolvedBlocks/settings stay as current state (unchanged)

          // ── Build message event ────────────────────────────────────────────
          const messagePayload: Record<string, unknown> = {
            action: parsed.action,
            reply: parsed.reply,
            blocks: resolvedBlocks,
            settings: resolvedSettings,
          }
          if (parsed.question) {
            messagePayload.question = parsed.question
          }
          // Include resolved ops/blocks for the client to know what changed
          if (parsed.ops && parsed.action === 'edit') {
            messagePayload.ops = parsed.ops
          }

          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(messagePayload)}\n\n`))

          // ── Save chat messages ─────────────────────────────────────────────
          if (user && funnelId) {
            try {
              await supabase.from('chat_messages').insert([
                { user_id: user.id, funnel_id: funnelId, console_type: 'editor', role: 'user', content: prompt },
                { user_id: user.id, funnel_id: funnelId, console_type: 'editor', role: 'assistant', content: parsed.reply },
              ])
            } catch (dbErr) {
              console.error('Failed to save chat message:', dbErr)
            }
          }

          controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`))
          controller.close()
        } catch (error: unknown) {
          console.error('API route stream error:', error)
          const errMsg = error instanceof Error ? error.message : 'An unknown error occurred.'
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify({ action: 'talk', reply: `Something went wrong: ${errMsg}`, blocks, settings })}\n\n`))
          controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
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
