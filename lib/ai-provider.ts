// Unified AI provider chain with retries, fallbacks, and streaming.
// All AI routes should use callAI() or callAIStream() instead of directly calling provider APIs.
//
// Chain: DeepSeek (Kenzo AI) → Vercel AI Gateway → Anthropic → OpenAI → Gemini
// DeepSeek is the default. Each provider gets one attempt; on failure, fall through.
// Retries (if set) repeat the full chain.

export interface AIResponse {
  text: string
  provider: string
  model: string
}

export interface AICallOptions {
  systemPrompt?: string
  jsonMode?: boolean
  maxTokens?: number
  temperature?: number
  /** Number of times to retry the full provider chain on failure (default 0) */
  retries?: number
  /** Preferred provider — skip to this if key is available */
  prefer?: 'deepseek' | 'aigateway' | 'anthropic' | 'openai' | 'gemini'
  /** If true, callAI returns a ReadableStream<Uint8Array> for SSE streaming */
  stream?: boolean
}

interface ProviderDef {
  name: string
  model: string
  call: (userPrompt: string, opts: AICallOptions) => Promise<string>
  /** Streaming call — yields deltas. Only DeepSeek supports reasoning_content. */
  callStream?: (userPrompt: string, opts: AICallOptions) => AsyncGenerator<StreamDelta>
}

export type StreamDelta =
  | { type: 'thinking'; delta: string }
  | { type: 'text'; delta: string }
  | { type: 'done'; text: string; provider: string; model: string }

/**
 * Call AI with automatic provider fallback chain.
 * Throws if all providers fail.
 */
export async function callAI(userPrompt: string, options: AICallOptions = {}): Promise<AIResponse> {
  const { retries = 0 } = options
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await tryProviderChain(userPrompt, options)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
      }
    }
  }

  throw lastError || new Error('All AI providers failed')
}

/**
 * Streaming AI call — yields thinking + text deltas, then a done event.
 * Falls back through the provider chain on failure.
 */
export async function* callAIStream(
  userPrompt: string,
  options: AICallOptions = {},
): AsyncGenerator<StreamDelta> {
  const { retries = 0 } = options
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const chain = buildChain(options.prefer)
      for (const provider of chain) {
        if (!providerKey(provider.name)) continue
        if (!provider.callStream) continue // skip providers without streaming
        try {
          let hasThinking = false
          let fullText = ''
          for await (const delta of provider.callStream(userPrompt, options)) {
            if (delta.type === 'thinking') {
              hasThinking = true
              yield delta
            } else if (delta.type === 'text') {
              fullText += delta.delta
              // Don't yield text deltas — we collect and emit as done
            } else if (delta.type === 'done') {
              // If no thinking was emitted, send a short preamble for consistent UX
              if (!hasThinking) {
                yield { type: 'thinking', delta: 'Analyzing your request…' }
              }
              yield { type: 'done', text: fullText || delta.text, provider: delta.provider || provider.name, model: delta.model || provider.model }
              return
            }
          }
          // Stream ended without done event
          yield { type: 'done', text: fullText, provider: provider.name, model: provider.model }
          return
        } catch (err) {
          console.warn(`AI provider ${provider.name} stream failed:`, err instanceof Error ? err.message : err)
        }
      }
      throw new Error('All streaming providers failed')
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
      }
    }
  }

  // All retries exhausted — emit error as thinking
  const errMsg = lastError?.message || 'All AI providers failed'
  yield { type: 'thinking', delta: `Error: ${errMsg}` }
  yield { type: 'done', text: '', provider: 'none', model: 'none' }
}

async function tryProviderChain(userPrompt: string, opts: AICallOptions): Promise<AIResponse> {
  const { prefer } = opts
  const chain = buildChain(prefer)

  for (const provider of chain) {
    if (!providerKey(provider.name)) continue
    try {
      const text = await provider.call(userPrompt, opts)
      if (text) {
        return { text, provider: provider.name, model: provider.model }
      }
    } catch (err) {
      console.warn(`AI provider ${provider.name} failed:`, err instanceof Error ? err.message : err)
    }
  }

  throw new Error('All AI providers failed — no API keys configured or all calls errored')
}

function buildChain(prefer?: AICallOptions['prefer']): ProviderDef[] {
  const all: ProviderDef[] = [
    {
      name: 'deepseek',
      model: normalizeModel(process.env.DEEPSEEK_API_MODEL || 'deepseek-chat'),
      call: callDeepSeek,
      callStream: callDeepSeekStream,
    },
    {
      name: 'aigateway',
      model: process.env.CLYRO_AI_MODEL || 'anthropic/claude-sonnet-4.5',
      call: callAIGateway,
    },
    {
      name: 'anthropic',
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6-20250514',
      call: callAnthropic,
    },
    {
      name: 'openai',
      model: 'gpt-4o',
      call: callOpenAI,
    },
    {
      name: 'gemini',
      model: 'gemini-2.5-flash',
      call: callGemini,
    },
  ]

  if (prefer) {
    const idx = all.findIndex(p => p.name === prefer)
    if (idx > 0) {
      const [preferred] = all.splice(idx, 1)
      all.unshift(preferred)
    }
  }

  return all
}

function providerKey(name: string): string | undefined {
  switch (name) {
    case 'deepseek': return process.env.DEEPSEEK_API_KEY
    case 'aigateway': return process.env.AI_GATEWAY_API_KEY
    case 'anthropic': return process.env.ANTHROPIC_API_KEY
    case 'openai': return process.env.OPENAI_API_KEY
    case 'gemini': return process.env.GEMINI_API_KEY
    default: return undefined
  }
}

function normalizeModel(model: string): string {
  if (model === 'deepseek-v4-pro' || model === 'deepseek-v4-flash' || model === 'fast') {
    return 'deepseek-chat'
  }
  return model
}

/** Resolve model from user preference: "best" → Claude, "fast" → DeepSeek */
export function resolvePrefer(modelChoice?: string): AICallOptions['prefer'] | undefined {
  if (modelChoice === 'best' || modelChoice === 'claude') return 'anthropic'
  if (modelChoice === 'fast' || modelChoice === 'deepseek-v4-pro' || modelChoice === 'deepseek-v4-flash') return 'deepseek'
  if (modelChoice === 'gpt') return 'openai'
  return undefined
}

// ── Provider implementations ──────────────────────────────────────────────────

async function callDeepSeek(userPrompt: string, opts: AICallOptions): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY!
  const model = normalizeModel(process.env.DEEPSEEK_API_MODEL || 'deepseek-chat')

  const body: Record<string, unknown> = {
    model,
    messages: buildMessages(userPrompt, opts.systemPrompt),
    max_tokens: opts.maxTokens || 8192,
    temperature: opts.temperature ?? 0.2,
    frequency_penalty: 0.3,
    presence_penalty: 0.3,
  }

  if (opts.jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`DeepSeek ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

/** DeepSeek streaming — yields reasoning_content as thinking deltas, content as text deltas */
async function* callDeepSeekStream(userPrompt: string, opts: AICallOptions): AsyncGenerator<StreamDelta> {
  const key = process.env.DEEPSEEK_API_KEY!
  const model = normalizeModel(process.env.DEEPSEEK_API_MODEL || 'deepseek-chat')

  const body: Record<string, unknown> = {
    model,
    messages: buildMessages(userPrompt, opts.systemPrompt),
    max_tokens: opts.maxTokens || 8192,
    temperature: opts.temperature ?? 0.2,
    frequency_penalty: 0.3,
    presence_penalty: 0.3,
    stream: true,
  }

  if (opts.jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`DeepSeek stream ${res.status}: ${errText.slice(0, 200)}`)
  }

  const reader = res.body?.getReader()
  if (!reader) throw new Error('No response body for DeepSeek stream')

  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const dataStr = trimmed.slice(6)
        if (dataStr === '[DONE]') continue

        try {
          const parsed = JSON.parse(dataStr)
          const choice = parsed.choices?.[0]
          const delta = choice?.delta
          if (!delta) continue

          // Emit reasoning_content as thinking
          if (delta.reasoning_content) {
            yield { type: 'thinking', delta: delta.reasoning_content }
          }

          // Collect content for final done event
          if (delta.content) {
            fullText += delta.content
          }
        } catch {
          // Skip unparseable SSE lines
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  yield { type: 'done', text: fullText, provider: 'deepseek', model }
}

async function callAIGateway(userPrompt: string, opts: AICallOptions): Promise<string> {
  const key = process.env.AI_GATEWAY_API_KEY!
  const model = process.env.CLYRO_AI_MODEL || 'anthropic/claude-sonnet-4.5'

  const res = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: buildMessages(userPrompt, opts.systemPrompt),
      temperature: opts.temperature ?? 0.2,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`AI Gateway ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callAnthropic(userPrompt: string, opts: AICallOptions): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY!
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6-20250514'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: opts.maxTokens || 8192,
      system: opts.systemPrompt || '',
      messages: [{ role: 'user', content: userPrompt }],
      temperature: opts.temperature ?? 0.2,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text || ''
}

async function callOpenAI(userPrompt: string, opts: AICallOptions): Promise<string> {
  const key = process.env.OPENAI_API_KEY!

  const body: Record<string, unknown> = {
    model: 'gpt-4o',
    messages: buildMessages(userPrompt, opts.systemPrompt),
    temperature: opts.temperature ?? 0.2,
  }

  if (opts.jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callGemini(userPrompt: string, opts: AICallOptions): Promise<string> {
  const key = process.env.GEMINI_API_KEY!

  const fullPrompt = opts.systemPrompt
    ? `${opts.systemPrompt}\n\n${userPrompt}`
    : userPrompt

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? 0.2,
  }
  if (opts.jsonMode) {
    generationConfig.responseMimeType = 'application/json'
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig,
      }),
    },
  )

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildMessages(userPrompt: string, systemPrompt?: string) {
  if (!systemPrompt) {
    return [{ role: 'user' as const, content: userPrompt }]
  }
  return [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: userPrompt },
  ]
}

// ── Simulated streaming (fallback for non-streaming providers) ────────────────

export interface StreamEvent {
  type: 'token' | 'done' | 'error'
  content?: string
  data?: unknown
  error?: string
}

/**
 * Creates a ReadableStream that simulates streaming by emitting
 * the explanation text token-by-token, then a final done event with full data.
 * Used as fallback when real provider streaming isn't available.
 */
export function createSimulatedStream(
  explanation: string,
  finalData: Record<string, unknown>,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const words = splitIntoChunks(explanation, 3)
  let index = 0

  return new ReadableStream({
    async pull(controller) {
      if (index < words.length) {
        const event: StreamEvent = { type: 'token', content: words[index] }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        index++
        await new Promise(r => setTimeout(r, 20))
      } else {
        const event: StreamEvent = { type: 'done', data: finalData }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        controller.close()
      }
    },
  })
}

function splitIntoChunks(text: string, wordsPerChunk: number): string[] {
  const parts = text.split(/(\s+)/)
  const chunks: string[] = []
  for (let i = 0; i < parts.length; i += wordsPerChunk * 2) {
    const chunk = parts.slice(i, i + wordsPerChunk * 2).join('')
    if (chunk.trim()) chunks.push(chunk)
  }
  return chunks
}
