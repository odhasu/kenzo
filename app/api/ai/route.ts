import { NextResponse } from 'next/server'

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

FEW-SHOT EXAMPLES FOR TRAINING:

Example 1:
User Request: "make the page dark mode with neon green accent, and add a hero block and ticker for a high-ticket flipping course"
Output:
{
  "blocks": [
    {
      "id": "e8e61ba4-7221-4fbe-8cb2-20c2bbfde71f",
      "type": "ic-hero",
      "props": {
        "badge": "LOCKED IN FOR 2026",
        "headline": "Build a $10K/Month High-Ticket Reselling Business from Scratch",
        "subtext": "Access direct wholesale vendors, StockX-approved suppliers, and 1-on-1 coaching.",
        "ctaLabel": "Apply For Early Access ↗",
        "ctaHref": "#apply"
      }
    },
    {
      "id": "4d7db8f1-c420-410a-bf19-ef875631bbbe",
      "type": "ic-ticker",
      "props": {
        "items": [
          "Direct Vendor Access",
          "Weekly Live Group Q&A",
          "StockX & GOAT Passing OEM Suppliers",
          "24/7 VIP Discord Community"
        ]
      }
    }
  ],
  "settings": {
    "accentColor": "#39FF14",
    "bgColor": "#050505",
    "textColor": "#ffffff",
    "font": "Space Grotesk",
    "tickerSpeed": 30,
    "pageTitle": "High Ticket Reselling Funnel",
    "faviconUrl": ""
  },
  "explanation": "I have converted the page to dark mode with a neon green accent color and Space Grotesk font. I also added a conversion-focused Hero section and a benefits ticker at the top."
}

Example 2:
User Request: "change accent color to pink, add FAQ block, and update hero cta to go to custom link"
Current state blocks:
[
  {
    "id": "e8e61ba4-7221-4fbe-8cb2-20c2bbfde71f",
    "type": "ic-hero",
    "props": {
      "badge": "LOCKED IN FOR 2026",
      "headline": "Build a $10K/Month High-Ticket Reselling Business from Scratch",
      "subtext": "Access direct wholesale vendors, StockX-approved suppliers, and 1-on-1 coaching.",
      "ctaLabel": "Apply For Early Access ↗",
      "ctaHref": "#apply"
    }
  },
  {
    "id": "4d7db8f1-c420-410a-bf19-ef875631bbbe",
    "type": "ic-ticker",
    "props": {
      "items": [
        "Direct Vendor Access",
        "Weekly Live Group Q&A",
        "StockX & GOAT Passing OEM Suppliers",
        "24/7 VIP Discord Community"
      ]
    }
  }
]
Output:
{
  "blocks": [
    {
      "id": "e8e61ba4-7221-4fbe-8cb2-20c2bbfde71f",
      "type": "ic-hero",
      "props": {
        "badge": "LOCKED IN FOR 2026",
        "headline": "Build a $10K/Month High-Ticket Reselling Business from Scratch",
        "subtext": "Access direct wholesale vendors, StockX-approved suppliers, and 1-on-1 coaching.",
        "ctaLabel": "Apply For Early Access ↗",
        "ctaHref": "https://example.com/custom-apply"
      }
    },
    {
      "id": "4d7db8f1-c420-410a-bf19-ef875631bbbe",
      "type": "ic-ticker",
      "props": {
        "items": [
          "Direct Vendor Access",
          "Weekly Live Group Q&A",
          "StockX & GOAT Passing OEM Suppliers",
          "24/7 VIP Discord Community"
        ]
      }
    },
    {
      "id": "a9332152-32b0-4cb5-8cc4-e918bbf149cd",
      "type": "ic-faq",
      "props": {
        "headline": "Frequently Asked Questions",
        "items": [
          {
            "q": "What is the refund policy?",
            "a": "We offer a 100% satisfaction guarantee. If you don't make a profit in your first 30 days, we'll refund you."
          },
          {
            "q": "How much starting capital do I need?",
            "a": "Most members start with $150-$500 to buy inventory from vendors."
          }
        ]
      }
    }
  ],
  "settings": {
    "accentColor": "#ff007f",
    "bgColor": "#050505",
    "textColor": "#ffffff",
    "font": "Space Grotesk",
    "tickerSpeed": 30,
    "pageTitle": "High Ticket Reselling Funnel",
    "faviconUrl": ""
  },
  "explanation": "Updated the accent color to pink, changed the Hero CTA link to your custom URL, and added a premium FAQ block at the bottom."
}

Always return a valid JSON object matching this exact structure:
{
  "blocks": [...],
  "settings": {...},
  "explanation": "A concise explanation (1-2 sentences) of what changes were made."
}

Do NOT wrap the output in markdown code blocks. Return ONLY the raw JSON object.`

export async function POST(request: Request) {
  try {
    const { blocks, settings, prompt } = await request.json()

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
      const model = process.env.DEEPSEEK_API_MODEL || 'deepseek-chat'
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
          temperature: 0.2,
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

    // Clean up response text in case markdown code blocks are returned
    let cleanText = responseText.trim()
    if (cleanText.includes('```json')) {
      cleanText = cleanText.split('```json')[1].split('```')[0].trim()
    } else if (cleanText.includes('```')) {
      cleanText = cleanText.split('```')[1].split('```')[0].trim()
    }

    try {
      const parsedData = JSON.parse(cleanText)
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
