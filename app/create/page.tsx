'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Block, FunnelSettings, ThemeId } from '@/types/blocks'
import { DEFAULT_SETTINGS } from '@/types/blocks'
import { makeBaseFunnel } from '@/lib/templates'
import { THEME_PRESETS, resolveTokens } from '@/lib/themes'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { FunnelBackground } from '@/components/funnel/FunnelBackground'
import { PreviewErrorBoundary } from '@/components/PreviewErrorBoundary'

// ═══════════════════════════════════════════
// COLOR SWATCHES
// ═══════════════════════════════════════════
const COLOR_SWATCHES = [
  { label: 'Green', hex: '#39FF14' },
  { label: 'Blue', hex: '#3B82F6' },
  { label: 'White', hex: '#FFFFFF' },
  { label: 'Black', hex: '#111111' },
  { label: 'Pink', hex: '#EC4899' },
  { label: 'Purple', hex: '#A855F7' },
  { label: 'Orange', hex: '#FF4500' },
]

const STEPS = ['Base', 'Style', 'Colors'] as const
type Step = (typeof STEPS)[number]

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════
export default function CreatePage() {
  const router = useRouter()

  // ── Funnel state (always valid — starts from makeBaseFunnel) ──
  const [blocks] = useState<Block[]>(() => makeBaseFunnel().blocks)
  const [settings, setSettings] = useState<FunnelSettings>(() => makeBaseFunnel().settings)

  // ── Wizard state ───────────────────────────────────
  const [step, setStep] = useState<Step>('Base')
  const [saving, setSaving] = useState(false)

  // ── Auth + API check ───────────────────────────────
  const [checking, setChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  useEffect(() => {
    async function check() {
      setChecking(true)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsAuthenticated(false)
          setChecking(false)
          return
        }
        setIsAuthenticated(true)

        // Check /api/ai (editor endpoint) instead of chat-create
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blocks: [], settings: DEFAULT_SETTINGS, prompt: 'API_KEY_CHECK' }),
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
        setChecking(false)
      }
    }
    check()
  }, [])

  // ── Settings updaters ──────────────────────────────
  function setTheme(theme: ThemeId) {
    setSettings(prev => ({ ...prev, theme, accentColor: '', bgColor: '', textColor: '' }))
  }

  function setAccentColor(hex: string) {
    setSettings(prev => ({ ...prev, accentColor: hex }))
  }

  function setBgColor(hex: string) {
    setSettings(prev => ({ ...prev, bgColor: hex }))
  }

  function setTextColor(hex: string) {
    setSettings(prev => ({ ...prev, textColor: hex }))
  }

  function resetColors() {
    setSettings(prev => ({ ...prev, accentColor: '', bgColor: '', textColor: '' }))
  }

  // ── Persist + redirect ─────────────────────────────
  async function handleOpenInEditor() {
    if (saving) return
    setSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const hero = blocks.find(b => b.type === 'ic-hero')
      const funnelName = hero && hero.type === 'ic-hero'
        ? hero.props.headline.slice(0, 60)
        : 'My Funnel'

      const baseSlug = funnelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'funnel'
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`

      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .insert({ name: funnelName, slug, user_id: user.id })
        .select()
        .single()

      if (funnelError) throw new Error(funnelError.message)

      const { error: pageError } = await supabase
        .from('pages')
        .insert({
          funnel_id: funnel.id,
          slug: 'main',
          title: 'Main Page',
          content: blocks,
          settings,
          order: 0,
        })

      if (pageError) throw new Error(pageError.message)

      router.push(`/dashboard/funnels/${funnel.id}/edit?tab=ai`)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to save'
      alert(errMsg)
      setSaving(false)
    }
  }

  // ── Preview vars ───────────────────────────────────
  const tokens = resolveTokens(settings) as unknown as React.CSSProperties
  const isDark = !settings.theme.startsWith('light')
  const themePreset = THEME_PRESETS[settings.theme]
  const hasColorOverrides = !!(settings.accentColor || settings.bgColor || settings.textColor)
  const currentStepIdx = STEPS.indexOf(step)

  // ── States ────────────────────────────────────────
  if (checking) {
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

  if (showSetupGuide) {
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
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-white/40">
            {blocks.length} blocks
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenInEditor}
            disabled={saving}
            className="rounded-lg px-4 py-1.5 text-[13px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: settings.accentColor || themePreset.cssVars['--accent'],
              color: isDark ? '#000' : '#fff',
            }}
          >
            {saving ? 'Saving…' : 'Open in Editor →'}
          </button>
        </div>
      </header>

      {/* ── BODY: Panel + Preview ────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: Wizard panel ─────────────────────────────────── */}
        <div className="flex w-[380px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0a0a0a] overflow-y-auto">
          {/* Step indicator */}
          <div className="flex items-center gap-1 px-4 py-3 border-b border-white/[0.05]">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <button
                  onClick={() => setStep(s)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    s === step
                      ? 'bg-white/[0.12] text-white'
                      : i < currentStepIdx
                      ? 'text-white/40 hover:text-white/70'
                      : 'text-white/25'
                  }`}
                >
                  {i + 1}. {s}
                </button>
                {i < STEPS.length - 1 && <span className="text-white/10 text-[10px]">→</span>}
              </div>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {/* ── Step 1: Base ──────────────────────────────────── */}
            {step === 'Base' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-[#39FF14]/20 bg-[#39FF14]/[0.03] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⚡</span>
                    <span className="text-sm font-bold text-white">Base Template</span>
                    <span className="rounded-full border border-[#39FF14]/20 px-2 py-0.5 text-[9px] font-bold text-[#39FF14] uppercase tracking-[0.5px]">Selected</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    6 sections: Hero → Ticker → Cards → Results → FAQ → CTA. All copy is placeholder — you&apos;ll customize it in the editor with AI chat.
                  </p>
                </div>

                <button
                  onClick={() => setStep('Style')}
                  className="w-full rounded-xl py-2.5 text-[13px] font-bold transition"
                  style={{
                    background: settings.accentColor || themePreset.cssVars['--accent'],
                    color: isDark ? '#000' : '#fff',
                  }}
                >
                  Next: Choose Style →
                </button>
              </div>
            )}

            {/* ── Step 2: Style ─────────────────────────────────── */}
            {step === 'Style' && (
              <div className="space-y-3">
                <p className="text-xs text-white/40">Pick a theme — the preview updates instantly.</p>

                <div className="grid grid-cols-2 gap-2">
                  {(Object.values(THEME_PRESETS) as { id: ThemeId; name: string; cssVars: Record<string, string> }[]).map(preset => {
                    const active = settings.theme === preset.id
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setTheme(preset.id as ThemeId)}
                        className={`rounded-xl border p-3 text-left transition ${
                          active
                            ? 'border-white/25 bg-white/[0.06]'
                            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15'
                        }`}
                      >
                        {/* Color dots */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="inline-block h-3 w-3 rounded-full ring-1 ring-white/10"
                            style={{ background: preset.cssVars['--bg'] }}
                          />
                          <span
                            className="inline-block h-3 w-3 rounded-full ring-1 ring-white/10"
                            style={{ background: preset.cssVars['--accent'] }}
                          />
                          <span
                            className="inline-block h-3 w-3 rounded-full ring-1 ring-white/10"
                            style={{ background: preset.cssVars['--text'] }}
                          />
                        </div>
                        <span className="text-[12px] font-semibold text-white/80">{preset.name}</span>
                        {active && (
                          <span className="ml-1.5 text-[10px] text-white/40">✓</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep('Base')}
                    className="flex-1 rounded-xl border border-white/[0.08] py-2 text-[12px] text-white/40 hover:text-white/70 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep('Colors')}
                    className="flex-1 rounded-xl py-2 text-[12px] font-bold transition"
                    style={{
                      background: settings.accentColor || themePreset.cssVars['--accent'],
                      color: isDark ? '#000' : '#fff',
                    }}
                  >
                    Next: Colors →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Colors ─────────────────────────────────── */}
            {step === 'Colors' && (
              <div className="space-y-4">
                <p className="text-xs text-white/40">Override theme colors — all optional. Preview updates live.</p>

                {/* Accent */}
                <div>
                  <label className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.5px]">Accent Color</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      placeholder={themePreset.cssVars['--accent']}
                      className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[12px] text-white placeholder-white/25 outline-none focus:border-white/20 font-mono"
                    />
                    <input
                      type="color"
                      value={settings.accentColor || themePreset.cssVars['--accent']}
                      onChange={e => setAccentColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {COLOR_SWATCHES.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => setAccentColor(c.hex)}
                        className="h-5 w-5 rounded-full border border-white/10 transition hover:scale-110"
                        style={{ background: c.hex }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Background */}
                <div>
                  <label className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.5px]">Background Color</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.bgColor}
                      onChange={e => setBgColor(e.target.value)}
                      placeholder={themePreset.cssVars['--bg']}
                      className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[12px] text-white placeholder-white/25 outline-none focus:border-white/20 font-mono"
                    />
                    <input
                      type="color"
                      value={settings.bgColor || themePreset.cssVars['--bg']}
                      onChange={e => setBgColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                    />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <label className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.5px]">Text Color</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.textColor}
                      onChange={e => setTextColor(e.target.value)}
                      placeholder={themePreset.cssVars['--text']}
                      className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[12px] text-white placeholder-white/25 outline-none focus:border-white/20 font-mono"
                    />
                    <input
                      type="color"
                      value={settings.textColor || themePreset.cssVars['--text']}
                      onChange={e => setTextColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                    />
                  </div>
                </div>

                {/* Reset */}
                {hasColorOverrides && (
                  <button
                    onClick={resetColors}
                    className="text-[11px] text-white/30 hover:text-white/60 underline transition"
                  >
                    Reset to theme defaults
                  </button>
                )}

                {/* Nav */}
                <div className="flex gap-2 pt-2 border-t border-white/[0.05]">
                  <button
                    onClick={() => setStep('Style')}
                    className="flex-1 rounded-xl border border-white/[0.08] py-2 text-[12px] text-white/40 hover:text-white/70 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleOpenInEditor}
                    disabled={saving}
                    className="flex-[2] rounded-xl py-2 text-[12px] font-bold transition disabled:opacity-30"
                    style={{
                      background: settings.accentColor || themePreset.cssVars['--accent'],
                      color: isDark ? '#000' : '#fff',
                    }}
                  >
                    {saving ? 'Saving…' : 'Open in Editor →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Live preview ───────────────────────────────── */}
        <main className="flex flex-1 items-start justify-center overflow-y-auto p-6">
          <PreviewErrorBoundary>
            <div
              className="w-full overflow-hidden rounded-lg transition-all duration-300"
              style={{
                maxWidth: settings.maxWidth || 1100,
                boxShadow: isDark
                  ? '0 4px 40px rgba(0,0,0,0.5)'
                  : '0 4px 40px rgba(0,0,0,0.15)',
                ...tokens,
                fontFamily: `'${settings.font}', system-ui, sans-serif`,
              }}
            >
              <div
                style={{
                  background: settings.bgColor || (isDark ? '#0a0a0a' : '#fff'),
                  position: 'relative',
                  minHeight: '400px',
                }}
              >
                <FunnelBackground background={settings.background} accent={settings.accentColor} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {blocks.filter(b => !b.hidden).map(block => (
                    <div key={block.id} style={{ pointerEvents: 'none' }}>
                      <BlockRenderer block={block} settings={settings} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PreviewErrorBoundary>
        </main>
      </div>
    </div>
  )
}
