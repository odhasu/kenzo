import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

// System instructions for the Developer AI Agent
const DEV_SYSTEM_PROMPT = `You are Kenzo Developer AI, an autonomous software engineering agent running inside the Kenzo Next.js web application.
Your task is to modify the source code of the website based on the user's request.

You have the power to read and write files in the local workspace.
You must output a structured JSON response to execute actions. You can perform one action at a time.

Available actions:
1. Read a file:
   {"action": "read", "path": "relative/path/to/file"}
   Use this to inspect the source code of any file before modifying it.

2. Write a file:
   {"action": "write", "path": "relative/path/to/file", "content": "complete content of the file"}
   Use this to create a new file or completely overwrite an existing file with updated code. Always write the FULL file content, not diffs.

3. Complete task:
   {"action": "done", "explanation": "Concise summary of the changes made to the codebase."}
   Use this when you have successfully implemented the user's request and verified the changes.

Rules:
- Never read or write files outside the project root directory.
- Avoid editing next-panic logs, node_modules, .next, or other configuration outputs unless necessary.
- Write clean, modern TypeScript / React code matching the conventions of the project.
- Only return a valid JSON object matching one of the three action shapes. Do NOT include markdown blocks. Do NOT output anything other than JSON.`

// Helper to ensure path is safe (no directory traversal)
function getSafePath(relPath: string) {
  const root = process.cwd()
  const resolved = path.resolve(root, relPath)
  if (!resolved.startsWith(root)) {
    throw new Error('Directory traversal protection: Access denied.')
  }
  return resolved
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Verify Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await request.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY
    if (!deepseekKey) {
      return NextResponse.json({ error: 'NO_API_KEY', message: 'DeepSeek API key is not configured.' }, { status: 400 })
    }

    // List all relevant files in the workspace (excluding node_modules, .next, .git)
    const fileList: string[] = []
    const traverseDir = (dir: string) => {
      const files = fs.readdirSync(dir)
      for (const file of files) {
        if (['node_modules', '.next', '.git', '.vercel', 'tsconfig.tsbuildinfo', '.DS_Store'].includes(file)) continue
        const fullPath = path.join(dir, file)
        const relPath = path.relative(process.cwd(), fullPath)
        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
          traverseDir(fullPath)
        } else {
          fileList.push(relPath)
        }
      }
    }
    traverseDir(process.cwd())

    // Initialize agent loop
    let loopCount = 0
    const maxLoops = 6
    const agentMessages = [
      { role: 'system', content: DEV_SYSTEM_PROMPT },
      { role: 'user', content: `Workspace files list:\n${fileList.join('\n')}\n\nUser request:\n${prompt}` }
    ]
    const logs: { action: string; path: string; status: string }[] = []
    let finalExplanation = ''

    while (loopCount < maxLoops) {
      loopCount++

      const baseModel = process.env.DEEPSEEK_API_MODEL || 'deepseek-chat'
      const model = (baseModel === 'deepseek-v4-pro' || baseModel === 'deepseek-v4-flash')
        ? 'deepseek-chat'
        : baseModel

      // Call DeepSeek API
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseekKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: agentMessages,
          temperature: 0.1,
          frequency_penalty: 0.3,
          presence_penalty: 0.3,
          response_format: { type: 'json_object' }
        })
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`DeepSeek API error in loop ${loopCount}: ${res.status} ${errText}`)
      }

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content || ''

      // Clean up JSON
      let cleanText = content.trim()
      if (cleanText.includes('```json')) {
        cleanText = cleanText.split('```json')[1].split('```')[0].trim()
      } else if (cleanText.includes('```')) {
        cleanText = cleanText.split('```')[1].split('```')[0].trim()
      }

      const parsedAction = JSON.parse(cleanText)
      const { action, path: relPath, content: fileContent, explanation } = parsedAction

      // Append assistant's response to prompt history
      agentMessages.push({ role: 'assistant', content })

      // Process Action
      if (action === 'read') {
        try {
          const safePath = getSafePath(relPath)
          if (!fs.existsSync(safePath)) {
            agentMessages.push({ role: 'user', content: `Error: File ${relPath} does not exist.` })
            logs.push({ action: 'read', path: relPath, status: 'Failed (Not Found)' })
          } else {
            const data = fs.readFileSync(safePath, 'utf8')
            agentMessages.push({ role: 'user', content: `File content of ${relPath}:\n${data}` })
            logs.push({ action: 'read', path: relPath, status: 'Success' })
          }
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'Unknown read error'
          agentMessages.push({ role: 'user', content: `Error reading file: ${errMsg}` })
          logs.push({ action: 'read', path: relPath, status: `Failed (${errMsg})` })
        }
      } else if (action === 'write') {
        try {
          const safePath = getSafePath(relPath)
          // Ensure directory exists
          fs.mkdirSync(path.dirname(safePath), { recursive: true })
          fs.writeFileSync(safePath, fileContent, 'utf8')
          agentMessages.push({ role: 'user', content: `Successfully wrote file: ${relPath}` })
          logs.push({ action: 'write', path: relPath, status: 'Success' })
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'Unknown write error'
          agentMessages.push({ role: 'user', content: `Error writing file: ${errMsg}` })
          logs.push({ action: 'write', path: relPath, status: `Failed (${errMsg})` })
        }
      } else if (action === 'done') {
        finalExplanation = explanation || 'Task completed successfully.'
        break
      } else {
        throw new Error(`Unknown action: ${action}`)
      }
    }

    if (loopCount === maxLoops && !finalExplanation) {
      finalExplanation = 'Agent execution timed out without calling done.'
    }

    // Save chat messages in database
    try {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        console_type: 'developer',
        role: 'user',
        content: prompt,
      })
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        console_type: 'developer',
        role: 'assistant',
        content: finalExplanation,
        logs: logs,
      })
    } catch (dbErr) {
      console.error('Failed to save developer chat message to Supabase:', dbErr)
    }

    return NextResponse.json({
      success: true,
      explanation: finalExplanation,
      logs: logs
    })

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Developer agent route error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: errMsg }, { status: 500 })
  }
}
