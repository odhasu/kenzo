'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Block } from '@/types/blocks'
import { DEFAULT_SETTINGS } from '@/types/blocks'

// Default template for the "Start from Base" option
function makeTemplate(): Block[] {
  return [
    {
      id: crypto.randomUUID(),
      type: 'ic-hero',
      props: {
        badge: 'MAKE 2026 YOUR BIGGEST YEAR YET',
        headline: 'See How Regular People Are Building $5K-$30K/Month High-Ticket Reselling Businesses',
        subtext: 'The Exact System 200+ Members Use to Flip Authentic Products for Profit',
        ctaLabel: 'Apply For The Inner Circle ↗',
        ctaHref: '#apply',
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-ticker',
      props: {
        items: ['10+ Hours of Reselling Training', '200+ Inner Circle Members', 'High Ticket Vendor Access', 'OEM StockX Passing Vendors', '1-on-1 Onboarding Call', 'Weekly Group Meetings', 'Custom $10K/Month Action Plan', 'View Bots for Enhanced Sales', 'And Much More'],
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-apply',
      props: { headline: 'Apply Now', subtext: 'Complete the application below to see if you qualify.' },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-cards',
      props: {
        headline: 'My Exact 3-Step System to $10K/Month',
        cards: [
          { title: 'Source The Deals', desc: 'Access my private vendors for untapped products at wholesale prices.', bullets: ['OEM vendors that pass StockX authentication.', 'High-ticket items with guaranteed margins.', 'Skip the middlemen & source direct.'] },
          { title: 'Sell With Confidence', desc: '100% authentic OEM products — no replicas, no legal trouble, no bans.', bullets: ['Pass authentication on StockX & GOAT every time.', 'Zero customer complaints — happy buyers, easy sales.', 'Never worry about account bans or legal issues.'] },
          { title: 'Scale To $10K+/Month', desc: 'Get a custom action plan built for your situation to hit $10K/month.', bullets: ['1-on-1 onboarding call to map your path.', 'Weekly group calls — get your questions answered live.', 'Discord community with 200+ active members.'] },
        ],
        ctaLabel: 'Apply For The Inner Circle ↗',
        ctaHref: '#apply',
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-faq',
      props: {
        headline: 'Frequently Asked Questions',
        items: [
          { q: 'Are these vendors legit?', a: 'Yes. These are the same OEM vendors our Inner Circle members use to pass StockX and GOAT authentication every single time. 100% authentic products.' },
          { q: 'How fast can I start making money?', a: 'Yes. You can place your first order and list products the same day you get access. Many members make their first sale within the first week.' },
          { q: 'Do I need experience to start?', a: 'No experience needed. Our vendors and resources are beginner-friendly. Everything is explained step-by-step inside the community.' },
        ],
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-cta',
      props: { label: 'Join The Inner Circle ↗', href: '#apply', subtext: 'Start your journey to $10K/month' },
    },
  ]
}

type WizardStep = {
  key: string
  question: string
  type: 'text' | 'choice'
  options?: string[]
}

const WIZARD_STEPS: WizardStep[] = [
  { key: 'name', question: 'What is the name of your funnel?', type: 'text' },
  { key: 'niche', question: 'What is your business niche?', type: 'choice', options: ['High-Ticket Reselling', 'Trading / Mentorship', 'Fitness Coaching', 'Agency / Service', 'E-commerce / Retail'] },
  { key: 'audience', question: 'Who is your target customer?', type: 'choice', options: ['Beginners / Starters', 'Experienced Resellers', 'High-Ticket Agencies', 'Coaches / Consultants'] },
  { key: 'price', question: 'What is the price of your offer?', type: 'choice', options: ['Free / Lead Magnet', '$100 - $500', '$1,000', '$5,000+'] },
  { key: 'tone', question: 'What tone of voice should we use?', type: 'choice', options: ['Highly Professional Business Expert', 'Energetic & Direct', 'Warm & Encouraging', 'Minimalist & Clear'] },
  { key: 'goal', question: 'What is the primary action visitors should take?', type: 'choice', options: ['Apply via form', 'Book a call', 'Waitlist Email capture', 'Direct Purchase'] },
  { key: 'socialProof', question: 'What social proof do you want to show?', type: 'choice', options: ['Student winning screenshots', 'Revenue stats', 'Before / After results', 'Text reviews'] },
  { key: 'aesthetics', question: 'What design style do you want?', type: 'choice', options: ['Premium Dark (Neon green)', 'Clean Light (Royal blue)', 'Luxury Gold', 'Monochrome Gray'] },
  { key: 'benefits', question: 'List up to 3 core benefits of your offer (comma separated):', type: 'text' },
  { key: 'requisites', question: 'Is there any experience required?', type: 'choice', options: ['Zero experience required', 'Basic knowledge needed', 'Application only / Select members'] },
]

type WizardMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function CreatePage() {
  const [mode, setMode] = useState<'choice' | 'wizard' | 'loading'>('choice')
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [customInput, setCustomInput] = useState('')
  const [loadingText, setLoadingText] = useState('Initializing brand setup...')
  const router = useRouter()

  const [messages, setMessages] = useState<WizardMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode === 'loading') {
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
    }
  }, [mode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Create Funnel using Base Template
  async function handleCreateBase() {
    const name = prompt('Funnel name:')
    if (!name) return

    setMode('loading')
    setLoadingText('Assembling Base Inner Circle Funnel...')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'funnel'
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`
      const { data: funnel, error } = await supabase
        .from('funnels')
        .insert({ name, slug, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      await supabase.from('pages').insert({
        funnel_id: funnel.id,
        slug: 'main',
        title: 'Main Page',
        content: makeTemplate(),
        settings: { ...DEFAULT_SETTINGS },
        order: 0,
      })

      router.push(`/dashboard/funnels/${funnel.id}/edit`)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
      alert(errMsg)
      setMode('choice')
    }
  }

  // Wizard Navigation
  const activeStep = WIZARD_STEPS[currentStep]

  async function handleSendAnswer(answerText: string) {
    if (!answerText.trim()) return

    const nextAnswers = { ...answers, [activeStep.key]: answerText }
    setAnswers(nextAnswers)
    setCustomInput('')

    // Append user's answer to messages
    const userMsg: WizardMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: answerText,
    }

    if (currentStep < WIZARD_STEPS.length - 1) {
      const nextStepIdx = currentStep + 1
      const nextStep = WIZARD_STEPS[nextStepIdx]
      const assistantMsg: WizardMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: nextStep.question,
      }
      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setCurrentStep(nextStepIdx)
    } else {
      // Last step answered
      const finalMsg: WizardMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '✨ Excellent! I have all your business details. Preparing design plans and initiating DeepSeek page builder...',
      }
      const updatedMessages = [...messages, userMsg, finalMsg]
      setMessages(updatedMessages)

      // Wait a moment for visual feedback, then call generation
      setTimeout(() => {
        handleCreateScratch(nextAnswers, updatedMessages)
      }, 1000)
    }
  }

  // Create Custom AI Funnel
  async function handleCreateScratch(finalAnswers: Record<string, string>, chatHistoryList: WizardMessage[]) {
    setMode('loading')
    try {
      const formattedHistory = chatHistoryList.map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await fetch('/api/ai/create-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: finalAnswers,
          chatHistory: formattedHistory
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
      setMode('choice')
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 py-10">
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[300px] w-[400px] rounded-full bg-gradient-to-bl from-indigo-100 to-blue-50 opacity-30 blur-3xl" />
      </div>

      <Link
        href="/dashboard"
        className="absolute top-6 left-6 z-[2] flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-black"
      >
        ← Dashboard
      </Link>

      <div className="relative z-[1] w-full max-w-lg rounded-2xl border border-gray-200 bg-white/70 p-7 shadow-2xl shadow-gray-100 backdrop-blur-sm">

        {/* CHOICE MODE */}
        {mode === 'choice' && (
          <div>
            <h3 className="text-xl font-bold tracking-tight text-black">Create New Funnel</h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose how you want to build this funnel.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleCreateBase}
                className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
              >
                <strong className="block text-sm text-black">Start from Base Blueprint</strong>
                <span className="mt-1 block text-xs text-gray-400">
                  Get started instantly using our pre-designed, high-converting template.
                </span>
              </button>

              <button
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'assistant',
                      content: "👋 Welcome to the AI Funnel Architect! Let's build your customized conversion page together. To get started, what is the name of your funnel?",
                    }
                  ])
                  setCurrentStep(0)
                  setAnswers({})
                  setCustomInput('')
                  setMode('wizard')
                }}
                className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <strong className="block text-sm text-blue-700">Start from Scratch (AI Guided) ✦</strong>
                <span className="mt-1 block text-xs text-gray-500">
                  Answer 10 quick business questions and let AI generate a custom copy and layout tailored for you.
                </span>
              </button>
            </div>

            <Link
              href="/dashboard"
              className="mt-5 block rounded-xl border border-gray-200 py-2.5 text-center text-sm text-gray-400 transition hover:text-black"
            >
              Cancel
            </Link>
          </div>
        )}

        {/* WIZARD MODE (CHAT INTERFACE) */}
        {mode === 'wizard' && (
          <div className="flex flex-col" style={{ height: '350px' }}>
            {/* Header */}
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-black">AI Funnel Architect</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <span className="text-[11px] text-gray-400">
                Question {currentStep + 1} of {WIZARD_STEPS.length}
              </span>
            </div>

            {/* Messages feed */}
            <div className="mb-3 flex-1 space-y-3 overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'ml-auto bg-gray-100 text-gray-800'
                      : 'mr-auto border border-blue-100 bg-blue-50/60 text-gray-700'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick-reply Suggestion Chips */}
            {activeStep && activeStep.type === 'choice' && activeStep.options && (
              <div className="mb-3 flex flex-wrap gap-2">
                {activeStep.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSendAnswer(opt)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm transition hover:border-black hover:text-black"
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
                if (customInput.trim()) {
                  handleSendAnswer(customInput)
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={activeStep?.key === 'name' ? 'e.g. Elite Resellers' : 'Type your answer...'}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black placeholder-gray-400 shadow-sm focus:border-black focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400"
              >
                →
              </button>
            </form>
          </div>
        )}

        {/* LOADING/GENERATING MODE */}
        {mode === 'loading' && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-black" />
            <h4 className="text-base font-bold text-black">Generating Your Funnel</h4>
            <p className="mt-2 text-sm font-medium text-blue-600 animate-pulse">
              {loadingText}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
