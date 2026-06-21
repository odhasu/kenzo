'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Block, BlockType, BlockProps, FunnelSettings, BackgroundId, ThemeId, LetterSpacing, FontWeight, SectionSpacing, ButtonStyle, ButtonSize } from '@/types/blocks'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { resolveTokens } from '@/lib/themes'
import { FunnelBackground } from '@/components/funnel/FunnelBackground'
import { PreviewErrorBoundary } from '@/components/PreviewErrorBoundary'
import { DEFAULT_SETTINGS } from '@/types/blocks'

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════
type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

const SUGGESTIONS = [
  { label: 'High-ticket reselling course', prompt: 'I sell a $1k reselling course teaching beginners how to flip sneakers and streetwear for profit.' },
  { label: 'Fitness coaching program', prompt: 'I sell a $500/month 1-on-1 fitness coaching program for busy professionals who want to get in shape.' },
  { label: 'Trading mentorship', prompt: 'I offer a $2k forex trading mentorship for people who want to quit their 9-5.' },
  { label: 'Agency lead generation', prompt: 'I run a done-for-you lead generation agency for real estate agents. $1.5k/month retainer.' },
]

// ═══════════════════════════════════════════
// SANITIZE AI RESPONSE — prevent crashes from bad data
// ═══════════════════════════════════════════

const VALID_BLOCK_TYPES: Set<string> = new Set([
  'heading', 'text', 'button', 'image', 'form',
  'ic-hero', 'ic-ticker', 'ic-cards', 'ic-faq', 'ic-apply', 'ic-cta', 'ic-results',
])

const VALID_BACKGROUNDS: Set<string> = new Set([
  'none', 'gradient', 'particles', 'grid', 'glow', 'aurora', 'dots', 'noise', 'waves', 'stars',
])

const VALID_THEMES: Set<string> = new Set([
  'dark-green', 'dark-minimal', 'light-clean', 'light-blue',
])

function sanitizeProps(type: string, raw: unknown): Record<string, unknown> {
  const p = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  switch (type) {
    case 'ic-hero':
      return {
        badge: typeof p.badge === 'string' ? p.badge : '',
        headline: typeof p.headline === 'string' ? p.headline : '',
        subtext: typeof p.subtext === 'string' ? p.subtext : '',
        ctaLabel: typeof p.ctaLabel === 'string' ? p.ctaLabel : '',
        ctaHref: typeof p.ctaHref === 'string' ? p.ctaHref : '',
      }
    case 'ic-ticker':
      return {
        items: Array.isArray(p.items) ? p.items.filter((i: unknown) => typeof i === 'string') : [],
      }
    case 'ic-cards':
      return {
        headline: typeof p.headline === 'string' ? p.headline : '',
        cards: Array.isArray(p.cards)
          ? p.cards.filter((c: unknown): c is Record<string, unknown> => typeof c === 'object' && c !== null).map((c) => ({
              title: typeof c.title === 'string' ? c.title : '',
              desc: typeof c.desc === 'string' ? c.desc : '',
              bullets: Array.isArray(c.bullets) ? c.bullets.filter((b: unknown) => typeof b === 'string') : [],
            }))
          : [],
        ctaLabel: typeof p.ctaLabel === 'string' ? p.ctaLabel : '',
        ctaHref: typeof p.ctaHref === 'string' ? p.ctaHref : '',
      }
    case 'ic-faq':
      return {
        headline: typeof p.headline === 'string' ? p.headline : '',
        items: Array.isArray(p.items)
          ? p.items.filter((i: unknown): i is Record<string, unknown> => typeof i === 'object' && i !== null).map((i) => ({
              q: typeof i.q === 'string' ? i.q : '',
              a: typeof i.a === 'string' ? i.a : '',
            }))
          : [],
      }
    case 'ic-apply':
      return {
        headline: typeof p.headline === 'string' ? p.headline : '',
        subtext: typeof p.subtext === 'string' ? p.subtext : '',
      }
    case 'ic-cta':
      return {
        label: typeof p.label === 'string' ? p.label : '',
        href: typeof p.href === 'string' ? p.href : '',
        subtext: typeof p.subtext === 'string' ? p.subtext : '',
      }
    case 'ic-results':
      return {
        headline: typeof p.headline === 'string' ? p.headline : '',
        photos: Array.isArray(p.photos) ? p.photos.filter((ph: unknown) => typeof ph === 'string') : [],
      }
    case 'form':
      return {
        fields: Array.isArray(p.fields)
          ? p.fields.filter((f: unknown) => typeof f === 'string' && ['email', 'name', 'phone'].includes(f))
          : ['email'],
      }
    case 'heading':
    case 'text':
      return { text: typeof p.text === 'string' ? p.text : '' }
    case 'button':
      return {
        label: typeof p.label === 'string' ? p.label : '',
        href: typeof p.href === 'string' ? p.href : '',
      }
    case 'image':
      return {
        src: typeof p.src === 'string' ? p.src : '',
        alt: typeof p.alt === 'string' ? p.alt : '',
      }
    default:
      return {}
  }
}

function sanitizeBlocks(blocks: unknown): Block[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((b): b is Record<string, unknown> => typeof b === 'object' && b !== null)
    .filter(b => typeof b.type === 'string' && VALID_BLOCK_TYPES.has(b.type))
    .map(b => {
      const rawProps = typeof b.props === 'object' && b.props !== null ? b.props : {}
      return {
        id: typeof b.id === 'string' && b.id.length > 0 ? b.id : crypto.randomUUID(),
        type: b.type as BlockType,
        props: sanitizeProps(b.type as string, rawProps),
        hidden: typeof b.hidden === 'boolean' ? b.hidden : undefined,
      }
    }) as unknown as Block[]
}

function sanitizeSettings(raw: unknown): FunnelSettings {
  const s = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  return {
    theme: (typeof s.theme === 'string' && VALID_THEMES.has(s.theme) ? s.theme : 'dark-green') as ThemeId,
    accentColor: typeof s.accentColor === 'string' ? s.accentColor : '',
    bgColor: typeof s.bgColor === 'string' ? s.bgColor : '',
    textColor: typeof s.textColor === 'string' ? s.textColor : '',
    font: typeof s.font === 'string' && s.font.length > 0 ? s.font : 'Inter',
    headingFont: typeof s.headingFont === 'string' ? s.headingFont : '',
    fontScale: safeNum(s.fontScale, 0.8, 1.2, 1.0),
    letterSpacing: (typeof s.letterSpacing === 'string' && ['tight', 'normal', 'wide'].includes(s.letterSpacing) ? s.letterSpacing : 'tight') as LetterSpacing,
    fontWeight: (typeof s.fontWeight === 'string' && ['regular', 'medium', 'bold'].includes(s.fontWeight) ? s.fontWeight : 'bold') as FontWeight,
    maxWidth: safeNum(s.maxWidth, 600, 1400, 1100),
    sectionSpacing: (typeof s.sectionSpacing === 'string' && ['compact', 'normal', 'spacious'].includes(s.sectionSpacing) ? s.sectionSpacing : 'normal') as SectionSpacing,
    borderRadius: safeNum(s.borderRadius, 0, 24, 12),
    buttonStyle: (typeof s.buttonStyle === 'string' && ['filled', 'outline', 'ghost'].includes(s.buttonStyle) ? s.buttonStyle : 'filled') as ButtonStyle,
    buttonSize: (typeof s.buttonSize === 'string' && ['sm', 'md', 'lg'].includes(s.buttonSize) ? s.buttonSize : 'lg') as ButtonSize,
    buttonRadius: safeNum(s.buttonRadius, 0, 50, 12),
    glowEnabled: typeof s.glowEnabled === 'boolean' ? s.glowEnabled : true,
    gradientHeadlines: typeof s.gradientHeadlines === 'boolean' ? s.gradientHeadlines : true,
    glassmorphism: typeof s.glassmorphism === 'boolean' ? s.glassmorphism : false,
    tickerSpeed: safeNum(s.tickerSpeed, 8, 80, 34),
    background: (typeof s.background === 'string' && VALID_BACKGROUNDS.has(s.background) ? s.background : 'none') as BackgroundId,
    pageTitle: typeof s.pageTitle === 'string' ? s.pageTitle : '',
    faviconUrl: typeof s.faviconUrl === 'string' ? s.faviconUrl : '',
    ogImage: typeof s.ogImage === 'string' ? s.ogImage : '',
    pixelId: typeof s.pixelId === 'string' ? s.pixelId : '',
    customCss: typeof s.customCss === 'string' ? s.customCss : '',
  }
}

function safeNum(val: unknown, min: number, max: number, fallback: number): number {
  if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return fallback
  return Math.max(min, Math.min(max, Math.round(val)))
}

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════
export default function CreatePage() {
  const router = useRouter()

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey! I build high-converting funnels for coaches, course creators, and agency owners. What do you sell, and who's it for?",
    },
  ])
  const [draftBlocks, setDraftBlocks] = useState<Block[]>([])
  const [draftSettings, setDraftSettings] = useState<FunnelSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [checkingApi, setCheckingApi] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Auto-scroll chat ──────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Check auth + API on mount ──────────────────────────────────
  useEffect(() => {
    async function check() {
      setCheckingApi(true)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsAuthenticated(false)
          setCheckingApi(false)
          return
        }
        setIsAuthenticated(true)

        // Quick API key check — don't send a real message, just hit endpoint
        const res = await fetch('/api/ai/chat-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: 'API_KEY_CHECK' }], draftBlocks: [], draftSettings: DEFAULT_SETTINGS }),
        })
        const data = await res.json()
        if (data.error === 'NO_API_KEY') {
          setShowSetupGuide(true)
        } else {
          setShowSetupGuide(false)
        }
      } catch {
        setShowSetupGuide(false)
      } finally {
        setCheckingApi(false)
      }
    }
    check()
  }, [])

  // ── Focus input on mount ──────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ── Send message ──────────────────────────────────────────────
  async function handleSend(textToSend: string) {
    if (!textToSend.trim() || loading) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setPrompt('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          draftBlocks,
          draftSettings,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'NO_API_KEY') {
          setShowSetupGuide(true)
          throw new Error('API key not configured.')
        }
        throw new Error(data.message || 'Something went wrong.')
      }

      // Update funnel state — sanitize AI response before setState
      if (data.blocks) setDraftBlocks(sanitizeBlocks(data.blocks))
      if (data.settings) setDraftSettings(sanitizeSettings(data.settings))
      if (data.ready) setReady(true)

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply || 'Funnel updated.',
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${errMsg}`,
        error: true,
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  // ── Open in editor (save funnel + page + chat, then redirect) ─
  async function handleOpenInEditor() {
    if (saving || draftBlocks.length === 0) return
    setSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Generate name from first heading or hero
      let funnelName = 'My Funnel'
      const hero = draftBlocks.find(b => b.type === 'ic-hero')
      if (hero && hero.type === 'ic-hero') {
        funnelName = hero.props.headline.slice(0, 60)
      } else {
        const heading = draftBlocks.find(b => b.type === 'heading')
        if (heading && heading.type === 'heading') {
          funnelName = heading.props.text.slice(0, 60)
        }
      }

      const baseSlug = funnelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'funnel'
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`

      // Save funnel
      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .insert({ name: funnelName, slug, user_id: user.id })
        .select()
        .single()

      if (funnelError) throw new Error(`Failed to create funnel: ${funnelError.message}`)

      // Save page
      const { error: pageError } = await supabase
        .from('pages')
        .insert({
          funnel_id: funnel.id,
          slug: 'main',
          title: 'Main Page',
          content: draftBlocks,
          settings: draftSettings,
          order: 0,
        })

      if (pageError) throw new Error(`Failed to save page: ${pageError.message}`)

      // Save chat messages with funnel_id
      const dbMessages = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          user_id: user.id,
          funnel_id: funnel.id,
          console_type: 'create',
          role: m.role,
          content: m.content,
        }))

      if (dbMessages.length > 0) {
        await supabase.from('chat_messages').insert(dbMessages)
      }

      router.push(`/dashboard/funnels/${funnel.id}/edit?tab=ai`)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to save'
      alert(errMsg)
      setSaving(false)
    }
  }

  // ── Canvas CSS vars ───────────────────────────────────────────
  const hasBlocks = draftBlocks.length > 0
  const tokens = resolveTokens(draftSettings)
  const canvasVars = tokens as unknown as React.CSSProperties
  const isDark = !draftSettings.theme.startsWith('light')

  // ── Render ────────────────────────────────────────────────────
  if (checkingApi) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/[0.06] border-t-[#39FF14]" />
      </div>
    )
  }

  if (isAuthenticated === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8 shadow-2xl text-center">
          <span className="text-4xl">⚡</span>
          <h2 className="mt-4 text-lg font-bold text-white">Sign in to create a funnel</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your funnel drafts are saved to your account. Sign in to start building.
          </p>
          <Link
            href="/login"
            className="mt-6 block w-full rounded-xl bg-[#39FF14] py-2.5 text-sm font-bold text-black transition hover:bg-[#39FF14]/80"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  if (showSetupGuide && !checkingApi) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-7 shadow-2xl">
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            <strong className="block text-white mb-1">Setup Required</strong>
            No AI API keys configured. Add <code className="text-red-300">DEEPSEEK_API_KEY</code> to your <code className="text-red-300">.env.local</code> file and restart.
          </div>
          <pre className="mb-4 rounded-lg border border-white/[0.06] bg-black p-3 text-xs text-green-400 font-mono overflow-x-auto">
            DEEPSEEK_API_KEY=your_key_here
          </pre>
          <Link
            href="/dashboard"
            className="block rounded-xl border border-white/[0.06] py-2.5 text-center text-sm text-gray-500 hover:text-white transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0a0a0a]/95 px-4 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-md px-2 py-1 text-[13px] text-white/40 hover:text-white transition"
          >
            ← Dashboard
          </Link>
          <span className="text-white/15">·</span>
          <span className="text-[13px] font-semibold text-white/80">New Funnel</span>
          {draftBlocks.length > 0 && (
            <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-white/40">
              {draftBlocks.length} blocks
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {ready && (
            <span className="text-[11px] text-green-400/80 font-medium">Ready to publish</span>
          )}
          <button
            onClick={handleOpenInEditor}
            disabled={saving || draftBlocks.length === 0}
            className="rounded-lg px-4 py-1.5 text-[13px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: ready ? (draftSettings.accentColor || '#39FF14') : 'rgba(255,255,255,0.08)',
              color: ready ? '#000' : 'rgba(255,255,255,0.6)',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : 'Open in Editor →'}
          </button>
        </div>
      </header>

      {/* ── BODY: Chat + Preview ────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: Chat panel ──────────────────────────────────── */}
        <div className="flex w-[440px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0a0a0a]">
          {/* Messages feed */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`max-w-[88%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-white/[0.08] border border-white/[0.08] text-white/90'
                    : msg.error
                    ? 'mr-auto border border-red-500/20 bg-red-500/[0.06] text-red-400'
                    : 'mr-auto border border-[#39FF14]/15 bg-[#39FF14]/[0.04] text-gray-200'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="mr-auto flex max-w-[85%] items-center gap-2 rounded-xl border border-[#39FF14]/8 bg-[#39FF14]/[0.02] px-4 py-2.5">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[#39FF14]"
                  style={{ animation: 'pulse 1.2s infinite ease-in-out' }}
                />
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[#39FF14]"
                  style={{ animation: 'pulse 1.2s 0.2s infinite ease-in-out' }}
                />
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[#39FF14]"
                  style={{ animation: 'pulse 1.2s 0.4s infinite ease-in-out' }}
                />
                <span className="ml-1 text-xs text-white/30">Thinking…</span>
                <style>{`
                  @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.3); }
                  }
                `}</style>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips (first interaction only) */}
          {messages.length === 1 && !loading && (
            <div className="border-t border-white/[0.05] px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-white/20">Try an example</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.prompt)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/50 transition hover:border-[#39FF14]/30 hover:text-[#39FF14]"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSend(prompt)
            }}
            className="flex gap-2 border-t border-white/[0.07] p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={loading ? 'Waiting for response…' : 'Type your message…'}
              disabled={loading}
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-[13px] text-white placeholder-white/25 outline-none transition focus:border-[#39FF14]/30 disabled:opacity-40"
              style={{ fontFamily: 'inherit' }}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#39FF14] text-sm font-bold text-black transition hover:bg-[#39FF14]/80 disabled:bg-white/[0.06] disabled:text-white/20"
            >
              →
            </button>
          </form>
        </div>

        {/* ── RIGHT: Live preview ───────────────────────────────── */}
        <main className="flex flex-1 items-start justify-center overflow-y-auto p-6">
          {!hasBlocks ? (
            <div className="flex flex-col items-center justify-center gap-3 pt-32 text-white/15">
              <span className="text-4xl">⚡</span>
              <p className="text-sm">Your funnel will appear here as we build it.</p>
              <p className="text-xs text-white/10">Start chatting to generate a preview.</p>
            </div>
          ) : (
            <PreviewErrorBoundary>
              <div
                className="w-full overflow-hidden rounded-lg transition-all"
                style={{
                  maxWidth: draftSettings.maxWidth || 1100,
                  boxShadow: isDark ? '0 4px 40px rgba(0,0,0,0.5)' : '0 4px 40px rgba(0,0,0,0.15)',
                  ...canvasVars,
                  fontFamily: `'${draftSettings.font}', system-ui, sans-serif`,
                }}
              >
                <div
                  style={{
                    background: draftSettings.bgColor || (isDark ? '#0a0a0a' : '#fff'),
                    position: 'relative',
                    minHeight: '400px',
                  }}
                >
                  <FunnelBackground background={draftSettings.background} accent={draftSettings.accentColor} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {draftBlocks.filter(b => !b.hidden).map(block => (
                      <div key={block.id} style={{ pointerEvents: 'none' }}>
                        <BlockRenderer block={block} settings={draftSettings} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PreviewErrorBoundary>
          )}
        </main>
      </div>
    </div>
  )
}
