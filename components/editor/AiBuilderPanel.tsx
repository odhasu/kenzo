'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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

type Session = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

const SUGGESTIONS = [
  { label: 'Dark theme + neon green', prompt: 'Set dark-green theme with neon green accent. Add a high-converting hero and ticker for a high-ticket reselling offer.' },
  { label: 'Light theme + royal blue', prompt: 'Switch to light-blue theme. Make it clean and corporate for an agency offer.' },
  { label: 'Add FAQ section', prompt: 'Add an ic-faq block addressing refund policy, starting capital, and vendor quality questions.' },
  { label: 'Add results proof', prompt: 'Add an ic-results block. Reference student screenshots and revenue wins.' },
  { label: 'Rewrite all copy human', prompt: 'Scan every headline and subtext on this page. Rewrite anything that sounds AI-generated — no filler, no hype, just direct human copy from someone who knows high-ticket.' },
]

const WELCOME_MSG: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'I write high-ticket funnel copy — not AI filler. Tell me about your offer, your audience, and what you want the page to do. I\'ll build the blocks and write copy that sounds like a person who\'s actually sold this stuff.',
}

export function AiBuilderPanel({ funnelId, blocks, settings, onUpdatePage }: AiBuilderPanelProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [checkingApi, setCheckingApi] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'best' | 'fast'>('best')
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Test API connection on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Load sessions on mount
  useEffect(() => {
    if (funnelId) fetchSessions()
  }, [funnelId])

  async function fetchSessions() {
    try {
      const res = await fetch(`/api/chat/sessions?funnelId=${funnelId}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.success && data.sessions) {
        setSessions(data.sessions)
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    }
  }

  async function loadSessionMessages(sessionId: string) {
    try {
      const res = await fetch(`/api/chat?funnelId=${funnelId}&sessionId=${sessionId}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.success && data.messages) {
        const mapped: Message[] = data.messages.map((m: { id: string; role: string; content: string }) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
        if (mapped.length > 0) {
          setMessages(mapped)
        } else {
          setMessages([WELCOME_MSG])
        }
      }
    } catch (err) {
      console.error('Failed to load session messages:', err)
    }
  }

  async function handleNewChat() {
    if (!funnelId) return
    setMessages([WELCOME_MSG])
    setActiveSessionId(null)
    try {
      const res = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funnelId }),
      })
      const data = await res.json()
      if (data.success && data.session) {
        setSessions(prev => [data.session, ...prev])
        setActiveSessionId(data.session.id)
      }
    } catch (err) {
      console.error('Failed to create session:', err)
    }
  }

  async function handleSelectSession(sessionId: string) {
    setActiveSessionId(sessionId)
    await loadSessionMessages(sessionId)
  }

  async function handleRenameSession(sessionId: string, newTitle: string) {
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
      const data = await res.json()
      if (data.success) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s))
        setEditingSessionId(null)
      }
    } catch (err) {
      console.error('Failed to rename session:', err)
    }
  }

  async function handleDeleteSession(sessionId: string) {
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
        if (activeSessionId === sessionId) {
          setActiveSessionId(null)
          setMessages([WELCOME_MSG])
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err)
    }
  }

  async function checkConnection() {
    setCheckingApi(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: [], settings: {}, prompt: 'test' }),
      })
      const data = await res.json()
      setShowSetupGuide(data.error === 'NO_API_KEY')
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

    // Create placeholder assistant message for streaming updates
    const assistantId = crypto.randomUUID()
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          settings,
          prompt: textToSend,
          model: selectedModel,
          funnelId,
          sessionId: activeSessionId,
        }),
      })

      // Handle SSE streaming
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('text/event-stream')) {
        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''
        let streamedText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event = JSON.parse(line.slice(6))
                if (event.type === 'token' && event.content) {
                  streamedText += event.content
                  // Update the assistant message in real-time
                  setMessages((prev) => prev.map(m =>
                    m.id === assistantId ? { ...m, content: streamedText } : m
                  ))
                } else if (event.type === 'done' && event.data) {
                  const data = event.data
                  processAIResponse(data, assistantId, streamedText)
                  return
                } else if (event.type === 'error') {
                  throw new Error(event.error || 'Streaming error')
                }
              } catch {
                // Skip malformed events
              }
            }
          }
        }
      } else {
        // Non-streaming fallback
        const data = await response.json()
        if (!response.ok) {
          if (data.error === 'NO_API_KEY') {
            setShowSetupGuide(true)
            throw new Error('API key is not configured.')
          }
          throw new Error(data.message || 'Something went wrong.')
        }
        processAIResponse(data, assistantId, data.explanation || 'Page updated.')
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setMessages((prev) => prev.map(m =>
        m.id === assistantId ? { ...m, content: `Error: ${errMessage}`, error: true } : m
      ))
    } finally {
      setLoading(false)
    }
  }

  async function processAIResponse(data: Record<string, unknown>, assistantId: string, explanation: string) {
    // Adopt session id if newly created
    if (data._sessionId && !activeSessionId) {
      setActiveSessionId(data._sessionId as string)
      await fetchSessions()
    }

    // Update final assistant message
    setMessages((prev) => prev.map(m =>
      m.id === assistantId ? { ...m, content: explanation, error: false } : m
    ))

    // Apply blocks + settings
    if (data.blocks && data.settings) {
      onUpdatePage(data.blocks as Block[], data.settings as FunnelSettings)
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
            opacity: checkingApi ? 0.6 : 1,
          }}
        >
          {checkingApi ? 'Verifying Key...' : 'Check Connection'}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', color: '#fff', gap: '0' }}>

      {/* ── Session Sidebar (black) ──────────────────────────────── */}
      <div style={{
        width: '150px',
        flexShrink: 0,
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* + New chat button */}
        <button
          onClick={handleNewChat}
          disabled={!funnelId}
          style={{
            width: '100%',
            padding: '10px 10px',
            border: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: funnelId ? 'pointer' : 'not-allowed',
            textAlign: 'left',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >
          <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span> New chat
        </button>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.map((session) => {
            const isActive = activeSessionId === session.id
            const isEditing = editingSessionId === session.id
            return (
              <div
                key={session.id}
                style={{
                  position: 'relative',
                }}
                onMouseEnter={e => { (e.currentTarget.querySelector('.session-actions') as HTMLElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget.querySelector('.session-actions') as HTMLElement).style.opacity = '0' }}
              >
                {isEditing ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleRenameSession(session.id, editTitle) }}
                    style={{ padding: '4px 6px' }}
                  >
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onBlur={() => handleRenameSession(session.id, editTitle)}
                      onKeyDown={e => { if (e.key === 'Escape') setEditingSessionId(null) }}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '3px 6px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => handleSelectSession(session.id)}
                    title={session.title}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: 'none',
                      background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                      fontSize: '11px',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      borderLeft: isActive ? '2px solid #39FF14' : '2px solid transparent',
                    }}
                  >
                    {session.title}
                  </button>
                )}

                {/* Hover actions */}
                <div
                  className="session-actions"
                  style={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    gap: '2px',
                    opacity: 0,
                    transition: 'opacity 0.1s',
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingSessionId(session.id); setEditTitle(session.title) }}
                    title="Rename"
                    style={{
                      width: '20px', height: '20px', borderRadius: '3px', border: 'none',
                      background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)',
                      fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm('Delete this chat?')) handleDeleteSession(session.id) }}
                    title="Delete"
                    style={{
                      width: '20px', height: '20px', borderRadius: '3px', border: 'none',
                      background: 'rgba(239,68,68,0.1)', color: 'rgba(239,68,68,0.6)',
                      fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}

          {sessions.length === 0 && (
            <div style={{ padding: '16px 10px', color: 'rgba(255,255,255,0.15)', fontSize: '11px', textAlign: 'center' }}>
              No chats yet
            </div>
          )}
        </div>
      </div>

      {/* ── Main Chat Area ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Model Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '12px', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>AI Model</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as 'best' | 'fast')}
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
            <option value="best">Best (Claude)</option>
            <option value="fast">Fast (DeepSeek)</option>
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
              Writing copy, rebuilding page...
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
    </div>
  )
}
