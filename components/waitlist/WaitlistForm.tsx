'use client'

import { useState, useCallback } from 'react'

interface Step {
  question: string
  options: { key: string; label: string }[]
}

const STEPS: Step[] = [
  {
    question: 'How long have you been reselling?',
    options: [
      { key: 'A', label: "I'm just starting" },
      { key: 'B', label: 'Less than 6 months' },
      { key: 'C', label: '6 months – 1 year' },
      { key: 'D', label: '1 – 2 years' },
      { key: 'E', label: '2+ years' },
    ],
  },
  {
    question: 'What is your current monthly revenue from reselling?',
    options: [
      { key: 'A', label: '$0 – $500' },
      { key: 'B', label: '$500 – $2,000' },
      { key: 'C', label: '$2,000 – $5,000' },
      { key: 'D', label: '$5,000 – $10,000' },
      { key: 'E', label: '$10,000+' },
    ],
  },
  {
    question: 'What do you want most from The Inner Circle?',
    options: [
      { key: 'A', label: 'Access to private OEM vendors' },
      { key: 'B', label: '1-on-1 coaching & mentorship' },
      { key: 'C', label: 'Proven sales scripts & templates' },
      { key: 'D', label: 'Community & networking' },
      { key: 'E', label: 'All of the above' },
    ],
  },
  {
    question: 'Enter your best email to join the waitlist',
    options: [], // email input step
    isEmail: true,
  } as Step & { isEmail?: boolean },
]

export function WaitlistForm() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1
  const selected = answers[step] ?? ''

  const handleSelect = useCallback((key: string) => {
    setAnswers((prev) => ({ ...prev, [step]: key }))
    setError('')
  }, [step])

  const handleNext = useCallback(() => {
    if (isLast) {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.')
        return
      }
      handleSubmit()
      return
    }
    if (!selected) {
      setError('Please select an option before continuing.')
      return
    }
    setError('')
    setStep((s) => s + 1)
  }, [isLast, selected, email])

  const handleBack = useCallback(() => {
    setError('')
    setStep((s) => Math.max(0, s - 1))
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      // Store to Supabase or API
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section id="waitlist-form" className="relative z-10 flex flex-col items-center px-6 py-16">
        <div
          className="w-full max-w-lg rounded-2xl p-10 text-center"
          style={{ background: '#111111', border: '1px solid rgba(57,255,20,0.15)' }}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
            style={{ background: 'rgba(57,255,20,0.1)', color: '#39ff14' }}>
            ✓
          </div>
          <h3 className="text-xl font-bold text-white">You&apos;re on the list</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
            We&apos;ll notify you at <span className="text-white font-medium">{email}</span> when doors open.
            Keep an eye on your inbox.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist-form" className="relative z-10 flex flex-col items-center px-6 py-16">
      {/* Section heading */}
      <h2 className="mb-2 text-3xl font-bold text-white text-center">Join the Waitlist</h2>
      <p className="mb-10 text-sm text-center" style={{ color: '#6b7280' }}>
        Step {step + 1} of {STEPS.length}
      </p>

      {/* Progress dots */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i <= step ? '24px' : '8px',
              background: i <= step ? '#39ff14' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="w-full max-w-lg rounded-2xl p-6 sm:p-8"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Step number badge */}
        <div
          className="mb-5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
          style={{ background: '#39ff14', color: '#0a0a0a' }}
        >
          {step + 1}
        </div>

        {/* Question */}
        <h3 className="mb-5 text-lg font-semibold text-white">{currentStep.question}</h3>

        {/* Options or email input */}
        {(currentStep as any).isEmail ? (
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2"
              style={{
                background: '#1a1a1a',
                border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                '--tw-ring-color': '#39ff14',
              } as React.CSSProperties}
              autoFocus
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {currentStep.options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className="w-full rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-200"
                style={{
                  background: selected === opt.key ? 'rgba(57,255,20,0.08)' : '#1a1a1a',
                  border: selected === opt.key
                    ? '1px solid #39ff14'
                    : '1px solid rgba(255,255,255,0.06)',
                  color: selected === opt.key ? '#ffffff' : '#9ca3af',
                }}
              >
                <span className="mr-2 font-bold" style={{ color: selected === opt.key ? '#39ff14' : '#6b7280' }}>
                  {opt.key}.
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-3 text-xs" style={{ color: '#ef4444' }}>{error}</p>
        )}

        {/* Nav buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="text-sm font-medium transition-opacity"
            style={{ color: step === 0 ? '#333333' : '#6b7280' }}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={submitting}
            className="rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: '#39ff14',
              color: '#0a0a0a',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Joining...' : isLast ? 'Join Waitlist' : 'OK'}
          </button>
        </div>
      </div>
    </section>
  )
}
