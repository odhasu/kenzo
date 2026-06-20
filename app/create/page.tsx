'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { BlockType, ThemeId, BackgroundId } from '@/types/blocks'

// ═══════════════════════════════════════════
// STYLE DEFINITIONS
// ═══════════════════════════════════════════
type StyleOption = {
  name: string
  description: string
  theme: ThemeId
  archetypeSections: BlockType[]
}

const STYLES: StyleOption[] = [
  {
    name: 'Waitlist',
    description: 'Minimal dark waitlist page — clean, direct, high contrast.',
    theme: 'dark-minimal',
    archetypeSections: ['ic-hero', 'ic-ticker', 'ic-results', 'ic-cta'],
  },
  {
    name: 'Application',
    description: 'Clean application/mentorship page with form — structured, credible.',
    theme: 'light-clean',
    archetypeSections: ['ic-hero', 'ic-cards', 'ic-results', 'ic-apply', 'ic-cta'],
  },
  {
    name: 'VSL / Landing',
    description: 'Premium long-form landing — education-heavy, objection-busting.',
    theme: 'light-clean',
    archetypeSections: ['ic-hero', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta'],
  },
  {
    name: 'Agency',
    description: 'Modern blue SaaS/agency page — sharp, fast, professional.',
    theme: 'light-blue',
    archetypeSections: ['ic-hero', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta'],
  },
]

// ═══════════════════════════════════════════
// BACKGROUND DEFINITIONS
// ═══════════════════════════════════════════
type BackgroundOption = {
  id: BackgroundId
  label: string
  previewStyle: React.CSSProperties
}

const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'none',
    label: 'None',
    previewStyle: { background: '#111' },
  },
  {
    id: 'gradient',
    label: 'Gradient',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 0%, rgba(57,255,20,0.2) 0%, #111 70%)' },
  },
  {
    id: 'particles',
    label: 'Particles',
    previewStyle: { background: '#0a0a0a' },
  },
  {
    id: 'grid',
    label: 'Grid',
    previewStyle: {
      background: '#111',
      backgroundImage: 'linear-gradient(rgba(57,255,20,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.15) 1px, transparent 1px)',
      backgroundSize: '16px 16px',
    },
  },
  {
    id: 'glow',
    label: 'Glow',
    previewStyle: { background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(57,255,20,0.18) 0%, #111 70%)' },
  },
  {
    id: 'aurora',
    label: 'Aurora',
    previewStyle: {
      background: 'radial-gradient(ellipse 40% 40% at 30% 20%, rgba(57,255,20,0.12) 0%, transparent 60%), radial-gradient(ellipse 30% 30% at 70% 60%, rgba(100,100,255,0.1) 0%, transparent 60%)',
      backgroundColor: '#0a0a0a',
    },
  },
  {
    id: 'dots',
    label: 'Dots',
    previewStyle: {
      background: '#111',
      backgroundImage: 'radial-gradient(circle, rgba(57,255,20,0.2) 1px, transparent 1px)',
      backgroundSize: '12px 12px',
    },
  },
  {
    id: 'noise',
    label: 'Noise',
    previewStyle: { background: '#0f0f0f' },
  },
  {
    id: 'waves',
    label: 'Waves',
    previewStyle: {
      background: 'linear-gradient(180deg, rgba(57,255,20,0.06) 0%, #111 40%, #111 60%, rgba(57,255,20,0.04) 100%)',
      backgroundColor: '#0a0a0a',
    },
  },
  {
    id: 'stars',
    label: 'Stars',
    previewStyle: {
      background: '#080808',
    },
  },
]

// ═══════════════════════════════════════════
// BASE WIZARD QUESTIONS (Stage 3)
// ═══════════════════════════════════════════
type WizardStep = {
  key: string
  question: string
  type: 'text' | 'choice'
  options?: string[]
}

const BASE_QUESTIONS: WizardStep[] = [
  { key: 'name', question: "What's the name of your funnel?", type: 'text' },
  {
    key: 'niche',
    question: 'What is your business niche?',
    type: 'choice',
    options: ['High-Ticket Reselling', 'Trading / Mentorship', 'Fitness Coaching', 'Agency / Service', 'E-commerce / Retail', 'Other'],
  },
  {
    key: 'audience',
    question: 'Who is your target customer?',
    type: 'choice',
    options: ['Beginners', 'Experienced', 'Agencies', 'Coaches / Consultants'],
  },
  {
    key: 'price',
    question: 'What is the price of your offer?',
    type: 'choice',
    options: ['Free / Lead Magnet', '$100–$500', '$1,000', '$5,000+'],
  },
  {
    key: 'tone',
    question: 'What tone of voice should we use?',
    type: 'choice',
    options: ['Professional Expert', 'Energetic & Direct', 'Warm & Encouraging', 'Minimalist'],
  },
  {
    key: 'goal',
    question: 'What is the primary action visitors should take?',
    type: 'choice',
    options: ['Apply via form', 'Book a call', 'Waitlist capture', 'Direct purchase'],
  },
  {
    key: 'socialProof',
    question: 'What social proof do you want to show?',
    type: 'choice',
    options: ['Winning screenshots', 'Revenue stats', 'Before / After', 'Text reviews'],
  },
]

type WizardMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function CreatePage() {
  const router = useRouter()

  // ── Mode machine ──
  const [mode, setMode] = useState<'style' | 'background' | 'wizard' | 'followup' | 'loading'>('style')

  // ── Stage 1 state ──
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null)

  // ── Stage 2 state ──
  const [selectedBackground, setSelectedBackground] = useState<BackgroundId>('none')

  // ── Stage 3 + 5 state ──
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [customInput, setCustomInput] = useState('')
  const [messages, setMessages] = useState<WizardMessage[]>([])

  // ── Stage 4 results ──
  const [plannedSections, setPlannedSections] = useState<BlockType[]>([])
  const [followupQuestions, setFollowupQuestions] = useState<{ key: string; question: string }[]>([])

  // ── Stage 6 state ──
  const [loadingText, setLoadingText] = useState('Initializing brand setup...')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Auto-scroll chat ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Loading text cycle ──
  useEffect(() => {
    if (mode !== 'loading') return
    const texts = [
      'Analyzing niche and audience profile...',
      'Structuring conversion-optimized blocks...',
      'Drafting professional business copywriting...',
      'Inlining high-class indicators and assets...',
      'Finalizing Supabase database tables...',
    ]
    let idx = 0
    const interval = setInterval(() => {
      if (idx < texts.length) {
        setLoadingText(texts[idx])
        idx++
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [mode])

  // ═══════════════════════════════════════════
  // STAGE 1 → STAGE 2
  // ═══════════════════════════════════════════
  function handlePickStyle(style: StyleOption) {
    setSelectedStyle(style)
    setMode('background')
  }

  // ═══════════════════════════════════════════
  // STAGE 2 → STAGE 3
  // ═══════════════════════════════════════════
  function handlePickBackground(bg: BackgroundId) {
    setSelectedBackground(bg)
    // Initialize wizard
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Great picks! ${selectedStyle?.name} style with ${BACKGROUNDS.find(b => b.id === bg)?.label.toLowerCase()} background. Let's nail down the business details. What's the name of your funnel?`,
      },
    ])
    setCurrentStep(0)
    setAnswers({})
    setCustomInput('')
    setMode('wizard')
  }

  // ═══════════════════════════════════════════
  // STAGE 3 — BASE QUESTIONS
  // ═══════════════════════════════════════════
  const activeStep = BASE_QUESTIONS[currentStep]

  async function handleSendBaseAnswer(answerText: string) {
    if (!answerText.trim() || !activeStep) return

    const nextAnswers = { ...answers, [activeStep.key]: answerText }
    setAnswers(nextAnswers)
    setCustomInput('')

    const userMsg: WizardMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: answerText,
    }

    if (currentStep < BASE_QUESTIONS.length - 1) {
      const nextStepIdx = currentStep + 1
      const nextStep = BASE_QUESTIONS[nextStepIdx]
      const assistantMsg: WizardMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: nextStep.question,
      }
      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setCurrentStep(nextStepIdx)
    } else {
      // All base questions answered → Stage 4 (AI component planning)
      const finalMsg: WizardMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Analyzing your answers and selecting the optimal funnel structure...',
      }
      const updatedMessages = [...messages, userMsg, finalMsg]
      setMessages(updatedMessages)

      await handlePlanFunnel(nextAnswers, updatedMessages)
    }
  }

  // ═══════════════════════════════════════════
  // STAGE 4 — AI COMPONENT PLANNING
  // ═══════════════════════════════════════════
  async function handlePlanFunnel(finalAnswers: Record<string, string>, chatHistory: WizardMessage[]) {
    try {
      const response = await fetch('/api/ai/plan-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleName: selectedStyle?.name,
          archetypeSections: selectedStyle?.archetypeSections,
          answers: finalAnswers,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to plan funnel structure.')
      }

      const sections = (data.sections || selectedStyle?.archetypeSections || []) as BlockType[]
      const questions = (data.followupQuestions || []) as { key: string; question: string }[]

      setPlannedSections(sections)
      setFollowupQuestions(questions)
      setCurrentStep(0)

      if (questions.length === 0) {
        // No follow-up questions — skip to generation
        const skipMsg: WizardMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'I have everything I need. Generating your funnel now...',
        }
        const finalMessages = [...chatHistory, skipMsg]
        setMessages(finalMessages)
        setTimeout(() => handleGenerate(finalAnswers, finalMessages), 800)
      } else {
        // Feed follow-up questions into chat
        const planMsg: WizardMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Funnel structure planned: ${sections.length} sections (${sections.join(', ')}). Now let me ask a few deeper questions about your offer to write specific, compelling copy.\n\n${questions[0].question}`,
        }
        setMessages((prev) => [...prev, planMsg])
        setMode('followup')
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Planning failed'
      alert(errMsg)
    }
  }

  // ═══════════════════════════════════════════
  // STAGE 5 — FOLLOW-UP QUESTIONS
  // ═══════════════════════════════════════════
  const activeFollowup = followupQuestions[currentStep]

  async function handleSendFollowupAnswer(answerText: string) {
    if (!answerText.trim() || !activeFollowup) return

    const nextAnswers = { ...answers, [activeFollowup.key]: answerText }
    setAnswers(nextAnswers)
    setCustomInput('')

    const userMsg: WizardMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: answerText,
    }

    if (currentStep < followupQuestions.length - 1) {
      const nextStepIdx = currentStep + 1
      const nextQ = followupQuestions[nextStepIdx]
      const assistantMsg: WizardMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: nextQ.question,
      }
      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setCurrentStep(nextStepIdx)
    } else {
      // All follow-ups answered → Stage 6 (generate)
      const finalMsg: WizardMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Perfect. I have everything needed to build your high-converting funnel. Generating now...',
      }
      const updatedMessages = [...messages, userMsg, finalMsg]
      setMessages(updatedMessages)

      setTimeout(() => handleGenerate(nextAnswers, updatedMessages), 800)
    }
  }

  // ═══════════════════════════════════════════
  // STAGE 6 — GENERATE & SAVE
  // ═══════════════════════════════════════════
  async function handleGenerate(finalAnswers: Record<string, string>, chatHistory: WizardMessage[]) {
    setMode('loading')
    try {
      const formattedHistory = chatHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/ai/create-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: finalAnswers,
          chatHistory: formattedHistory,
          plannedSections,
          theme: selectedStyle?.theme,
          background: selectedBackground,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Generation failed. Make sure you set a DeepSeek API key.')
      }

      if (data.success && data.funnelId) {
        router.push(`/dashboard/funnels/${data.funnelId}/edit?tab=ai`)
      } else {
        throw new Error('API returned success but no funnel ID.')
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
      alert(errMsg)
      setMode('style')
    }
  }

  // ═══════════════════════════════════════════
  // SHARED PROGRESS BAR
  // ═══════════════════════════════════════════
  function ProgressDots({ stage }: { stage: number }) {
    const labels = ['Style', 'Background', 'Basics', 'Plan', 'Details', 'Generate']
    return (
      <div className="mb-5 flex items-center justify-center gap-1.5">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full transition-colors ${
                i + 1 <= stage ? 'bg-[#39FF14]' : 'bg-gray-600'
              }`}
            />
            {i < labels.length - 1 && (
              <div
                className={`h-px w-3 transition-colors ${
                  i + 1 < stage ? 'bg-[#39FF14]/40' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 py-10">
      {/* Ambient glow behind card */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#39FF14]/[0.03] blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[300px] w-[400px] rounded-full bg-[#39FF14]/[0.02] blur-3xl" />
      </div>

      <Link
        href="/dashboard"
        className="absolute top-6 left-6 z-[2] flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
      >
        ← Dashboard
      </Link>

      <div className="relative z-[1] w-full max-w-lg rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-7 shadow-2xl shadow-black/50">
        {/* ── STYLE PICKER (Stage 1) ── */}
        {mode === 'style' && (
          <div>
            <ProgressDots stage={1} />
            <h3 className="text-xl font-bold tracking-tight text-white">Choose a style</h3>
            <p className="mt-1 text-sm text-gray-400">
              Pick the funnel archetype that fits your offer best.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.name}
                  onClick={() => handlePickStyle(style)}
                  className="group rounded-xl border border-white/[0.06] bg-[#111] p-4 text-left transition hover:border-[#39FF14]/40 hover:bg-[#39FF14]/[0.03]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] text-xs text-gray-500 group-hover:text-[#39FF14]">
                      [ preview ]
                    </div>
                    <div>
                      <strong className="block text-sm text-white">{style.name}</strong>
                      <span className="mt-0.5 block text-xs text-gray-500">{style.description}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="mt-5 block rounded-xl border border-white/[0.06] py-2.5 text-center text-sm text-gray-500 transition hover:text-white"
            >
              Cancel
            </Link>
          </div>
        )}

        {/* ── BACKGROUND PICKER (Stage 2) ── */}
        {mode === 'background' && selectedStyle && (
          <div>
            <ProgressDots stage={2} />
            <button
              onClick={() => setMode('style')}
              className="mb-3 text-xs text-gray-500 transition hover:text-white"
            >
              ← Back to style
            </button>

            <h3 className="text-xl font-bold tracking-tight text-white">Choose a background</h3>
            <p className="mt-1 text-sm text-gray-400">
              {selectedStyle.name} style selected. Pick the visual backdrop.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => handlePickBackground(bg.id)}
                  className={`group rounded-xl border p-3 text-center transition ${
                    selectedBackground === bg.id
                      ? 'border-[#39FF14]/60 bg-[#39FF14]/[0.05]'
                      : 'border-white/[0.06] bg-[#111] hover:border-[#39FF14]/30'
                  }`}
                >
                  <div
                    className="mx-auto mb-2 h-14 w-full rounded-lg border border-white/[0.06]"
                    style={bg.previewStyle}
                  />
                  <span className="text-xs font-medium text-gray-300 group-hover:text-white">
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── WIZARD MODE — Base Questions (Stage 3) ── */}
        {mode === 'wizard' && (
          <div className="flex flex-col" style={{ height: '400px' }}>
            <ProgressDots stage={3} />
            {/* Header */}
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Business Basics</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              </div>
              <span className="text-[11px] text-gray-500">
                Question {currentStep + 1} of {BASE_QUESTIONS.length}
              </span>
            </div>

            {/* Messages feed */}
            <div className="mb-3 flex-1 space-y-3 overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'ml-auto bg-[#1a1a1a] text-gray-300'
                      : 'mr-auto border border-[#39FF14]/15 bg-[#39FF14]/[0.04] text-gray-300'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick-reply chips */}
            {activeStep && activeStep.type === 'choice' && activeStep.options && (
              <div className="mb-3 flex flex-wrap gap-2">
                {activeStep.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSendBaseAnswer(opt)}
                    className="rounded-full border border-white/[0.08] bg-[#111] px-3 py-1.5 text-xs text-gray-400 transition hover:border-[#39FF14]/40 hover:text-[#39FF14]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (customInput.trim()) handleSendBaseAnswer(customInput)
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={
                  activeStep?.type === 'text'
                    ? activeStep.key === 'name'
                      ? 'e.g. Elite Resellers'
                      : 'Type your answer...'
                    : 'Or type a custom answer...'
                }
                className="flex-1 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#39FF14]/40 focus:outline-none transition"
                autoFocus
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#39FF14] text-sm font-bold text-black transition hover:bg-[#39FF14]/80 disabled:bg-[#1a1a1a] disabled:text-gray-600"
              >
                →
              </button>
            </form>
          </div>
        )}

        {/* ── FOLLOW-UP MODE (Stage 5) ── */}
        {mode === 'followup' && followupQuestions.length > 0 && (
          <div className="flex flex-col" style={{ height: '400px' }}>
            <ProgressDots stage={5} />
            {/* Header */}
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Offer Details</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              </div>
              <span className="text-[11px] text-gray-500">
                Question {currentStep + 1} of {followupQuestions.length}
              </span>
            </div>

            {/* Messages feed */}
            <div className="mb-3 flex-1 space-y-3 overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'ml-auto bg-[#1a1a1a] text-gray-300'
                      : 'mr-auto border border-[#39FF14]/15 bg-[#39FF14]/[0.04] text-gray-300'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form — all text for follow-up */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (customInput.trim()) handleSendFollowupAnswer(customInput)
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#39FF14]/40 focus:outline-none transition"
                autoFocus
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#39FF14] text-sm font-bold text-black transition hover:bg-[#39FF14]/80 disabled:bg-[#1a1a1a] disabled:text-gray-600"
              >
                →
              </button>
            </form>
          </div>
        )}

        {/* ── LOADING / GENERATING (Stage 6) ── */}
        {mode === 'loading' && (
          <div className="py-6 text-center">
            <ProgressDots stage={6} />
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-[3px] border-white/[0.06] border-t-[#39FF14]" />
            <h4 className="text-base font-bold text-white">Generating Your Funnel</h4>
            <p className="mt-2 text-sm font-medium text-[#39FF14] animate-pulse">
              {loadingText}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
