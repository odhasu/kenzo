'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type LogEntry = {
  action: 'read' | 'write'
  path: string
  status: string
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  logs?: LogEntry[]
  error?: boolean
}

export default function DeveloperPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '🛠️ Welcome to the Developer Console. I am your autonomous AI engineering assistant. Tell me what changes you want to make to the website source code (e.g., changing styling, adding pages, rewriting copy), and I will read and write the local codebase files to fulfill your request in real-time.',
    },
  ])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeLogs, setActiveLogs] = useState<LogEntry[]>([])
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [checkingApi, setCheckingApi] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, activeLogs])

  // Check connection and fetch chat history on mount
  useEffect(() => {
    checkConnection()

    async function fetchHistory() {
      try {
        const res = await fetch('/api/chat?type=developer')
        if (!res.ok) return
        const data = await res.json()
        if (data.success && data.messages && data.messages.length > 0) {
          const mapped = data.messages.map((m: { id: string; role: string; content: string; logs?: LogEntry[] }) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            logs: m.logs || undefined
          }))
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: '🛠️ Welcome to the Developer Console. I am your autonomous AI engineering assistant. Tell me what changes you want to make to the website source code (e.g., changing styling, adding pages, rewriting copy), and I will read and write the local codebase files to fulfill your request in real-time.',
            },
            ...mapped
          ])
        }
      } catch (err) {
        console.error('Failed to fetch developer chat history:', err)
      }
    }

    fetchHistory()
  }, [])

  async function checkConnection() {
    setCheckingApi(true)
    try {
      const res = await fetch('/api/dev/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test' }),
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    const userMsgText = prompt
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMsgText,
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setLoading(true)
    setActiveLogs([])

    try {
      const response = await fetch('/api/dev/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMsgText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'NO_API_KEY') {
          setShowSetupGuide(true)
          throw new Error('DeepSeek API key is not configured. Please follow the setup guide.')
        }
        throw new Error(data.message || 'Something went wrong during code modifications.')
      }

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.explanation || 'Codebase updated successfully!',
          logs: data.logs || [],
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error('AI returned an incomplete response structure.')
      }

    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      const errorMessage: ChatMessage = {
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
      <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,5,0.9)', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '15px', fontWeight: 800 }}>Kenzo Developer Console</span>
        </header>
        <main style={{ maxWidth: '600px', margin: '80px auto 0 auto', padding: '0 24px' }}>
          <div style={{ padding: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#f87171', fontSize: '13px', lineHeight: '1.4', marginBottom: '24px' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>⚠️ DeepSeek Key Required</strong>
            To enable the Developer AI Console, make sure you configure your <code>DEEPSEEK_API_KEY</code>.
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Configure Locally</p>
            <p style={{ marginBottom: '12px' }}>Open your <code>.env.local</code> file in your project root and make sure the key is present:</p>
            <pre style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', borderRadius: '6px', overflowX: 'auto', fontSize: '11px', color: '#39FF14', fontFamily: 'monospace', marginBottom: '20px' }}>
              DEEPSEEK_API_KEY=your_key_here
            </pre>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
              * Remember to restart your dev server (<code>npm run dev</code>) after updating your env files.
            </p>
          </div>
          <button
            onClick={checkConnection}
            disabled={checkingApi}
            style={{
              marginTop: '24px',
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#39FF14',
              color: '#000',
              fontWeight: 700,
              cursor: checkingApi ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              boxShadow: '0 0 10px rgba(57,255,20,0.3)',
              opacity: checkingApi ? 0.6 : 1
            }}
          >
            {checkingApi ? 'Verifying Key...' : 'Check Connection'}
          </button>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/" style={{ fontSize: '16px', fontWeight: 800, color: '#fff', textDecoration: 'none', letterSpacing: '-0.3px' }}>
              Kenzo
            </Link>
            <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link
                href="/dashboard"
                className="nav-link"
              >
                Funnels
              </Link>
              <Link
                href="/dashboard/train"
                className="nav-link"
              >
                AI Training ✦
              </Link>
              <Link href="/dashboard/developer" style={{ fontSize: '13px', fontWeight: 600, color: '#39FF14', textDecoration: 'none' }}>
                Dev Console 🛠️
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* CHAT INTERFACE & LOG PANEL */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '24px' }}>
        
        {/* LEFT LOGS PANEL (Terminal Style) */}
        <div style={{ flex: '0 0 350px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', marginRight: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Agent Terminal Logs</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: loading ? '#39FF14' : 'rgba(255,255,255,0.2)', boxShadow: loading ? '0 0 8px #39FF14' : 'none' }} />
          </div>
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
            {!loading && messages.length <= 1 && (
              <span style={{ color: 'rgba(255,255,255,0.25)' }}>Waiting for request...</span>
            )}
            
            {/* Show logs for the last message */}
            {messages.map((msg) => {
              if (msg.role === 'assistant' && msg.logs && msg.logs.length > 0) {
                return (
                  <div key={msg.id} style={{ marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '10px' }}>
                    <p style={{ color: '#39FF14', margin: '0 0 6px 0', fontSize: '10px', fontWeight: 800 }}>[EXECUTION HISTORY]</p>
                    {msg.logs.map((log, i) => (
                      <div key={i} style={{ marginBottom: '4px' }}>
                        {log.action === 'read' ? '🔍' : '✍️'} {log.action.toUpperCase()}: <span style={{ color: '#fff' }}>{log.path}</span>
                        <br />
                        Status: <span style={{ color: log.status === 'Success' ? '#39FF14' : '#ef4444' }}>{log.status}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            })}

            {loading && (
              <div>
                <span style={{ color: '#39FF14' }}>▶ Running multi-step autonomous loop...</span>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ width: '12px', height: '12px', border: '2px solid rgba(57,255,20,0.25)', borderTopColor: '#39FF14', borderRadius: '50%', animation: 'spin 1s infinite linear', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', verticalAlign: 'middle' }}>Analyzing codebase & editing...</span>
                </div>
              </div>
            )}
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          
          {/* Scrollable messages container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.error
                    ? 'rgba(239, 68, 68, 0.08)'
                    : msg.role === 'user'
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(57,255,20,0.03)',
                  border: msg.error
                    ? '1px solid rgba(239, 68, 68, 0.2)'
                    : msg.role === 'user'
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(57,255,20,0.12)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '13.5px',
                  lineHeight: '1.5',
                  color: msg.error ? '#f87171' : 'rgba(255,255,255,0.9)',
                }}
              >
                {msg.role === 'assistant' && !msg.error && (
                  <span style={{ color: '#39FF14', fontWeight: 800, display: 'block', marginBottom: '6px', fontSize: '11px', letterSpacing: '0.5px' }}>DEVELOPER AGENT</span>
                )}
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSubmit} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              placeholder="Tell the agent what to implement on the website codebase..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13.5px',
                color: '#fff',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              style={{
                background: loading || !prompt.trim() ? 'rgba(255,255,255,0.04)' : '#39FF14',
                color: loading || !prompt.trim() ? 'rgba(255,255,255,0.25)' : '#000',
                border: 'none',
                borderRadius: '8px',
                padding: '0 18px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: loading || !prompt.trim() ? 'default' : 'pointer',
                transition: 'background 0.2s',
                boxShadow: loading || !prompt.trim() ? 'none' : '0 0 10px rgba(57,255,20,0.2)',
              }}
            >
              Run Code Edit ✦
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
