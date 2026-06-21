import { NextRequest, NextResponse } from 'next/server'

const STEPS: Record<string, { title: string; description: string; questions: string[] }> = {
  niche: {
    title: 'Tell OpBot about your business',
    description: 'What you sell, to whom, and why it matters.',
    questions: [
      'What do you sell? (coaching, consulting, course, done-for-you service, agency, or something else?)',
      "What's your specific niche or industry? Be as specific as possible.",
      "What's the main transformation or outcome you deliver to clients?",
      'Who are your main competitors or alternatives your potential clients consider?',
    ],
  },
  'ideal-client': {
    title: 'Who is your dream client?',
    description: 'The more specific, the better the copy.',
    questions: [
      'Describe your dream client. What role are they in, what situation are they in, and how much pain are they in?',
      "What have they tried before that didn't work? List the things that failed them.",
      "What's the one thing they want most right now? The thing they'd pay anything for.",
    ],
  },
  offer: {
    title: 'What are you selling?',
    description: 'The offer, the format, and what makes it different.',
    questions: [
      "What's your main offer called? Give it a name.",
      "What's the format? (1:1 coaching, group program, online course, done-for-you service, or a mix?)",
      "What's included? List every deliverable — sessions, materials, access, community, bonuses.",
      "What's your guarantee or risk reversal? If you don't have one, say so.",
    ],
  },
  pricing: {
    title: 'How do you price?',
    description: 'Price, value, and how clients pay.',
    questions: [
      "What's the price of your main offer? (A range is fine if it varies.)",
      "What's the value or ROI your clients typically get? Be concrete — $$, time saved, promotions earned.",
      'Do you offer payment plans, pay-in-full only, or both?',
    ],
  },
  'pain-points': {
    title: 'Objections and proof',
    description: 'What stops them from buying, and what proves you can deliver.',
    questions: [
      "What keeps your ideal client up at night? What's the problem they can't shake?",
      "What's their biggest objection to buying from you? What's the thing they're scared of?",
      "What happens if they don't solve this problem? What's the cost of doing nothing?",
      "What proof do you have that your offer works? Testimonials, case studies, revenue numbers, before/afters.",
    ],
  },
}

const STEP_ORDER = ['niche', 'ideal-client', 'offer', 'pricing', 'pain-points']

export async function GET() {
  // Return the full interview structure — 5 steps, 18 questions total.
  const steps = STEP_ORDER.map((key) => ({
    key,
    title: STEPS[key].title,
    description: STEPS[key].description,
    questions: STEPS[key].questions,
  }))

  const totalQuestions = steps.reduce((sum, s) => sum + s.questions.length, 0)

  return NextResponse.json({
    steps,
    totalQuestions,
    stepCount: steps.length,
  })
}
