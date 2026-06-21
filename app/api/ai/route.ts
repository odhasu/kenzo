import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPT, extractJson } from '@/lib/ai-prompt'
import { callAI } from '@/lib/ai-provider'

export async function POST(request: Request) {
  try {
    const { blocks, settings, prompt, model: reqModel, funnelId, sessionId } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const userPrompt = `Current blocks:\n${JSON.stringify(blocks, null, 2)}\n\nCurrent settings:\n${JSON.stringify(settings, null, 2)}\n\nUser request:\n${prompt}`

    const response = await callAI(userPrompt, {
      systemPrompt: SYSTEM_PROMPT,
      jsonMode: true,
      retries: 1,
      prefer: reqModel === 'deepseek-v4-pro' || reqModel === 'deepseek-v4-flash' ? 'deepseek'
        : reqModel === 'claude' ? 'anthropic'
        : reqModel === 'gpt' ? 'openai'
        : undefined,
    })

    const cleanText = extractJson(response.text)

    try {
      const parsedData = JSON.parse(cleanText)

      // Save chat messages
      try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          let resolvedSessionId = sessionId || null

          // Auto-create session if none provided
          if (!resolvedSessionId && funnelId) {
            const autoTitle = prompt.slice(0, 40) + (prompt.length > 40 ? '…' : '')
            const { data: newSession } = await supabase
              .from('chat_sessions')
              .insert({
                user_id: user.id,
                funnel_id: funnelId,
                title: autoTitle,
              })
              .select('id')
              .single()
            if (newSession) resolvedSessionId = newSession.id
          }

          // Update session title to match first user message
          if (resolvedSessionId) {
            await supabase
              .from('chat_sessions')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', resolvedSessionId)
          }

          await supabase.from('chat_messages').insert([
            {
              user_id: user.id,
              funnel_id: funnelId || null,
              session_id: resolvedSessionId,
              console_type: 'editor',
              role: 'user',
              content: prompt,
            },
            {
              user_id: user.id,
              funnel_id: funnelId || null,
              session_id: resolvedSessionId,
              console_type: 'editor',
              role: 'assistant',
              content: parsedData.explanation || 'Page updated successfully!',
            },
          ])

          // Return the session id so the client can persist it
          if (resolvedSessionId) parsedData._sessionId = resolvedSessionId
        }
      } catch (dbErr) {
        console.error('Failed to save chat message:', dbErr)
      }

      return NextResponse.json({
        ...parsedData,
        _provider: response.provider,
        _model: response.model,
      })
    } catch (parseError) {
      console.error('Failed to parse AI JSON:', response.text, parseError)
      return NextResponse.json(
        { error: 'PARSE_ERROR', message: 'AI returned invalid JSON.', raw: response.text },
        { status: 500 },
      )
    }
  } catch (error: unknown) {
    console.error('API route error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: errorMessage },
      { status: 500 },
    )
  }
}
