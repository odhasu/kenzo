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
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [checkingApi, setCheckingApi] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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

    try {
      const response = await fetch('/api/dev/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsgText }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'NO_API_KEY') {
          setShowSetupGuide(true)
          throw new Error('API key is not configured. Please follow the setup guide.')
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
      <div className="relative min-h-screen overflow-hidden bg-white">
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-lg font-bold tracking-tight text-black">Kenzo</Link>
              <nav className="flex gap-6">
                <Link href="/dashboard" className="text-sm text-gray-500 transition-colors hover:text-black">Funnels</Link>
                <Link href="/dashboard/train" className="text-sm text-gray-500 transition-colors hover:text-black">AI Training ✦</Link>
                <Link href="/dashboard/developer" className="text-sm font-semibold text-black">Dev Console 🛠️</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-xl px-6 py-20">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 leading-relaxed">
            <strong className="block text-black">⚠️ API Key Required</strong>
            To enable the Developer AI Console, configure your API key.
          </div>
          <div className="mt-6 text-sm text-gray-500 leading-relaxed">
            <p className="mb-2 font-semibold text-black">Configure Locally</p>
            <p className="mb-3">Open your <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-black">.env.local</code> file in your project root:</p>
            <pre className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 overflow-x-auto">
              DEEPSEEK_API_KEY=your_key_here
            </pre>
            <p className="text-xs text-gray-400">
              * Restart your dev server after updating env files.
            </p>
          </div>
          <button
            onClick={checkConnection}
            disabled={checkingApi}
            className="mt-6 w-full rounded-full bg-black py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50"
          >
            {checkingApi ? 'Verifying...' : 'Check Connection'}
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Light header */}
      <header className="flex-shrink-0 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-bold tracking-tight text-black">Kenzo</Link>
            <nav className="flex gap-6">
              <Link href="/dashboard" className="text-sm text-gray-500 transition-colors hover:text-black">Funnels</Link>
              <Link href="/dashboard/train" className="text-sm text-gray-500 transition-colors hover:text-black">AI Training ✦</Link>
              <Link href="/dashboard/developer" className="text-sm font-semibold text-black">Dev Console 🛠️</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Dark terminal body */}
      <div className="flex flex-1 overflow-hidden bg-[#0a0a0a]">
        {/* Left logs panel */}
        <div className="hidden w-[320px] flex-shrink-0 flex-col border-r border-white/5 lg:flex">
          <div className="flex items-center justify-between border-b border-white/5 bg-[#111] px-4 py-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Agent Terminal Logs</span>
            <span className={`h-2 w-2 rounded-full ${loading ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-white/20'}`} />
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-white/60 leading-relaxed">
            {!loading && messages.length <= 1 && (
              <span className="text-white/25">Waiting for request...</span>
            )}
            {messages.map((msg) => {
              if (msg.role === 'assistant' && msg.logs && msg.logs.length > 0) {
                return (
                  <div key={msg.id} className="mb-4 border-b border-white/5 pb-3">
                    <p className="mb-2 text-[10px] font-bold text-green-400">[EXECUTION HISTORY]</p>
                    {msg.logs.map((log, i) => (
                      <div key={i} className="mb-1">
                        {log.action === 'read' ? '🔍' : '✍️'} {log.action.toUpperCase()}: <span className="text-white">{log.path}</span>
                        <br />
                        Status: <span className={log.status === 'Success' ? 'text-green-400' : 'text-red-400'}>{log.status}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            })}
            {loading && (
              <div>
                <span className="text-green-400">▶ Running multi-step autonomous loop...</span>
                <div className="mt-3">
                  <div className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/10 border-t-green-400 align-middle" />
                  <span className="inline-block text-white/40 align-middle">Analyzing codebase & editing...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right chat area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-white/6 text-white/90 border border-white/8'
                    : msg.error
                      ? 'mr-auto border border-red-500/20 bg-red-500/8 text-red-400'
                      : 'mr-auto border border-green-400/10 bg-green-400/5 text-white/90'
                }`}
              >
                {msg.role === 'assistant' && !msg.error && (
                  <span className="mb-2 block text-[11px] font-bold text-green-400">DEVELOPER AGENT</span>
                )}
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3 border-t border-white/5 p-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              placeholder="Tell the agent what to implement on the website codebase..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/20"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="rounded-lg bg-green-400 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-green-300 disabled:bg-white/5 disabled:text-white/25"
            >
              Run ✦
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
