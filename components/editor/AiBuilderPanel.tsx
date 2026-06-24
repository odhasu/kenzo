'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Block, FunnelSettings } from '@/types/blocks'

interface AiBuilderPanelProps {
  funnelId?: string
  blocks: Block[]
  settings: FunnelSettings
  selectedBlockId?: string | null
  onUpdatePage: (newBlocks: Block[], newSettings?: FunnelSettings) => void
}

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system' | 'thinking'
  content: string
  error?: boolean
  collapsed?: boolean
  action?: 'talk' | 'clarify' | 'edit'
  question?: string
}

const WELCOME_MSG: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Start editing with AI: describe what you want to change.',
}

const SUGGESTIONS = [
  { label: 'Dark theme + neon green', prompt: 'Set dark-green theme with neon green accent. Add a high-converting hero and ticker for a high-ticket reselling offer.' },
  { label: 'Light theme + royal blue', prompt: 'Switch to light-blue theme. Make it clean and corporate for an agency offer.' },
  { label: 'Add FAQ section', prompt: 'Add an ic-faq block addressing refund policy, starting capital, and vendor quality questions.' },
  { label: 'Add results proof', prompt: 'Add an ic-results block. Reference student screenshots and revenue wins.' },
  { label: 'Rewrite all copy human', prompt: 'Scan every headline and subtext on this page. Rewrite anything that sounds AI-generated — no filler, no hype, just direct human copy from someone who knows high-ticket.' },
]

export function AiBuilderPanel({ funnelId, blocks, settings, selectedBlockId, onUpdatePage }: AiBuilderPanelProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingApi, setCheckingApi] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Test API connection + load chat history on mount
  useEffect(() => {
    checkConnection()
    if (funnelId) loadChatHistory()
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
      setShowSetupGuide(data.error === 'NO_API_KEY')
    } catch {
      // Connection check fail is fine
    } finally {
      setCheckingApi(false)
    }
  }

  async function loadChatHistory() {
    try {
      const res = await fetch(`/api/chat?funnelId=${funnelId}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.success && data.messages?.length > 0) {
        const mapped: Message[] = data.messages.map((m: { id: string; role: string; content: string }) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
        setMessages([WELCOME_MSG, ...mapped])
      }
    } catch (err) {
      console.error('Failed to load chat history:', err)
    }
  }

  async function handleSend(textToSend: string) {
    if (!textToSend.trim() || loading) return

    const abortController = new AbortController()
    abortRef.current = abortController

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
    }

    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    setLoading(true)

    // Create thinking placeholder
    const thinkingId = crypto.randomUUID()
    const assistantId = crypto.randomUUID()
    setMessages(prev => [
      ...prev,
      { id: thinkingId, role: 'thinking', content: '', collapsed: false },
      { id: assistantId, role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          settings,
          prompt: textToSend,
          funnelId,
          targetBlockId: selectedBlockId || null,
        }),
        signal: abortController.signal,
      })

      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('text/event-stream')) {
        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''
        let thinkingContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Parse SSE events
          const parts = buffer.split('\n\n')
          buffer = parts.pop() || ''

          for (const part of parts) {
            const lines = part.split('\n')
            let eventType = ''
            let dataStr = ''

            for (const line of lines) {
              if (line.startsWith('event: ')) {
                eventType = line.slice(7).trim()
              } else if (line.startsWith('data: ')) {
                dataStr = line.slice(6)
              }
            }

            if (!dataStr) continue

            try {
              const data = JSON.parse(dataStr)

              if (eventType === 'thinking') {
                thinkingContent += data.delta || ''
                setMessages(prev => prev.map(m =>
                  m.id === thinkingId ? { ...m, content: thinkingContent } : m
                ))
              } else if (eventType === 'message') {
                // Collapse thinking
                setMessages(prev => prev.map(m =>
                  m.id === thinkingId ? { ...m, collapsed: true } : m
                ))

                const reply = data.reply || 'Done.'
                const action = data.action || 'talk'
                const question = data.question

                // Update assistant message with reply
                setMessages(prev => prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: reply, action, question, error: false }
                    : m
                ))

                // Apply to canvas ONLY when action='edit'
                if (action === 'edit' && data.blocks && data.settings) {
                  onUpdatePage(data.blocks as Block[], data.settings as FunnelSettings)
                }
              } else if (eventType === 'done') {
                // Ensure thinking is collapsed
                setMessages(prev => prev.map(m =>
                  m.id === thinkingId ? { ...m, collapsed: true } : m
                ))
              }
            } catch {
              // Skip malformed events
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
        // Collapse thinking
        setMessages(prev => prev.map(m =>
          m.id === thinkingId ? { ...m, content: 'Thinking…', collapsed: true } : m
        ))

        const reply = data.reply || data.explanation || 'Page updated.'
        const action = data.action || 'talk'
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: reply, action, question: data.question, error: false }
            : m
        ))

        if (action === 'edit' && data.blocks && data.settings) {
          onUpdatePage(data.blocks as Block[], data.settings as FunnelSettings)
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
      const errMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: `Error: ${errMessage}`, error: true } : m
      ))
      setMessages(prev => prev.map(m =>
        m.id === thinkingId ? { ...m, collapsed: true } : m
      ))
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  function handleStop() {
    abortRef.current?.abort()
    setLoading(false)
  }

  function toggleThinking(msgId: string) {
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, collapsed: !m.collapsed } : m
    ))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(prompt)
    }
  }

  if (showSetupGuide) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#ffe', fontFamily: 'inherit' }}>
        <div style={{ padding: '14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#f87171', fontSize: '13px', lineHeight: '1.4' }}>
          <strong style={{ color: '#ffe', display: 'block', marginBottom: '4px' }}>⚠️ Setup Required</strong>
          No AI API keys are configured. Follow the steps below to enable Kenzo AI.
        </div>
        <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <p style={{ fontWeight: 700, color: '#ffe', marginBottom: '6px', fontSize: '13px' }}>A. Local Development Setup</p>
            <p style={{ color: '#ffffeea6', marginBottom: '8px', lineHeight: '1.4' }}>
              Create or open the <code>.env.local</code> file in your project root and add your API key:
            </p>
            <pre style={{
              background: '#1a1a1a', border: '1px solid #ffffee14', padding: '10px', borderRadius: '6px',
              overflowX: 'auto', fontSize: '11px', color: '#6ba0c0', fontFamily: "'SF Mono', 'Fira Code', monospace"
            }}>
              DEEPSEEK_API_KEY=your_key_here
            </pre>
            <p style={{ marginTop: '6px', color: '#ffffeea6', fontSize: '11px' }}>
              * Restart your development server (<code>npm run dev</code>) after adding keys.
            </p>
          </div>
          <div style={{ height: '1px', background: '#ffffee14' }} />
          <div>
            <p style={{ fontWeight: 700, color: '#ffe', marginBottom: '6px', fontSize: '13px' }}>B. Deploying on Vercel</p>
            <ol style={{ paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#ffffeea6', lineHeight: '1.4' }}>
              <li>Log in to the <strong>Vercel Dashboard</strong>.</li>
              <li>Open your project (<strong>kenzo</strong>).</li>
              <li>Go to <strong>Settings</strong> → <strong>Environment Variables</strong>.</li>
              <li>Add key: <code>DEEPSEEK_API_KEY</code>.</li>
              <li>Paste your API key value and click <strong>Save</strong>.</li>
              <li>Trigger a redeployment of your project.</li>
            </ol>
          </div>
        </div>
        <button
          onClick={checkConnection}
          disabled={checkingApi}
          style={{
            marginTop: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px',
            border: 'none', background: '#6ba0c0', color: '#1a1a1a', fontWeight: 700,
            cursor: checkingApi ? 'not-allowed' : 'pointer', fontSize: '12px',
            transition: 'opacity 0.2s', opacity: checkingApi ? 0.6 : 1, fontFamily: 'inherit',
          }}
        >
          {checkingApi ? 'Verifying...' : 'Check Connection'}
        </button>
      </div>
    )
  }

  const isOnlyWelcome = messages.length === 1 && messages[0].id === 'welcome'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#ffe' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #ffffee14', paddingBottom: '10px',
        marginBottom: '12px', flexShrink: 0,
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px',
          textTransform: 'uppercase', color: '#ffffeea6',
        }}>
          Kenzo AI
        </span>
        {selectedBlockId && (
          <span style={{
            fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '100px',
            background: '#ffffee0f', color: '#ffffeea6',
          }}>
            ✦ Inspect active
          </span>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', marginBottom: '14px',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>
        {messages.map(msg => {
          // Thinking blocks — collapsible
          if (msg.role === 'thinking') {
            if (!msg.content) return null // hide empty thinking
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: 'flex-start', maxWidth: '85%', width: '100%',
                  borderRadius: '8px', fontSize: '11.5px',
                  background: '#ffffee05', border: '1px solid #ffffee0f',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => toggleThinking(msg.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 10px', background: 'transparent', border: 'none',
                    color: '#ffffeea6', fontSize: '11px', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{
                    display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%',
                    background: msg.collapsed ? '#ffffee2e' : '#6ba0c0',
                    flexShrink: 0,
                  }} />
                  {msg.collapsed ? 'Thinking…' : 'Thinking — click to collapse'}
                </button>
                {!msg.collapsed && (
                  <div style={{
                    padding: '4px 10px 10px', color: '#ffffeea6',
                    lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    maxHeight: '200px', overflowY: 'auto',
                  }}>
                    {msg.content}
                  </div>
                )}
              </div>
            )
          }

          // Regular messages
          return (
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
                  ? 'rgba(239,68,68,0.08)'
                  : msg.role === 'user'
                    ? '#ffffee0f'
                    : '#ffffee08',
                border: msg.error
                  ? '1px solid rgba(239,68,68,0.2)'
                  : msg.role === 'user'
                    ? '1px solid #ffffee14'
                    : '1px solid #ffffee14',
                color: msg.error
                  ? '#f87171'
                  : msg.role === 'user'
                    ? '#ffe'
                    : '#ffe',
                display: 'flex', flexDirection: 'column', gap: '6px',
              }}
            >
              <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>

              {/* Clarify: show question prompt */}
              {msg.action === 'clarify' && msg.question && (
                <div style={{
                  marginTop: '4px', padding: '8px 10px',
                  background: '#ffffee0f', borderRadius: '6px',
                  border: '1px dashed #ffffee2e',
                  fontSize: '12px', color: '#ffffeea6',
                }}>
                  {msg.question}
                </div>
              )}

              {/* Action badge */}
              {msg.action && msg.role === 'assistant' && (
                <span style={{
                  fontSize: '9px', fontWeight: 600, letterSpacing: '0.5px',
                  textTransform: 'uppercase', color: '#ffffee2e',
                  alignSelf: 'flex-end',
                }}>
                  {msg.action === 'edit' ? '✎ edited' : msg.action === 'clarify' ? '? clarify' : '💬 talk'}
                </span>
              )}
            </div>
          )
        })}

        {loading && messages[messages.length - 1]?.content === '' && messages[messages.length - 1]?.role !== 'thinking' && (
          <div style={{
            alignSelf: 'flex-start', maxWidth: '85%', padding: '10px 12px',
            borderRadius: '10px', fontSize: '12.5px', background: '#ffffee08',
            border: '1px solid #ffffee14', color: '#ffffeea6',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
              background: '#6ba0c0', animation: 'pulse 1.2s infinite ease-in-out',
            }} />
            Thinking…
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

      {/* Suggestions */}
      {isOnlyWelcome && !loading && (
        <div style={{ marginBottom: '14px' }}>
          <p style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px',
            textTransform: 'uppercase', color: '#ffffee2e', marginBottom: '8px',
          }}>
            Suggestions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SUGGESTIONS.map(s => (
              <button
                key={s.label}
                onClick={() => handleSend(s.prompt)}
                style={{
                  textAlign: 'left', background: '#ffffee08', border: '1px solid #ffffee14',
                  borderRadius: '6px', padding: '7px 10px', color: '#ffffeea6',
                  fontSize: '11.5px', cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffffee0f'
                  e.currentTarget.style.borderColor = '#ffffee2e'
                  e.currentTarget.style.color = '#ffe'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#ffffee08'
                  e.currentTarget.style.borderColor = '#ffffee14'
                  e.currentTarget.style.color = '#ffffeea6'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={e => {
          e.preventDefault()
          if (loading) { handleStop(); return }
          handleSend(prompt)
        }}
        style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'flex-end' }}
      >
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          disabled={loading}
          rows={1}
          style={{
            flex: 1,
            background: '#00000047',
            border: '1px solid #ffffee14',
            borderRadius: '0.5rem',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#ffe',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'none',
            boxSizing: 'border-box',
            minHeight: '40px',
            maxHeight: '120px',
          }}
          onInput={e => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = Math.min(el.scrollHeight, 120) + 'px'
          }}
        />
        <button
          type="submit"
          disabled={!loading && !prompt.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '0.5rem',
            border: 'none',
            background: loading
              ? 'rgba(239,68,68,0.15)'
              : prompt.trim()
                ? '#ffe'
                : '#ffffee08',
            color: loading
              ? '#f87171'
              : prompt.trim()
                ? '#1a1a1a'
                : '#ffffee2e',
            cursor: loading ? 'pointer' : prompt.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            transition: 'background 0.15s, color 0.15s',
            flexShrink: 0,
            fontFamily: 'inherit',
          }}
          title={loading ? 'Stop generating' : 'Send'}
        >
          {loading ? '■' : '↑'}
        </button>
      </form>
    </div>
  )
}
