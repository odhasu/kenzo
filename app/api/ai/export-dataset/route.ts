import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPT } from '@/lib/ai-prompt'

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Verify Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. Fetch user's pages and funnels
    const { data: funnels, error } = await supabase
      .from('funnels')
      .select('*, pages(*)')
      .eq('user_id', user.id)

    if (error) {
      return new Response(JSON.stringify({ error: 'Database error', message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!funnels || funnels.length === 0) {
      return new Response(JSON.stringify({ error: 'No data', message: 'No funnels found to export.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const jsonlLines: string[] = []

    for (const funnel of funnels) {
      const page = funnel.pages?.[0]
      if (!page || !page.content || page.content.length === 0) continue

      const blocks = page.content
      const settings = page.settings || {}

      const userQuery = `Create a high-converting landing page named "${funnel.name}" with a custom design matching settings: ${JSON.stringify(settings)}`
      
      const assistantOutput = JSON.stringify({
        blocks: blocks,
        settings: settings,
        explanation: `Initialized page blocks and settings for the "${funnel.name}" funnel.`
      })

      const messagePair = {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userQuery },
          { role: 'assistant', content: assistantOutput }
        ]
      }

      jsonlLines.push(JSON.stringify(messagePair))
    }

    if (jsonlLines.length === 0) {
      return new Response(JSON.stringify({ error: 'No data', message: 'No active pages with content found to export.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 3. Compile output and return response with file download headers
    const output = jsonlLines.join('\n') + '\n'

    return new Response(output, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="deepseek_training_data.jsonl"',
      },
    })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unknown error occurred'
    return new Response(JSON.stringify({ error: 'Internal Error', message: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
