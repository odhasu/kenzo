import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

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

const SYSTEM_PROMPT = `You are Kenzo AI, a design-focused funnel building assistant.
You are given the current state of a webpage: its blocks (a JSON array) and its global settings (accentColor, bgColor, textColor, font, tickerSpeed, pageTitle, faviconUrl).
Your task is to modify the page blocks and/or global settings based on the user's request.

Here is the schema of the blocks:
1. 'heading': props: { text: string }
2. 'text': props: { text: string }
3. 'button': props: { label: string; href: string }
4. 'image': props: { src: string; alt: string }
5. 'form': props: { fields: ("email" | "name" | "phone")[] }
6. 'ic-hero': props: { badge: string; headline: string; subtext: string; ctaLabel: string; ctaHref: string }
7. 'ic-ticker': props: { items: string[] }
8. 'ic-cards': props: { headline: string; cards: { title: string; desc: string; bullets: string[] }[]; ctaLabel: string; ctaHref: string }
9. 'ic-faq': props: { headline: string; items: { q: string; a: string }[] }
10. 'ic-apply': props: { headline: string; subtext: string }
11. 'ic-cta': props: { label: string; href: string; subtext: string }
12. 'ic-results': props: { headline: string; photos: string[] }

Every block must have:
- "id": a unique string (generate a new UUID for new blocks, or reuse existing IDs for unchanged blocks)
- "type": one of the block type strings above
- "props": matching the schema for that block type

Here is the schema of the global settings:
- "accentColor": hex color (e.g. "#39FF14" or "#ff007f")
- "bgColor": hex color (e.g. "#050505" or "#ffffff")
- "textColor": hex color (e.g. "#ffffff" or "#000000")
- "font": string (one of: 'Inter', 'Satoshi', 'DM Sans', 'Poppins', 'Plus Jakarta Sans', 'Space Grotesk', 'Montserrat')
- "tickerSpeed": number (between 8 and 80)
- "pageTitle": string
- "faviconUrl": string

You can:
- Modify existing blocks (change their text, labels, urls, etc.)
- Add new blocks (generate a new UUID for the block id using standard format like 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
- Delete blocks
- Reorder blocks by changing their position in the JSON array
- Modify global settings (colors, fonts, pageTitle, etc.)

Design Rules:
- If the user asks for a theme (dark, light, neon, luxury, corporate, etc.), update the bgColor, textColor, accentColor, and font appropriately to make it look premium.
- Never create block types outside of the 12 types defined above.
- Make changes high-converting, professional, and visually matching the design system.
- If a block is added, populate it with realistic, premium, context-specific placeholder text instead of lorem ipsum.

Always return a valid JSON object matching this exact structure:
{
  "blocks": [...],
  "settings": {...},
  "explanation": "A concise explanation (1-2 sentences) of what changes were made."
}

Do NOT wrap the output in markdown code blocks. Return ONLY the raw JSON object.`

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
