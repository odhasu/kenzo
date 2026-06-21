'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { StepNiche } from './StepNiche'
import { StepClient } from './StepClient'
import { StepOffer } from './StepOffer'
import { StepPricing } from './StepPricing'
import { StepPainPoints } from './StepPainPoints'
import { FollowUpRound } from './FollowUpRound'
import { Block, FunnelSettings } from '@/types/blocks'
import { makeBaseFunnel } from '@/lib/templates'

type Phase = 'interview' | 'followup' | 'generating' | 'done'
type StepKey = 'niche' | 'ideal-client' | 'offer' | 'pricing' | 'pain-points'

const STEP_KEYS: StepKey[] = ['niche', 'ideal-client', 'offer', 'pricing', 'pain-points']

interface FollowUpQuestion {
  key: string
  question: string
}

export function OnboardingWizard() {
  const router = useRouter()
  const supabase = createClient()

  // Auth check
  const [authChecked, setAuthChecked] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Step state
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('interview')

  // Answers for all 5 steps
  const [answers, setAnswers] = useState<Record<string, string>>({})

  // Follow-up questions from AI
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([])

  // Funnel generation state
  const [generating, setGenerating] = useState(false)
  const [generatedFunnelId, setGeneratedFunnelId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Preview blocks (for live preview during interview — use base funnel as placeholder)
  const [previewBlocks] = useState<Block[]>(() => makeBaseFunnel().blocks)
  const [previewSettings] = useState<FunnelSettings>(() => makeBaseFunnel().settings)

  // Auth check on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
      setAuthChecked(true)
    })
  }, [])

  // Progress step value
  const stepKey = STEP_KEYS[currentStepIdx]

  // Update answer
  const setAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  // Move to next step
  const goNext = () => {
    if (currentStepIdx < STEP_KEYS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1)
    } else {
      // All 5 steps done — now plan funnel and get follow-up questions
      startFunnelPlanning()
    }
  }

  // Go back
  const goBack = () => {
    if (phase === 'followup') {
      setPhase('interview')
    } else if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1)
    }
  }

  // Plan the funnel + get follow-up questions
  const startFunnelPlanning = async () => {
    setGenerating(true)
    setPhase('followup')
    setError(null)

    try {
      const res = await fetch('/api/ai/plan-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleName: 'default',
          archetypeSections: ['ic-hero', 'ic-ticker', 'ic-cards', 'ic-faq', 'ic-cta'],
          answers,
        }),
      })

      const data = await res.json()

      if (data.followupQuestions && data.followupQuestions.length > 0) {
        setFollowUpQuestions(data.followupQuestions)
      } else {
        // No follow-up needed, go straight to generation
        generateFunnel({})
      }
    } catch {
      setError('Failed to plan funnel. Check your API key and try again.')
      setPhase('interview')
    } finally {
      setGenerating(false)
    }
  }

  // Handle follow-up completion
  const handleFollowUpComplete = async (followUpAnswers: Record<string, string>) => {
    const merged = { ...answers, ...followUpAnswers }
    setAnswers(merged)
    await generateFunnel(merged)
  }

  // Generate the funnel
  const generateFunnel = async (allAnswers: Record<string, string>) => {
    setGenerating(true)
    setPhase('generating')
    setError(null)

    try {
      // Save business profile
      if (userId) {
        await supabase.from('business_profiles').upsert({
          user_id: userId,
          offer_type: allAnswers.offer_type || '',
          niche: allAnswers.niche || '',
          transform: allAnswers.transform || '',
          competitors: allAnswers.competitors || '',
          dream_client: allAnswers.dream_client || '',
          tried_before: allAnswers.tried_before || '',
          client_wants: allAnswers.client_wants || '',
          offer_name: allAnswers.offer_name || '',
          offer_format: allAnswers.offer_format || '',
          offer_includes: allAnswers.offer_includes || '',
          guarantee: allAnswers.guarantee || '',
          price: allAnswers.price || '',
          value_roi: allAnswers.value_roi || '',
          payment_type: allAnswers.payment_type || '',
          pain_points: allAnswers.pain_points || '',
          top_objection: allAnswers.top_objection || '',
          inaction_cost: allAnswers.inaction_cost || '',
          social_proof: allAnswers.social_proof || '',
        })
      }

      // Call create-funnel
      const funnelName = allAnswers.offer_name || allAnswers.niche || 'New Funnel'
      const res = await fetch('/api/ai/create-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: { ...allAnswers, name: funnelName } }),
      })

      const data = await res.json()

      if (data.success && data.funnelId) {
        setGeneratedFunnelId(data.funnelId)
        setPhase('done')
        // Redirect to editor
        router.push(`/dashboard/funnels/${data.funnelId}/edit?tab=ai`)
      } else if (data.error === 'NO_API_KEY') {
        setError(
          'No AI API key configured. Add DEEPSEEK_API_KEY to your .env.local file and restart.'
        )
        setPhase('interview')
      } else {
        setError(data.error || 'Failed to generate funnel. Please try again.')
        setPhase('interview')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setPhase('interview')
    } finally {
      setGenerating(false)
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <p className="text-lg font-bold text-black mb-2">Sign in required</p>
          <p className="text-sm text-gray-500 mb-4">Create an account to build your funnel.</p>
          <a
            href="/login"
            className="inline-block rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Sign in
          </a>
        </div>
      </div>
    )
  }

  // Generating state — show spinner
  if (phase === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          <h2 className="text-xl font-bold text-black mb-2">Building your funnel</h2>
          <p className="text-sm text-gray-500">
            OpBot is writing your copy, designing your sections, and wiring everything together.
            This takes about 30 seconds.
          </p>
        </div>
      </div>
    )
  }

  // Done — redirecting
  if (phase === 'done' && generatedFunnelId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 text-4xl">🎉</div>
          <h2 className="text-xl font-bold text-black mb-2">Your funnel is ready</h2>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to the editor...
          </p>
          <a
            href={`/dashboard/funnels/${generatedFunnelId}/edit?tab=ai`}
            className="inline-block rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Open Editor
          </a>
        </div>
      </div>
    )
  }

  // Error banner
  const errorBanner = error && (
    <div className="mx-auto max-w-2xl mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </div>
  )

  // Follow-up phase
  if (phase === 'followup') {
    return (
      <>
        {errorBanner}
        <FollowUpRound
          questions={followUpQuestions}
          onComplete={handleFollowUpComplete}
          onBack={goBack}
          loading={generating}
        />
      </>
    )
  }

  // Interview steps
  return (
    <>
      {errorBanner}
      {stepKey === 'niche' && (
        <StepNiche values={answers} onChange={setAnswer} onNext={goNext} />
      )}
      {stepKey === 'ideal-client' && (
        <StepClient values={answers} onChange={setAnswer} onNext={goNext} onBack={goBack} />
      )}
      {stepKey === 'offer' && (
        <StepOffer values={answers} onChange={setAnswer} onNext={goNext} onBack={goBack} />
      )}
      {stepKey === 'pricing' && (
        <StepPricing values={answers} onChange={setAnswer} onNext={goNext} onBack={goBack} />
      )}
      {stepKey === 'pain-points' && (
        <StepPainPoints values={answers} onChange={setAnswer} onNext={goNext} onBack={goBack} />
      )}
    </>
  )
}
