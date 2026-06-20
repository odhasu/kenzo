'use client'

import { useState, useRef, useEffect } from 'react'
import type { Block, FunnelSettings } from '@/types/blocks'

interface AiBuilderPanelProps {
  funnelId?: string
  blocks: Block[]
  settings: FunnelSettings
  onUpdatePage: (newBlocks: Block[], newSettings?: FunnelSettings) => void
}

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  error?: boolean
}

const SUGGESTIONS = [
  { label: 'Set Dark theme 🌙', prompt: 'Change background to dark charcoal (#0a0a0a), text to white, and accent to neon green (#39FF14)' },
  { label: 'Set Light theme ☀️', prompt: 'Change background to clean white (#ffffff), text to dark gray (#171717), and accent to royal blue (#2563eb)' },
  { label: 'Add Hero section ⚡', prompt: 'Add an ic-hero block at the very top of the page with conversion-optimized high-ticket copy' },
  { label: 'Add FAQ section ❓', prompt: 'Add an ic-faq block at the end with questions about refund policies, community size, and vendor quality' },
  { label: 'Accent to Hot Pink 💖', prompt: 'Change the site accent color to hot pink (#ff007f)' },
]

export function AiBuilderPanel({ funnelId, blocks, settings, onUpdatePage }: AiBuilderPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '✦ Hello! I am your Kenzo AI design assistant. Tell me what you want to build or change, and I will modify the layout, blocks, and settings for you in real-time.',
    },
  ])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [checkingApi, setCheckingApi] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'deepseek-v4-pro' | 'deepseek-v4-flash'>('deepseek-v4-pro')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Test API connection on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Load chat history on mount
  useEffect(() => {
    async function fetchChatHistory() {
      try {
        const res = await fetch(`/api/chat?funnelId=${funnelId}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.success && data.messages && data.messages.length > 0) {
          const mapped: Message[] = data.messages.map((m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }))
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: '✦ Hello! I am your Kenzo AI design assistant. Tell me what you want to build or change, and I will modify the layout, blocks, and settings for you in real-time.',
            },
            ...mapped
          ])
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err)
      }
    }

    if (funnelId) {
      fetchChatHistory()
    }
  }, [funnelId])

  async function checkConnection() {
    setCheckingApi(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: [], settings: {}, prompt: 'test' }),
      })
      const data = await res.json()
      if (data.error === 'NO_API_KEY') {
        setShowSetupGuide(true)
      } else {
        setShowSetupGuide(false)
      }
    } catch (e) {
      console.error('Failed connection check:', e)
    } finally {
      setCheckingApi(false)
    }
  }

  async function handleSend(textToSend: string) {
    if (!textToSend.trim() || loading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocks,
          settings,
          prompt: textToSend,
          model: selectedModel,
          funnelId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'NO_API_KEY') {
          setShowSetupGuide(true)
          throw new Error('API key is not configured. Please follow the setup guide.')
        }
        throw new Error(data.message || 'Something went wrong during generation.')
      }

      // Successful update
      if (data.blocks && data.settings) {
        onUpdatePage(data.blocks, data.settings)
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.explanation || 'Page updated successfully!',
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error('AI returned an incomplete response structure.')
      }

    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${errMessage}`,
        error: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  if (showSetupGuide) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#fff', fontFamily: 'inherit' }}>
        <div style={{ padding: '14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#f87171', fontSize: '13px', lineHeight: '1.4' }}>
          <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>⚠️ Setup Required</strong>
          No AI API keys are configured. Follow the steps below to enable the AI Funnel Builder.
        </div>

        <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '6px', fontSize: '13px' }}>A. Local Development Setup</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px', lineHeight: '1.4' }}>
              Create or open the <code>.env.local</code> file in your project root and add your API key:
            </p>
            <pre style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', borderRadius: '6px', overflowX: 'auto', fontSize: '11px', color: '#39FF14', fontFamily: 'monospace' }}>
              DEEPSEEK_API_KEY=your_key_here<br />
              <span style={{ color: 'rgba(255,255,255,0.25)' }}># or</span><br />
              ANTHROPIC_API_KEY=your_key_here<br />
              <span style={{ color: 'rgba(255,255,255,0.25)' }}># or</span><br />
              OPENAI_API_KEY=your_key_here<br />
              <span style={{ color: 'rgba(255,255,255,0.25)' }}># or</span><br />
              GEMINI_API_KEY=your_key_here<br />
              <span style={{ color: 'rgba(255,255,255,0.25)' }}># or</span><br />
              AI_GATEWAY_API_KEY=your_key_here
            </pre>
            <p style={{ marginTop: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
              * Restart your development server (<code>npm run dev</code>) after adding keys.
            </p>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

          <div>
            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '6px', fontSize: '13px' }}>B. Deploying on Vercel</p>
            <ol style={{ paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
              <li>Log in to the <strong>Vercel Dashboard</strong>.</li>
              <li>Open your project (<strong>kenzo</strong>).</li>
              <li>Go to <strong>Settings</strong> &rarr; <strong>Environment Variables</strong>.</li>
              <li>Add key: <code>DEEPSEEK_API_KEY</code>, <code>ANTHROPIC_API_KEY</code>, <code>OPENAI_API_KEY</code>, or <code>AI_GATEWAY_API_KEY</code>.</li>
              <li>Paste your API key value and click <strong>Save</strong>.</li>
              <li>Trigger a redeployment of your project.</li>
            </ol>
          </div>
        </div>

        <button
          onClick={checkConnection}
          disabled={checkingApi}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            background: '#39FF14',
            color: '#000',
            fontWeight: 700,
            cursor: checkingApi ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            boxShadow: '0 0 10px rgba(57,255,20,0.3)',
            transition: 'opacity 0.2s',
            opacity: checkingApi ? 0.6 : 1
          }}
        >
          {checkingApi ? 'Verifying Key...' : 'Check Connection'}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', color: '#fff' }}>
      
      {/* Model Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '12px', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>AI Model</span>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value as 'deepseek-v4-pro' | 'deepseek-v4-flash')}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 8px',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <option value="deepseek-v4-pro">DeepSeek V4 Pro (HQ)</option>
          <option value="deepseek-v4-flash">DeepSeek V4 Flash (Fast)</option>
        </select>
      </div>

      {/* Scrollable messages area */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '14px', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '12.5px',
              lineHeight: '1.45',
              background: msg.error
                ? 'rgba(239, 68, 68, 0.1)'
                : msg.role === 'user'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(57, 255, 20, 0.04)',
              border: msg.error
                ? '1px solid rgba(239, 68, 68, 0.2)'
                : msg.role === 'user'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(57, 255, 20, 0.12)',
              color: msg.error
                ? '#f87171'
                : msg.role === 'user'
                ? 'rgba(255, 255, 255, 0.9)'
                : '#fff',
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '85%',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '12.5px',
              background: 'rgba(57, 255, 20, 0.02)',
              border: '1px solid rgba(57, 255, 20, 0.08)',
              color: 'rgba(255, 255, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#39FF14',
                animation: 'pulse 1.2s infinite ease-in-out'
              }}
            />
            AI is rebuilding page...
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
              }
            `}</style>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && !loading && (
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px' }}>Suggestions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSend(s.prompt)}
                style={{
                  textAlign: 'left',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(57,255,20,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(57,255,20,0.2)';
                  e.currentTarget.style.color = '#39FF14';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend(prompt)
        }}
        style={{ display: 'flex', gap: '6px', flexShrink: 0 }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI to edit this page..."
          disabled={loading}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: loading || !prompt.trim() ? 'rgba(255,255,255,0.04)' : '#39FF14',
            color: loading || !prompt.trim() ? 'rgba(255,255,255,0.25)' : '#000',
            cursor: loading || !prompt.trim() ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            fontWeight: 700,
            transition: 'background 0.2s',
          }}
        >
          ✦
        </button>
      </form>
    </div>
  )
}
