'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useRef } from 'react'
import type { Block } from '@/types/blocks'

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

export function CreateFunnelButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'choice' | 'wizard' | 'loading'>('choice')
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [customInput, setCustomInput] = useState('')
  const [loadingText, setLoadingText] = useState('Initializing brand setup...')
  const router = useRouter()

  type WizardMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
  }
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

  function handleClose() {
    setIsOpen(false)
    setMode('choice')
    setCurrentStep(0)
    setAnswers({})
    setCustomInput('')
    setMessages([])
  }

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

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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
        order: 0,
      })

      router.push(`/dashboard/funnels/${funnel.id}/edit`)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
      alert(errMsg)
      handleClose()
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
        router.push(`/dashboard/funnels/${data.funnelId}/edit`)
      } else {
        throw new Error('API returned success but no funnel ID.')
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
      alert(errMsg)
      handleClose()
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: '#39FF14',
          color: '#000',
          fontWeight: 700,
          fontSize: '13px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '-0.2px',
          boxShadow: '0 0 20px rgba(57,255,20,0.2)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 25px rgba(57,255,20,0.35)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 20px rgba(57,255,20,0.2)')}
      >
        + New funnel
      </button>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', zIndex: 100, padding: '40px 16px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', color: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', marginTop: 'auto', marginBottom: 'auto' }}>
            
            {/* CHOICE MODE */}
            {mode === 'choice' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px', marginBottom: '6px' }}>Create New Funnel</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>Choose how you want to build this funnel.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleCreateBase}
                    style={{
                      textAlign: 'left',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      color: '#fff',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  >
                    <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Start from Base Blueprint</strong>
                    <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.4' }}>Get started instantly using our pre-designed, high-converting Inner Circle template.</span>
                  </button>

                  <button
                    onClick={() => {
                      setMessages([
                        {
                          id: 'welcome',
                          role: 'assistant',
                          content: '👋 Welcome to the AI Funnel Architect! Let\'s build your customized conversion page together. To get started, what is the name of your funnel?',
                        }
                      ])
                      setCurrentStep(0)
                      setAnswers({})
                      setCustomInput('')
                      setMode('wizard')
                    }}
                    style={{
                      textAlign: 'left',
                      background: 'rgba(57,255,20,0.02)',
                      border: '1px solid rgba(57,255,20,0.15)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      color: '#fff',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(57,255,20,0.05)'; e.currentTarget.style.borderColor = '#39FF14' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(57,255,20,0.02)'; e.currentTarget.style.borderColor = 'rgba(57,255,20,0.15)' }}
                  >
                    <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px', color: '#39FF14' }}>Start from Scratch (AI Guided) ✦</strong>
                    <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.4' }}>Answer 10 quick business questions and let DeepSeek generate a custom copy and layout tailored for you.</span>
                  </button>
                </div>

                <button
                  onClick={handleClose}
                  style={{ marginTop: '24px', width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* WIZARD MODE (CHAT INTERFACE) */}
            {mode === 'wizard' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '350px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '14px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#39FF14' }}>AI Funnel Architect</span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#39FF14', display: 'inline-block', animation: 'pulse 1.2s infinite ease-in-out' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                    Question {currentStep + 1} of {WIZARD_STEPS.length}
                  </span>
                </div>

                {/* Messages feed */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        lineHeight: '1.45',
                        background: msg.role === 'user' ? 'rgba(255,255,255,0.07)' : 'rgba(57,255,20,0.03)',
                        border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(57,255,20,0.1)',
                        color: '#fff',
                      }}
                    >
                      {msg.content}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick-reply Suggestion Chips */}
                {activeStep && activeStep.type === 'choice' && activeStep.options && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px', flexShrink: 0 }}>
                    {activeStep.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSendAnswer(opt)}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '100px',
                          padding: '6px 12px',
                          color: '#39FF14',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(57,255,20,0.06)'; e.currentTarget.style.borderColor = 'rgba(57,255,20,0.2)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
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
                  style={{ display: 'flex', gap: '8px', flexShrink: 0 }}
                >
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={activeStep?.key === 'name' ? 'e.g. Elite Resellers' : 'Type your answer...'}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: '#fff',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!customInput.trim()}
                    style={{
                      background: !customInput.trim() ? 'rgba(255,255,255,0.03)' : '#39FF14',
                      color: !customInput.trim() ? 'rgba(255,255,255,0.2)' : '#000',
                      border: 'none',
                      borderRadius: '8px',
                      width: '36px',
                      height: '36px',
                      fontWeight: 700,
                      cursor: !customInput.trim() ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      transition: 'background 0.2s',
                    }}
                  >
                    →
                  </button>
                </form>
              </div>
            )}

            {/* LOADING/GENERATING MODE */}
            {mode === 'loading' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(57,255,20,0.15)', borderTopColor: '#39FF14', borderRadius: '50%', animation: 'spin 1.2s infinite linear', margin: '0 auto 24px auto' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>Generating Your Funnel</h4>
                <p style={{ fontSize: '13px', color: '#39FF14', fontWeight: 600, animation: 'pulse 1.5s infinite ease-in-out' }}>
                  {loadingText}
                </p>
                <style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                  @keyframes pulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
