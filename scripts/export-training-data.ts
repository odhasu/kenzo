import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { SYSTEM_PROMPT } from '../lib/ai-prompt'

// 1. Simple self-contained env loader
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const equalsIdx = trimmed.indexOf('=')
      if (equalsIdx > 0) {
        const key = trimmed.substring(0, equalsIdx).trim()
        let val = trimmed.substring(equalsIdx + 1).trim()
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1)
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1)
        }
        process.env[key] = val
      }
    }
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Use service role key if available, fallback to anon key for dev testing
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function exportTrainingData() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be set in .env.local')
    process.exit(1)
  }

  console.log('📡 Connecting to Supabase...')
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🔍 Fetching funnels and page content...')
  const { data: funnels, error } = await supabase
    .from('funnels')
    .select('*, pages(*)')

  if (error) {
    console.error('❌ Database error:', error.message)
    process.exit(1)
  }

  if (!funnels || funnels.length === 0) {
    console.log('⚠️ No funnels found to export.')
    process.exit(0)
  }

  const jsonlLines: string[] = []

  for (const funnel of funnels) {
    const page = funnel.pages?.[0]
    if (!page || !page.content || page.content.length === 0) continue

    const blocks = page.content
    const settings = page.settings || {}

    // Formulate a clean user query that matches how someone would request this funnel
    const userQuery = `Create a high-converting landing page named "${funnel.name}" with a custom design matching settings: ${JSON.stringify(settings)}`
    
    const assistantOutput = JSON.stringify({
      blocks: blocks,
      settings: settings,
      explanation: `Initialized page blocks and settings for the "${funnel.name}" funnel.`
    })

    // Construct the standard chat completion format used for model training/fine-tuning
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
    console.log('⚠️ No active page layouts found to compile into training data.')
    process.exit(0)
  }

  const outputPath = path.join(process.cwd(), 'deepseek_training_data.jsonl')
  fs.writeFileSync(outputPath, jsonlLines.join('\n') + '\n', 'utf8')

  console.log(`\n🎉 Success! Exported ${jsonlLines.length} training pair(s) to:`)
  console.log(`   📂 ${outputPath}`)
  console.log('\nYou can now upload this JSONL file to DeepSeek, OpenAI, or other providers to fine-tune your model.')
}

exportTrainingData().catch((err) => {
  console.error('❌ Export failed:', err)
  process.exit(1)
})
