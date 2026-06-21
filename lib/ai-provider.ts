// Unified AI provider chain with retries and fallbacks.
// All AI routes should use callAI() instead of directly calling provider APIs.
//
// Chain: DeepSeek → Vercel AI Gateway → Anthropic → OpenAI → Gemini
// Each provider gets one attempt; on failure, fall through to the next.
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
}

interface ProviderDef {
  name: string
  model: string
  call: (userPrompt: string, opts: AICallOptions) => Promise<string>
}

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
        // Brief delay before retry
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
      }
    }
  }

  throw lastError || new Error('All AI providers failed')
}

async function tryProviderChain(userPrompt: string, opts: AICallOptions): Promise<AIResponse> {
  const { prefer } = opts

  // Build ordered chain — prefer skips to front
  const chain = buildChain(prefer)

  for (const provider of chain) {
    if (!providerKey(provider.name)) continue // Skip if no API key
    try {
      const text = await provider.call(userPrompt, opts)
      if (text) {
        return { text, provider: provider.name, model: provider.model }
      }
    } catch (err) {
      console.warn(`AI provider ${provider.name} failed:`, err instanceof Error ? err.message : err)
      // Fall through to next provider
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
    },
    {
      name: 'aigateway',
      model: process.env.CLYRO_AI_MODEL || 'anthropic/claude-sonnet-4.5',
      call: callAIGateway,
    },
    {
      name: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
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
  // DeepSeek v4 model names map to 'deepseek-chat'
  if (model === 'deepseek-v4-pro' || model === 'deepseek-v4-flash') {
    return 'deepseek-chat'
  }
  return model
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

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: opts.maxTokens || 4000,
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
