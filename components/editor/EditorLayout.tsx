'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Block, BlockType, FormField, FunnelSettings } from '@/types/blocks'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { createClient } from '@/lib/supabase/client'
import { AiBuilderPanel } from './AiBuilderPanel'

// ─── Sidebar block definitions ────────────────────────────────────────────────

const ELEMENTS: { type: BlockType; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H1' },
  { type: 'text',    label: 'Text',    icon: 'T'  },
  { type: 'button',  label: 'Button',  icon: '→'  },
  { type: 'image',   label: 'Image',   icon: '⬜' },
  { type: 'form',    label: 'Form',    icon: '✉'  },
]

const SECTIONS: { type: BlockType; label: string; icon: string }[] = [
  { type: 'ic-hero',    label: 'Hero',    icon: '★' },
  { type: 'ic-ticker',  label: 'Ticker',  icon: '↔' },
  { type: 'ic-cards',   label: 'Cards',   icon: '▦' },
  { type: 'ic-results', label: 'Results', icon: '📸' },
  { type: 'ic-faq',     label: 'FAQ',     icon: '?' },
  { type: 'ic-apply',   label: 'Apply',   icon: '✉' },
  { type: 'ic-cta',     label: 'CTA',     icon: '↗' },
]

// ─── Default props per block type ────────────────────────────────────────────

const DEFAULT_PROPS: Record<BlockType, Block['props']> = {
  heading: { text: 'Your Headline Here' },
  text:    { text: 'Add your message here.' },
  button:  { label: 'Get Started', href: '#' },
  image:   { src: '', alt: '' },
  form:    { fields: ['email'] },
  'ic-hero': {
    badge: 'MAKE 2026 YOUR BIGGEST YEAR YET',
    headline: 'See How Regular People Are Building $5K-$30K/Month High-Ticket Reselling Businesses',
    subtext: 'The Exact System 200+ Members Use to Flip Authentic Products for Profit',
    ctaLabel: 'Apply For The Inner Circle ↗',
    ctaHref: '#apply',
  },
  'ic-ticker': {
    items: ['10+ Hours of Reselling Training', '200+ Inner Circle Members', 'High Ticket Vendor Access', 'OEM StockX Passing Vendors', '1-on-1 Onboarding Call', 'Weekly Group Meetings', 'Custom $10K/Month Action Plan'],
  },
  'ic-cards': {
    headline: 'My Exact 3-Step System to $10K/Month',
    cards: [
      { title: 'Source The Deals', desc: 'Access my private vendors for untapped products at wholesale prices.', bullets: ['OEM vendors that pass StockX authentication.', 'High-ticket items with guaranteed margins.', 'Skip the middlemen & source direct.'] },
      { title: 'Sell With Confidence', desc: '100% authentic OEM products — no replicas, no legal trouble, no bans.', bullets: ['Pass authentication on StockX & GOAT every time.', 'Zero customer complaints — happy buyers, easy sales.', 'Never worry about account bans or legal issues.'] },
      { title: 'Scale To $10K+/Month', desc: 'Get a custom action plan built for your situation.', bullets: ['1-on-1 onboarding call to map your path.', 'Weekly group calls — get your questions answered live.', 'Discord community with 200+ active members.'] },
    ],
    ctaLabel: 'Apply For The Inner Circle ↗',
    ctaHref: '#apply',
  },
  'ic-faq': {
    headline: 'Frequently Asked Questions',
    items: [
      { q: 'Are these vendors legit?', a: 'Yes. These are the same OEM vendors our Inner Circle members use to pass StockX and GOAT authentication every single time. 100% authentic products.' },
      { q: 'How fast can I start making money?', a: 'You can place your first order and list products the same day you get access. Many members make their first sale within the first week.' },
      { q: 'Do I need experience to start?', a: 'No experience needed. Our vendors and resources are beginner-friendly. Everything is explained step-by-step inside the community.' },
    ],
  },
  'ic-apply': {
    headline: 'Apply Now',
    subtext: 'Complete the application below to see if you qualify.',
  },
  'ic-cta': {
    label: 'Join The Inner Circle ↗',
    href: '#apply',
    subtext: 'Start your journey to $10K/month',
  },
  'ic-results': {
    headline: 'Real Results From Real Members',
    photos: [],
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Funnel = { id: string; name: string; slug: string; status: string }

// ─── EditorLayout ─────────────────────────────────────────────────────────────

export function EditorLayout({ pageId, initialBlocks, initialSettings, funnel }: {
  pageId: string
  initialBlocks: Block[]
  initialSettings: FunnelSettings
  funnel: Funnel
}) {
  const router = useRouter()
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [settings, setSettings] = useState<FunnelSettings>(initialSettings)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [status, setStatus] = useState(funnel.status)
  const [rightPanelTab, setRightPanelTab] = useState<'settings' | 'ai'>('settings')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedBlock = blocks.find(b => b.id === selectedId) ?? null
  const isDark = blocks.some(b => b.type.startsWith('ic-'))

  // ── Save ──────────────────────────────────────────────────────────────────

  const save = useCallback((updatedBlocks: Block[], updatedSettings?: FunnelSettings) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      const supabase = createClient()
      await supabase.from('pages').update({
        content: updatedBlocks,
        settings: updatedSettings ?? settings,
      }).eq('id', pageId)
      setSaving(false)
      setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 800)
  }, [pageId, settings])

  // ── Block ops ─────────────────────────────────────────────────────────────

  function addBlock(type: BlockType) {
    const block = { id: crypto.randomUUID(), type, props: DEFAULT_PROPS[type] } as Block
    const updated = [...blocks, block]
    setBlocks(updated)
    setSelectedId(block.id)
    save(updated)
  }

  function updateBlock(id: string, props: Block['props']) {
    const updated = blocks.map(b => b.id === id ? { ...b, props } as Block : b)
    setBlocks(updated)
    save(updated)
  }

  function deleteBlock(id: string) {
    const updated = blocks.filter(b => b.id !== id)
    setBlocks(updated)
    if (selectedId === id) setSelectedId(null)
    save(updated)
  }

  function moveBlock(id: string, dir: -1 | 1) {
    const idx = blocks.findIndex(b => b.id === id)
    const target = idx + dir
    if (target < 0 || target >= blocks.length) return
    const updated = [...blocks]
    ;[updated[idx], updated[target]] = [updated[target], updated[idx]]
    setBlocks(updated)
    save(updated)
  }

  function updateSettings(patch: Partial<FunnelSettings>) {
    const updated = { ...settings, ...patch }
    setSettings(updated)
    save(blocks, updated)
  }

  // ── Publish ───────────────────────────────────────────────────────────────

  async function togglePublish() {
    setPublishing(true)
    const supabase = createClient()
    const next = status === 'published' ? 'draft' : 'published'
    await supabase.from('funnels').update({ status: next }).eq('id', funnel.id)
    setStatus(next)
    setPublishing(false)
    router.refresh()
  }

  // ── Canvas CSS vars ───────────────────────────────────────────────────────

  const canvasVars = {
    '--accent': settings.accentColor,
    '--accent-glow': settings.accentColor + '47',
    '--text': settings.textColor,
    '--bg': settings.bgColor,
  } as React.CSSProperties

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden' }}>

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header style={{ height: '48px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,10,10,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', padding: '4px 8px', borderRadius: '6px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
            ← Dashboard
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{funnel.name}</span>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: status === 'published' ? 'rgba(57,255,20,0.12)' : 'rgba(255,255,255,0.06)', color: status === 'published' ? '#39FF14' : 'rgba(255,255,255,0.4)', border: `1px solid ${status === 'published' ? 'rgba(57,255,20,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
            {status}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            {saving ? 'Saving…' : savedAt ? `Saved ${savedAt}` : ''}
          </span>
          {status === 'published' && (
            <a href={`/f/${funnel.slug}`} target="_blank" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              View live ↗
            </a>
          )}
          <button onClick={togglePublish} disabled={publishing} style={{ fontSize: '13px', fontWeight: 700, padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: publishing ? 'not-allowed' : 'pointer', opacity: publishing ? 0.6 : 1, background: status === 'published' ? 'rgba(255,255,255,0.08)' : '#39FF14', color: status === 'published' ? '#fff' : '#000' }}>
            {publishing ? '…' : status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR ────────────────────────────────────────── */}
        <aside style={{ width: '220px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: '#111', overflowY: 'auto', padding: '16px 12px' }}>

          <SidebarGroup label="Sections" items={SECTIONS} onAdd={addBlock} />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
          <SidebarGroup label="Elements" items={ELEMENTS} onAdd={addBlock} />

          {blocks.length > 0 && (
            <>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '10px', paddingLeft: '4px' }}>Layers</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {blocks.map((block, i) => (
                  <button key={block.id} onClick={() => setSelectedId(block.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '6px', border: `1px solid ${selectedId === block.id ? 'rgba(57,255,20,0.3)' : 'transparent'}`, background: selectedId === block.id ? 'rgba(57,255,20,0.07)' : 'transparent', color: selectedId === block.id ? '#39FF14' : 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', width: '14px', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{block.type.replace('ic-', '')}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* ── CANVAS ──────────────────────────────────────────────── */}
        <main
          style={{ flex: 1, overflowY: 'auto', background: isDark ? '#0a0a0a' : '#1a1a1a', padding: isDark ? '0' : '32px 24px', display: 'flex', justifyContent: 'center' }}
          onClick={() => setSelectedId(null)}
        >
          <div style={{ width: '100%', maxWidth: isDark ? '100%' : '680px', ...canvasVars }}>
            {blocks.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', height: '100%', color: 'rgba(255,255,255,0.25)', fontSize: '14px', gap: '8px', padding: '80px 24px' }}>
                <span style={{ fontSize: '28px' }}>⚡</span>
                <span>Add a section from the left sidebar</span>
              </div>
            ) : isDark ? (
              <div style={{ background: settings.bgColor, fontFamily: `'${settings.font}', system-ui, sans-serif` }}>
                {blocks.map((block, i) => (
                  <CanvasBlock key={block.id} block={block} index={i} total={blocks.length} selected={selectedId === block.id} onSelect={() => setSelectedId(block.id)} onMove={(dir) => moveBlock(block.id, dir)} onDelete={() => deleteBlock(block.id)} settings={settings} />
                ))}
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 40px rgba(0,0,0,0.4)', minHeight: '500px', fontFamily: `'${settings.font}', system-ui, sans-serif` }}>
                {blocks.map((block, i) => (
                  <CanvasBlock key={block.id} block={block} index={i} total={blocks.length} selected={selectedId === block.id} onSelect={() => setSelectedId(block.id)} onMove={(dir) => moveBlock(block.id, dir)} onDelete={() => deleteBlock(block.id)} settings={settings} />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ── PROPERTIES PANEL ────────────────────────────────────── */}
        <aside style={{ width: '260px', flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#111', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Tabs header */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
            <button
              onClick={() => setRightPanelTab('settings')}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: rightPanelTab === 'settings' ? '#39FF14' : 'rgba(255,255,255,0.4)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '14px 0',
                borderBottom: rightPanelTab === 'settings' ? '2px solid #39FF14' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {selectedBlock ? 'Properties' : 'Settings'}
            </button>
            <button
              onClick={() => setRightPanelTab('ai')}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: rightPanelTab === 'ai' ? '#39FF14' : 'rgba(255,255,255,0.4)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '14px 0',
                borderBottom: rightPanelTab === 'ai' ? '2px solid #39FF14' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              ✦ AI Builder
            </button>
          </div>

          {/* Panel body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
            {rightPanelTab === 'settings' ? (
              !selectedBlock ? (
                <GlobalSettingsPanel settings={settings} onChange={updateSettings} />
              ) : (
                <PropertiesPanel
                  block={selectedBlock}
                  onChange={(props) => updateBlock(selectedBlock.id, props)}
                />
              )
            ) : (
              <AiBuilderPanel
                funnelId={funnel.id}
                blocks={blocks}
                settings={settings}
                onUpdatePage={(newBlocks, newSettings) => {
                  setBlocks(newBlocks)
                  if (newSettings) setSettings(newSettings)
                  save(newBlocks, newSettings)
                }}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

// ─── Sidebar group ────────────────────────────────────────────────────────────

function SidebarGroup({ label, items, onAdd }: { label: string; items: { type: BlockType; label: string; icon: string }[]; onAdd: (type: BlockType) => void }) {
  return (
    <>
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '10px', paddingLeft: '4px' }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '4px' }}>
        {items.map(({ type, label: lbl, icon }) => (
          <button key={type} onClick={() => onAdd(type)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '7px', border: '1px solid transparent', background: 'transparent', color: 'rgba(255,255,255,0.65)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'left', width: '100%' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)' }}>
            <span style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0, color: 'rgba(255,255,255,0.5)' }}>
              {icon}
            </span>
            {lbl}
          </button>
        ))}
      </div>
    </>
  )
}

// ─── Canvas block wrapper ─────────────────────────────────────────────────────

function CanvasBlock({ block, index, total, selected, onSelect, onMove, onDelete, settings }: {
  block: Block; index: number; total: number; selected: boolean
  onSelect: () => void; onMove: (dir: -1 | 1) => void; onDelete: () => void
  settings: FunnelSettings
}) {
  const [hovered, setHovered] = useState(false)
  const isSection = block.type.startsWith('ic-')

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', outline: selected ? '2px solid #39FF14' : hovered ? '2px solid rgba(57,255,20,0.35)' : '2px solid transparent', outlineOffset: '-2px', transition: 'outline 0.1s', cursor: 'pointer' }}
    >
      {(hovered || selected) && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 10 }}>
          <CtrlBtn onClick={() => onMove(-1)} disabled={index === 0} label="↑" />
          <CtrlBtn onClick={() => onMove(1)} disabled={index === total - 1} label="↓" />
          <CtrlBtn onClick={onDelete} label="✕" danger />
        </div>
      )}
      <div style={isSection ? {} : { padding: '16px 24px', pointerEvents: 'none' }}>
        <BlockRenderer block={block} settings={settings} />
      </div>
    </div>
  )
}

function CtrlBtn({ onClick, disabled, label, danger }: { onClick: () => void; disabled?: boolean; label: string; danger?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${danger ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.2)'}`, background: danger ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.7)', color: danger ? '#ef4444' : '#fff', fontSize: '11px', fontWeight: 700, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      {label}
    </button>
  )
}

// ─── Global Settings Panel ────────────────────────────────────────────────────

const FONTS = ['Inter', 'Satoshi', 'DM Sans', 'Poppins', 'Plus Jakarta Sans', 'Space Grotesk', 'Montserrat']

function GlobalSettingsPanel({ settings, onChange }: { settings: FunnelSettings; onChange: (patch: Partial<FunnelSettings>) => void }) {
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', padding: '7px 10px', fontSize: '13px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const label = (text: string) => <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '6px' }}>{text}</span>
  const wrap = (content: React.ReactNode) => <div style={{ marginBottom: '14px' }}>{content}</div>
  const section = (title: string) => <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '18px 0 10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>{title}</p>

  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Site Settings</p>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }}>Click a block to edit it, or configure global settings here.</p>

      {/* Colors */}
      {section('Colors')}
      {wrap(<>
        {label('Accent color')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={settings.accentColor} onChange={e => onChange({ accentColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }} />
          <input type="text" value={settings.accentColor} onChange={e => onChange({ accentColor: e.target.value })} style={{ ...inp, flex: 1 }} />
        </div>
      </>)}
      {wrap(<>
        {label('Background')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={settings.bgColor} onChange={e => onChange({ bgColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }} />
          <input type="text" value={settings.bgColor} onChange={e => onChange({ bgColor: e.target.value })} style={{ ...inp, flex: 1 }} />
        </div>
      </>)}
      {wrap(<>
        {label('Text color')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={settings.textColor} onChange={e => onChange({ textColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }} />
          <input type="text" value={settings.textColor} onChange={e => onChange({ textColor: e.target.value })} style={{ ...inp, flex: 1 }} />
        </div>
      </>)}

      {/* Typography */}
      {section('Typography')}
      {wrap(<>
        {label('Font family')}
        <select value={settings.font} onChange={e => onChange({ font: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </>)}

      {/* Ticker */}
      {section('Ticker & Scroll')}
      {wrap(<>
        {label(`Scroll speed — ${settings.tickerSpeed}s`)}
        <input type="range" min={8} max={80} value={settings.tickerSpeed} onChange={e => onChange({ tickerSpeed: Number(e.target.value) })} style={{ width: '100%', accentColor: '#39FF14', cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>
          <span>Fast</span><span>Slow</span>
        </div>
      </>)}

      {/* Page */}
      {section('Page')}
      {wrap(<>{label('Page title')}<input type="text" value={settings.pageTitle} onChange={e => onChange({ pageTitle: e.target.value })} placeholder="My Funnel" style={inp} /></>)}
      {wrap(<>{label('Favicon URL')}<input type="text" value={settings.faviconUrl} onChange={e => onChange({ faviconUrl: e.target.value })} placeholder="https://..." style={inp} /></>)}
    </div>
  )
}

// ─── Properties Panel ─────────────────────────────────────────────────────────

function PropertiesPanel({ block, onChange }: { block: Block; onChange: (props: Block['props']) => void }) {
  const label = (text: string) => <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '6px' }}>{text}</span>
  const wrap = (content: React.ReactNode) => <div style={{ marginBottom: '14px' }}>{content}</div>
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', padding: '7px 10px', fontSize: '13px', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
  const ta: React.CSSProperties = { ...inp, resize: 'vertical' as const }

  const typeLabel = block.type.replace('ic-', '').replace('-', ' ')
  const titleCased = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)

  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>{titleCased} Settings</p>

      {/* ── Simple elements ──────────────────────────────────────── */}

      {block.type === 'heading' && wrap(<>{label('Text')}<textarea value={block.props.text} onChange={e => onChange({ ...block.props, text: e.target.value })} rows={3} style={ta} /></>)}

      {block.type === 'text' && wrap(<>{label('Text')}<textarea value={block.props.text} onChange={e => onChange({ ...block.props, text: e.target.value })} rows={5} style={ta} /></>)}

      {block.type === 'button' && <>
        {wrap(<>{label('Label')}<input type="text" value={block.props.label} onChange={e => onChange({ ...block.props, label: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('URL')}<input type="text" value={block.props.href} onChange={e => onChange({ ...block.props, href: e.target.value })} placeholder="https://..." style={inp} /></>)}
      </>}

      {block.type === 'image' && <>
        {wrap(<>{label('Image URL')}<input type="text" value={block.props.src} onChange={e => onChange({ ...block.props, src: e.target.value })} placeholder="https://..." style={inp} /></>)}
        {wrap(<>{label('Alt text')}<input type="text" value={block.props.alt} onChange={e => onChange({ ...block.props, alt: e.target.value })} style={inp} /></>)}
      </>}

      {block.type === 'form' && wrap(<>{label('Fields')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(['email', 'name', 'phone'] as FormField[]).map(f => (
            <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
              <input type="checkbox" checked={block.props.fields.includes(f)} onChange={e => { const fields = e.target.checked ? [...block.props.fields, f] : block.props.fields.filter(x => x !== f); onChange({ ...block.props, fields }) }} style={{ accentColor: '#39FF14' }} />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
          ))}
        </div>
      </>)}

      {/* ── Section blocks ───────────────────────────────────────── */}

      {block.type === 'ic-hero' && <>
        {wrap(<>{label('Badge')}<input type="text" value={block.props.badge} onChange={e => onChange({ ...block.props, badge: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('Headline')}<textarea value={block.props.headline} onChange={e => onChange({ ...block.props, headline: e.target.value })} rows={4} style={ta} /></>)}
        {wrap(<>{label('Subtext')}<textarea value={block.props.subtext} onChange={e => onChange({ ...block.props, subtext: e.target.value })} rows={3} style={ta} /></>)}
        {wrap(<>{label('CTA Label')}<input type="text" value={block.props.ctaLabel} onChange={e => onChange({ ...block.props, ctaLabel: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('CTA URL')}<input type="text" value={block.props.ctaHref} onChange={e => onChange({ ...block.props, ctaHref: e.target.value })} style={inp} /></>)}
      </>}

      {block.type === 'ic-ticker' && wrap(<>{label('Items (one per line)')}
        <textarea
          value={block.props.items.join('\n')}
          onChange={e => onChange({ ...block.props, items: e.target.value.split('\n').filter(Boolean) })}
          rows={8}
          style={ta}
        />
      </>)}

      {block.type === 'ic-cards' && <>
        {wrap(<>{label('Section Headline')}<textarea value={block.props.headline} onChange={e => onChange({ ...block.props, headline: e.target.value })} rows={2} style={ta} /></>)}
        {block.props.cards.map((card, i) => (
          <div key={i} style={{ marginBottom: '14px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Card {i + 1}</p>
            {wrap(<>{label('Title')}<input type="text" value={card.title} onChange={e => { const cards = [...block.props.cards]; cards[i] = { ...cards[i], title: e.target.value }; onChange({ ...block.props, cards }) }} style={inp} /></>)}
            {wrap(<>{label('Description')}<textarea value={card.desc} onChange={e => { const cards = [...block.props.cards]; cards[i] = { ...cards[i], desc: e.target.value }; onChange({ ...block.props, cards }) }} rows={2} style={ta} /></>)}
          </div>
        ))}
        {wrap(<>{label('CTA Label')}<input type="text" value={block.props.ctaLabel} onChange={e => onChange({ ...block.props, ctaLabel: e.target.value })} style={inp} /></>)}
      </>}

      {block.type === 'ic-faq' && <>
        {wrap(<>{label('Headline')}<input type="text" value={block.props.headline} onChange={e => onChange({ ...block.props, headline: e.target.value })} style={inp} /></>)}
        {block.props.items.map((item, i) => (
          <div key={i} style={{ marginBottom: '12px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Q{i + 1}</p>
            {wrap(<>{label('Question')}<input type="text" value={item.q} onChange={e => { const items = [...block.props.items]; items[i] = { ...items[i], q: e.target.value }; onChange({ ...block.props, items }) }} style={inp} /></>)}
            {wrap(<>{label('Answer')}<textarea value={item.a} onChange={e => { const items = [...block.props.items]; items[i] = { ...items[i], a: e.target.value }; onChange({ ...block.props, items }) }} rows={3} style={ta} /></>)}
          </div>
        ))}
        <button onClick={() => onChange({ ...block.props, items: [...block.props.items, { q: 'New question', a: 'Answer here.' }] })} style={{ width: '100%', padding: '8px', borderRadius: '7px', border: '1px dashed rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer' }}>
          + Add question
        </button>
      </>}

      {block.type === 'ic-apply' && <>
        {wrap(<>{label('Headline')}<input type="text" value={block.props.headline} onChange={e => onChange({ ...block.props, headline: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('Subtext')}<textarea value={block.props.subtext} onChange={e => onChange({ ...block.props, subtext: e.target.value })} rows={2} style={ta} /></>)}
      </>}

      {block.type === 'ic-cta' && <>
        {wrap(<>{label('Button Label')}<input type="text" value={block.props.label} onChange={e => onChange({ ...block.props, label: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('URL')}<input type="text" value={block.props.href} onChange={e => onChange({ ...block.props, href: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('Subtext')}<input type="text" value={block.props.subtext} onChange={e => onChange({ ...block.props, subtext: e.target.value })} style={inp} /></>)}
      </>}

      {block.type === 'ic-results' && <>
        {wrap(<>{label('Headline')}<input type="text" value={block.props.headline} onChange={e => onChange({ ...block.props, headline: e.target.value })} style={inp} /></>)}
        {wrap(<>
          {label('Photo URLs (one per line)')}
          <textarea
            value={block.props.photos.join('\n')}
            onChange={e => onChange({ ...block.props, photos: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
            rows={10}
            placeholder={'https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg'}
            style={ta}
          />
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '6px' }}>Paste image URLs, one per line. Use the &ldquo;scroll speed&rdquo; in Site Settings to control animation speed.</p>
        </>)}
      </>}
    </div>
  )
}
