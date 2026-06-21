import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPT, extractJson } from '@/lib/ai-prompt'

export async function POST(request: Request) {
  try {
    const { blocks, settings, prompt, model: reqModel, funnelId } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY
    const aiGatewayKey = process.env.AI_GATEWAY_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    const openAiKey = process.env.OPENAI_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    let responseText = ''
    const userPrompt = `Current blocks:\n${JSON.stringify(blocks, null, 2)}\n\nCurrent settings:\n${JSON.stringify(settings, null, 2)}\n\nUser request:\n${prompt}`

    // 1. DeepSeek
    if (deepseekKey) {
      const baseModel = reqModel || process.env.DEEPSEEK_API_MODEL || 'deepseek-chat'
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
          model: model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 8192,
          temperature: 0.2,
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
          model: model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
        })
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
          system: SYSTEM_PROMPT,
          messages: [
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
        })
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
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
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
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${SYSTEM_PROMPT}\n\nUser request:\n${userPrompt}` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          }
        })
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

    // Robust JSON extraction — handles fences, truncation, stray prose
    const cleanText = extractJson(responseText)

    try {
      const parsedData = JSON.parse(cleanText)
      
      // Save chat messages in database if authenticated
      try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            funnel_id: funnelId || null,
            console_type: 'editor',
            role: 'user',
            content: prompt,
          })
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            funnel_id: funnelId || null,
            console_type: 'editor',
            role: 'assistant',
            content: parsedData.explanation || 'Page updated successfully!',
          })
        }
      } catch (dbErr) {
        console.error('Failed to save chat message to Supabase:', dbErr)
      }

      return NextResponse.json(parsedData)
    } catch (parseError) {
      console.error('Failed to parse AI JSON:', responseText, parseError)
      return NextResponse.json(
        { error: 'PARSE_ERROR', message: 'AI returned an invalid JSON structure.', raw: responseText },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    console.error('API route error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: errorMessage },
      { status: 500 }
    )
  }
}
