import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CHAT_CREATE_PROMPT } from '@/lib/ai-prompt'
import type { Block, FunnelSettings } from '@/types/blocks'

export const maxDuration = 300 // seconds — DeepSeek multi-turn can be slow
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Verify Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, draftBlocks, draftSettings } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Missing messages array' }, { status: 400 })
    }

    // Build system message + conversation history
    const systemMsg = { role: 'system', content: CHAT_CREATE_PROMPT }

    // Include current funnel state as context
    const stateContext = `Current funnel state:\nBlocks: ${JSON.stringify(draftBlocks || [])}\nSettings: ${JSON.stringify(draftSettings || {})}`

    const apiMessages = [
      systemMsg,
      { role: 'user', content: stateContext },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    const deepseekKey = process.env.DEEPSEEK_API_KEY
    const aiGatewayKey = process.env.AI_GATEWAY_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    const openAiKey = process.env.OPENAI_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    let responseText = ''

    // 1. DeepSeek
    if (deepseekKey) {
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
          messages: apiMessages,
          temperature: 0.3,
          frequency_penalty: 0.3,
          presence_penalty: 0.3,
          response_format: { type: 'json_object' },
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`DeepSeek API error: ${res.status} ${errText}`)
      }

      const data = await res.json()
      responseText = data.choices?.[0]?.message?.content || ''
    }
    // 2. Vercel AI Gateway
    else if (aiGatewayKey) {
      const model = process.env.CLYRO_AI_MODEL || 'anthropic/claude-sonnet-4.5'
      const res = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiGatewayKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          temperature: 0.3,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`AI Gateway API error: ${res.status} ${errText}`)
      }

      const data = await res.json()
      responseText = data.choices?.[0]?.message?.content || ''
    }
    // 3. Anthropic
    else if (anthropicKey) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          system: CHAT_CREATE_PROMPT,
          messages: apiMessages.filter(m => m.role !== 'system'),
          temperature: 0.3,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Anthropic API error: ${res.status} ${errText}`)
      }

      const data = await res.json()
      responseText = data.content?.[0]?.text || ''
    }
    // 4. OpenAI
    else if (openAiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: apiMessages,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`OpenAI API error: ${res.status} ${errText}`)
      }

      const data = await res.json()
      responseText = data.choices?.[0]?.message?.content || ''
    }
    // 5. Gemini
    else if (geminiKey) {
      const combinedPrompt = `${CHAT_CREATE_PROMPT}\n\n${apiMessages.filter(m => m.role !== 'system').map(m => `${m.role}: ${m.content}`).join('\n')}`
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: combinedPrompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Gemini API error: ${res.status} ${errText}`)
      }

      const data = await res.json()
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }
    // 6. No Key Configured
    else {
      return NextResponse.json(
        { error: 'NO_API_KEY', message: 'No AI API keys configured.' },
        { status: 400 }
      )
    }

    // Clean up response text in case markdown code blocks are returned
    let cleanText = responseText.trim()
    if (cleanText.includes('```json')) {
      cleanText = cleanText.split('```json')[1].split('```')[0].trim()
    } else if (cleanText.includes('```')) {
      cleanText = cleanText.split('```')[1].split('```')[0].trim()
    }

    try {
      const parsedData = JSON.parse(cleanText)
      const reply = parsedData.reply || ''
      const blocks: Block[] | null = parsedData.blocks || null
      const settings: FunnelSettings | null = parsedData.settings || null
      const ready = parsedData.ready === true

      // Save chat messages to DB
      try {
        const lastUserMsg = messages[messages.length - 1]
        if (lastUserMsg && lastUserMsg.role === 'user') {
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            console_type: 'create',
            role: 'user',
            content: lastUserMsg.content,
          })
        }
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          console_type: 'create',
          role: 'assistant',
          content: reply,
        })
      } catch (dbErr) {
        console.error('Failed to save chat-create message:', dbErr)
      }

      return NextResponse.json({ reply, blocks, settings, ready })
    } catch (parseError) {
      console.error('Failed to parse chat-create JSON:', responseText, parseError)
      return NextResponse.json(
        { error: 'PARSE_ERROR', message: 'AI returned invalid JSON.', raw: responseText },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    console.error('Chat-create API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: errorMessage },
      { status: 500 }
    )
  }
}
