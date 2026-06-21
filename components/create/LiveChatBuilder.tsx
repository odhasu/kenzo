'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { resolveTokens } from '@/lib/themes'
import { makeBaseFunnel, DEFAULT_PROPS } from '@/lib/templates'
import { FunnelBackground } from '@/components/funnel/FunnelBackground'
import type { Block, BlockType, FunnelSettings } from '@/types/blocks'

// ─── Question flow ────────────────────────────────────────────────────────────

interface QuestionRound {
  key: string
  title: string
  questions: string[]
  examples: string[]
}

const QUESTION_ROUNDS: QuestionRound[] = [
  {
    key: 'niche',
    title: 'What do you sell?',
    questions: [
      'What kind of business do you run? Coaching, consulting, course, done-for-you service, agency, or something else?',
      'What\'s your specific niche or industry? Be as specific as you can.',
      'What\'s the main transformation or outcome your clients get?',
    ],
    examples: [
      '"I help people start high-ticket reselling businesses"',
      '"I run a fitness coaching program for busy executives"',
      '"I do done-for-you marketing for law firms"',
    ],
  },
  {
    key: 'client',
    title: 'Who is your dream client?',
    questions: [
      'Describe your dream client. What situation are they in and how much pain are they in?',
      'What have they tried before that didn\'t work?',
      'What\'s the one thing they want most right now?',
    ],
    examples: [
      '"People stuck in 9-5 jobs who want financial freedom"',
      '"They\'ve tried dropshipping and failed — lost money"',
    ],
  },
  {
    key: 'offer',
    title: 'What\'s the offer?',
    questions: [
      'What\'s your main offer called? Give it a name.',
      'What\'s included? List deliverables — sessions, materials, access, community, bonuses.',
      'What\'s your guarantee or risk reversal?',
    ],
    examples: [
      '"The Inner Circle — weekly coaching + vendor access + Discord"',
      '"Six-Figure Agency — done-for-you client acquisition system"',
    ],
  },
  {
    key: 'pricing',
    title: 'Pricing & proof',
    questions: [
      'What\'s the price of your main offer?',
      'What\'s the typical ROI your clients get? Be concrete.',
      'What proof do you have that it works? Testimonials, case studies, revenue numbers?',
    ],
    examples: [
      '"$997 one-time" or "$500/month"',
      '"Members hit $10K/month within 90 days"',
      '"200+ members, 50+ testimonials, screenshots of results"',
    ],
  },
  {
    key: 'tone',
    title: 'Tone & final details',
    questions: [
      'How should the page sound? Professional, bold, casual, empathetic?',
      'What\'s the main action you want visitors to take? Apply? Buy? Book a call?',
      'Any specific colors or style preferences? Any competitors or inspiration pages?',
    ],
    examples: [
      '"Bold and direct — like Alex Hormozi"',
      '"Clean and professional — like a SaaS company"',
      '"Dark mode with neon green accents"',
    ],
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'assistant' | 'user' | 'system'
  content: string
  isQuestion?: boolean
  error?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LiveChatBuilder() {
  const router = useRouter()
  const supabase = createClient()

  // Auth
  const [authChecked, setAuthChecked] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [roundQuestionIdx, setRoundQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  // Preview state — always start valid
  const [blocks, setBlocks] = useState<Block[]>(() => makeBaseFunnel().blocks)
  const [settings, setSettings] = useState<FunnelSettings>(() => makeBaseFunnel().settings)

  // UI state
  const [funnelCreated, setFunnelCreated] = useState(false)
  const [funnelId, setFunnelId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiOk, setApiOk] = useState(true)
  const [buildCount, setBuildCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Auth check ──────────────────────────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
      setAuthChecked(true)
    })
  }, [])

  // ── Start conversation ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!authChecked || !userId) return
    startRound(0)
  }, [authChecked, userId])

  // ── Scroll to bottom ────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Focus input ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loading && !funnelCreated) {
      inputRef.current?.focus()
    }
  }, [loading, funnelCreated, messages])

  // ── Helper: ask a round of questions ───────────────────────────────────────

  const startRound = useCallback((roundIdx: number) => {
    if (roundIdx >= QUESTION_ROUNDS.length) {
      // All rounds done — finalize
      handleFinalize()
      return
    }

    const round = QUESTION_ROUNDS[roundIdx]
    setCurrentRound(roundIdx)
    setRoundQuestionIdx(0)

    const parts: string[] = [`**${round.title}**`]
    round.questions.forEach((q) => parts.push(q))
    if (round.examples.length > 0) {
      parts.push(`\n*Examples: ${round.examples.join(' | ')}*`)
    }

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content: parts.join('\n\n'), isQuestion: true },
    ])
  }, [answers, blocks, settings])

  // ── Handle user input ───────────────────────────────────────────────────────

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || loading || funnelCreated) return

    const trimmed = text.trim()
    setInput('')
    setError(null)

    // Add user message
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])

    // Collect answers
    const round = QUESTION_ROUNDS[currentRound]
    const questionKey = `${round.key}_${roundQuestionIdx}`
    const updatedAnswers = { ...answers, [questionKey]: trimmed }
    // Also add a plain key for the AI context
    updatedAnswers[round.key] = updatedAnswers[round.key]
      ? `${updatedAnswers[round.key]}; ${trimmed}`
      : trimmed
    setAnswers(updatedAnswers)

    // Advance within round
    const nextQIdx = roundQuestionIdx + 1
    if (nextQIdx < round.questions.length) {
      // More questions in this round — ask next
      setRoundQuestionIdx(nextQIdx)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: round.questions[nextQIdx], isQuestion: true },
      ])
      return
    }

    // Round complete — trigger AI build + advance to next round
    setLoading(true)
    setBuildCount((c) => c + 1)

    try {
      const res = await fetch('/api/ai/build-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          settings,
          answers: updatedAnswers,
          message: `Round ${currentRound + 1}/${QUESTION_ROUNDS.length} complete. ${trimmed}`,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'NO_API_KEY') {
          setApiOk(false)
          throw new Error('AI API key not configured.')
        }
        throw new Error(data.message || 'Failed to build funnel.')
      }

      // Update preview
      if (data.blocks) setBlocks(data.blocks)
      if (data.settings) setSettings(data.settings)

      // Assistant feedback
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.explanation || `Updated the funnel based on your answers. Let me ask a few more questions…`,
        },
      ])

      // Advance to next round
      const nextRound = currentRound + 1
      setTimeout(() => startRound(nextRound), 500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setError(msg)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: `Error: ${msg}`, error: true } as Message,
      ])
      // Still advance
      const nextRound = currentRound + 1
      setTimeout(() => startRound(nextRound), 800)
    } finally {
      setLoading(false)
    }
  }, [loading, funnelCreated, currentRound, roundQuestionIdx, answers, blocks, settings])

  // ── Finalize + persist funnel ───────────────────────────────────────────────

  const handleFinalize = useCallback(async () => {
    setLoading(true)
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'system', content: 'Building your final funnel…' },
    ])

    try {
      // Final AI call to polish
      const res = await fetch('/api/ai/build-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          settings,
          answers,
          message: 'All questions answered. Polish the funnel — make the copy perfect, ensure every section is complete, fix any placeholder text. This is the final version.',
        }),
      })

      const data = await res.json()

      if (data.blocks) setBlocks(data.blocks)
      if (data.settings) setSettings(data.settings)

      // Persist to DB
      const funnelName = answers.offer_name || answers.niche || 'New Funnel'
      const baseSlug = String(funnelName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'funnel'
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`

      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .insert({ name: funnelName, slug, user_id: userId })
        .select()
        .single()

      if (funnelError) throw new Error(`Failed to create funnel: ${funnelError.message}`)

      const { error: pageError } = await supabase
        .from('pages')
        .insert({
          funnel_id: funnel.id,
          slug: 'main',
          title: 'Main Page',
          content: data.blocks || blocks,
          settings: data.settings || settings,
          order: 0,
        })

      if (pageError) throw new Error(`Failed to create page: ${pageError.message}`)

      // Save business profile
      try {
        await supabase.from('business_profiles').upsert({
          user_id: userId,
          niche: answers.niche || '',
          offer_type: answers.offer_type || answers.niche || '',
          transform: answers.transform || '',
          offer_name: answers.offer_name || '',
          price: answers.price || '',
          social_proof: answers.social_proof || '',
          pain_points: answers.pain_points || '',
          brand_voice: answers.tone || '',
        })
      } catch {
        // Non-critical — business profile save can fail silently
      }

      setFunnelId(funnel.id)
      setFunnelCreated(true)

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Your funnel is ready! 🎉\n\n**${funnelName}** has been created with ${(data.blocks || blocks).length} sections. You can now open it in the editor to fine-tune everything — copy, colors, layout, and more.`,
        },
      ])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [blocks, settings, answers, userId, supabase])

  // ── One more question (skip-to-finalize) ────────────────────────────────────

  const handleSkipToDone = useCallback(() => {
    handleFinalize()
  }, [handleFinalize])

  // ── Render: loading / auth check ────────────────────────────────────────────

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#39FF14] border-t-transparent" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="text-center max-w-sm">
          <p className="text-lg font-bold text-white mb-2">Sign in required</p>
          <p className="text-sm text-white/45 mb-4">Create an account to build your funnel.</p>
          <a
            href="/login"
            className="inline-block rounded-full bg-[#39FF14] px-6 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Sign in
          </a>
        </div>
      </div>
    )
  }

  // ── Theme tokens for preview ────────────────────────────────────────────────

  const tokens = resolveTokens(settings)
  const isDark = !settings.theme.startsWith('light')

  // ── Render: split layout ────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {/* LEFT — Chat Panel */}
      <div className="w-[440px] min-w-[360px] flex flex-col border-r border-white/[0.06] bg-[#0a0a0a]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div>
            <h1 className="text-sm font-bold text-white">Build your funnel</h1>
            <p className="text-[11px] text-white/35 mt-0.5">
              {buildCount === 0 ? 'Answer a few questions…' : `${buildCount} update${buildCount !== 1 ? 's' : ''} so far`}
            </p>
          </div>
          {!apiOk && (
            <span className="text-[10px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded">No API key</span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] rounded-xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#39FF14]/[0.08] border border-[#39FF14]/[0.15] text-white/90'
                    : msg.error
                    ? 'bg-red-500/[0.08] border border-red-500/[0.2] text-red-400'
                    : msg.role === 'system'
                    ? 'bg-white/[0.03] border border-white/[0.06] text-white/50 text-center text-[12px]'
                    : 'bg-white/[0.03] border border-white/[0.06] text-white/85'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                <span className="text-[12px] text-white/40">Building your funnel…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-5 mb-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-2.5 text-[12px] text-red-400">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06] shrink-0">
          {funnelCreated && funnelId ? (
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/dashboard/funnels/${funnelId}/edit?tab=ai`)}
                className="w-full rounded-xl bg-[#39FF14] py-3 text-sm font-bold text-black transition hover:opacity-90"
              >
                Open in Editor ✦
              </button>
              <button
                onClick={() => router.push(`/dashboard/funnels/${funnelId}`)}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] py-2.5 text-[13px] text-white/60 transition hover:bg-white/[0.08]"
              >
                View funnel detail →
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(input)
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={loading ? 'Building…' : 'Type your answer…'}
                disabled={loading}
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#39FF14]/30 transition font-[inherit]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 w-11 h-11 rounded-xl bg-[#39FF14] text-black font-bold text-lg flex items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-90"
              >
                ↑
              </button>
            </form>
          )}
          {messages.length > 4 && !funnelCreated && (
            <button
              onClick={handleSkipToDone}
              disabled={loading}
              className="w-full mt-2 text-[11px] text-white/25 hover:text-white/50 transition py-1"
            >
              Skip to finish → build with what I\'ve said so far
            </button>
          )}
        </div>
      </div>

      {/* RIGHT — Live Preview */}
      <div className="flex-1 overflow-hidden relative">
        {/* Theme injection */}
        <div
          style={tokens as unknown as React.CSSProperties}
          className="h-full overflow-y-auto"
        >
          <FunnelBackground background={settings.background} />

          {/* Phone frame wrapper */}
          <div className="relative z-10 mx-auto my-8 max-w-[430px]">
            {/* Phone chrome */}
            <div className="rounded-[32px] border-[3px] border-white/[0.08] overflow-hidden shadow-2xl shadow-black/40">
              {/* Notch bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-[var(--bg)] border-b border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] font-medium">
                  {settings.pageTitle || 'Your Funnel Preview'}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
                  <div className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
                  <div className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
                </div>
              </div>

              {/* Funnel content */}
              <div className="bg-[var(--bg)] min-h-[600px]">
                {blocks.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-[var(--text-muted)] text-sm">
                    Answer a question to start building…
                  </div>
                ) : (
                  blocks.map((block) => (
                    <BlockRenderer key={block.id} block={block} editable={false} settings={settings} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Build count badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-full px-3 py-1.5 text-[11px] text-white/50">
          {blocks.length} sections · {buildCount} update{buildCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}

