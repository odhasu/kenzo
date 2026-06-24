'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { Block, BlockType, FormField, FunnelSettings, ThemeId, BackgroundId, BlockStyle, ButtonStyle } from '@/types/blocks'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { createClient } from '@/lib/supabase/client'
import { publishFunnel } from '@/lib/actions'
import { AiBuilderPanel } from './AiBuilderPanel'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import { resolveTokens, THEME_PRESETS } from '@/lib/themes'
import { FunnelBackground } from '@/components/funnel/FunnelBackground'
import { DEFAULT_PROPS } from '@/lib/templates'

// ─── Block type definitions ──────────────────────────────────────────────────

const SECTION_TYPES: { type: BlockType; label: string; icon: string }[] = [
  { type: 'ic-hero',    label: 'Hero',    icon: '★' },
  { type: 'ic-ticker',  label: 'Ticker',  icon: '↔' },
  { type: 'ic-cards',   label: 'Cards',   icon: '▦' },
  { type: 'ic-results', label: 'Results', icon: '📸' },
  { type: 'ic-faq',     label: 'FAQ',     icon: '?' },
  { type: 'ic-apply',   label: 'Apply',   icon: '✉' },
  { type: 'ic-cta',     label: 'CTA',     icon: '↗' },
]

const ELEMENT_TYPES: { type: BlockType; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H1' },
  { type: 'text',    label: 'Text',    icon: 'T'  },
  { type: 'button',  label: 'Button',  icon: '→'  },
  { type: 'image',   label: 'Image',   icon: '⬜' },
  { type: 'form',    label: 'Form',    icon: '✉'  },
]

// ─── Types ───────────────────────────────────────────────────────────────────

type Funnel = { id: string; name: string; slug: string; status: string }

// ─── EditorLayout ────────────────────────────────────────────────────────────

export function EditorLayout({ pageId, initialBlocks, initialSettings, funnel }: {
  pageId: string
  initialBlocks: Block[]
  initialSettings: FunnelSettings
  funnel: Funnel
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [settings, setSettings] = useState<FunnelSettings>(initialSettings)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [status, setStatus] = useState(funnel.status)
  const [copied, setCopied] = useState(false)
  const [hasUnsaved, setHasUnsaved] = useState(false)
  const [rightTab, setRightTab] = useState<'sections' | 'theme'>('sections')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Undo stack for AI edits ─────────────────────────────────────────────
  const [undoStack, setUndoStack] = useState<{ blocks: Block[]; settings: FunnelSettings }[]>([])
  const [canUndo, setCanUndo] = useState(false)

  const selectedBlock = blocks.find(b => b.id === selectedId) ?? null
  const isDark = !settings.theme.startsWith('light')

  // ── Save ──────────────────────────────────────────────────────────────────

  const save = useCallback((updatedBlocks: Block[], updatedSettings?: FunnelSettings) => {
    setHasUnsaved(true)
    setSavedAt(null)
    setSaveError(null)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try {
        const supabase = createClient()
        const payload: Record<string, unknown> = { content: updatedBlocks }
        if (updatedSettings !== undefined) payload.settings = updatedSettings
        const { error } = await supabase.from('pages').update(payload).eq('id', pageId)
        if (error) throw error
        setSaveError(null)
        setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        setHasUnsaved(false)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Save failed'
        setSaveError(msg)
        setTimeout(async () => {
          try {
            const supabase = createClient()
            const payload: Record<string, unknown> = { content: updatedBlocks }
            if (updatedSettings !== undefined) payload.settings = updatedSettings
            const { error } = await supabase.from('pages').update(payload).eq('id', pageId)
            if (error) throw error
            setSaveError(null)
            setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            setHasUnsaved(false)
          } catch (retryErr: unknown) {
            setSaveError(`Save failed — ${retryErr instanceof Error ? retryErr.message : 'Save failed after retry'}`)
          }
        }, 1500)
      } finally {
        setSaving(false)
      }
    }, 800)
  }, [pageId])

  function forceSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSavedAt(null)
    setSaveError(null)
    setSaving(true)
    const currentBlocks = blocks
    const currentSettings = settings
    const doSave = async () => {
      try {
        const supabase = createClient()
        const payload: Record<string, unknown> = { content: currentBlocks, settings: currentSettings }
        const { error } = await supabase.from('pages').update(payload).eq('id', pageId)
        if (error) throw error
        setSaveError(null)
        setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        setHasUnsaved(false)
      } catch (err: unknown) {
        setSaveError(err instanceof Error ? err.message : 'Save failed')
      } finally {
        setSaving(false)
      }
    }
    doSave()
  }

  // ── Block ops ─────────────────────────────────────────────────────────────

  function sanitizeBlock(block: Block): Block {
    const defaults = DEFAULT_PROPS[block.type]
    if (!defaults) return block
    const safeProps = { ...defaults, ...block.props }
    return { ...block, props: safeProps } as Block
  }

  function addBlock(type: BlockType) {
    const defaults = DEFAULT_PROPS[type]
    if (!defaults) return
    const block = sanitizeBlock({ id: crypto.randomUUID(), type, props: { ...defaults } } as Block)
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

  function updateBlockStyle(id: string, style: BlockStyle) {
    const updated = blocks.map(b => b.id === id ? { ...b, style } as Block : b)
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

  function moveBlockTo(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length || toIndex >= blocks.length) return
    const updated = [...blocks]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setBlocks(updated)
    save(updated)
  }

  function duplicateBlock(id: string) {
    const idx = blocks.findIndex(b => b.id === id)
    if (idx === -1) return
    const source = blocks[idx]
    const cloned: Block = { id: crypto.randomUUID(), type: source.type, props: JSON.parse(JSON.stringify(source.props)), hidden: source.hidden, style: source.style ? { ...source.style } : undefined }
    const updated = [...blocks.slice(0, idx + 1), cloned, ...blocks.slice(idx + 1)]
    setBlocks(updated)
    setSelectedId(cloned.id)
    save(updated)
  }

  function toggleBlockHidden(id: string) {
    const updated = blocks.map(b => b.id === id ? { ...b, hidden: !b.hidden } as Block : b)
    setBlocks(updated)
    save(updated)
  }

  // ── Drag and drop ─────────────────────────────────────────────────────────

  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragIndex(idx)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent, toIdx: number) {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== toIdx) {
      moveBlockTo(dragIndex, toIdx)
    }
    setDragIndex(null)
  }

  function handleDragEnd() {
    setDragIndex(null)
  }

  // ── Undo ────────────────────────────────────────────────────────────────

  function undoLastAIEdit() {
    if (undoStack.length === 0) return
    const snapshot = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setCanUndo(undoStack.length > 1)
    setBlocks(snapshot.blocks)
    setSettings(snapshot.settings)
    save(snapshot.blocks, snapshot.settings)
  }

  const visibleBlocks = blocks.filter(b => !b.hidden)

  function updateSettings(patch: Partial<FunnelSettings>) {
    const updated = { ...settings, ...patch }
    setSettings(updated)
    save(blocks, updated)
  }

  function handleBlockClick(blockId: string) {
    setSelectedId(blockId)
    setRightTab('sections') // ensure we're on sections tab to see settings
  }

  // ── Publish ───────────────────────────────────────────────────────────────

  async function togglePublish() {
    setPublishing(true)
    setPublishError(null)
    try {
      const next = status === 'published' ? 'draft' : 'published'
      const result = await publishFunnel(funnel.id, funnel.slug, next)
      setStatus(result.status)
    } catch (err: unknown) {
      setPublishError(err instanceof Error ? err.message : 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  function copyLiveUrl() {
    const url = `${window.location.origin}/f/${funnel.slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Canvas CSS vars ───────────────────────────────────────────────────────

  const canvasTokens = resolveTokens(settings)
  const canvasVars = canvasTokens as unknown as React.CSSProperties

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1a1a1a', color: '#ffe', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden' }}>

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header style={{
        minHeight: '48px', borderBottom: '1px solid #ffffee14',
        background: '#1a1a1a', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, zIndex: 20,
        flexWrap: 'wrap', gap: '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard" style={{
            fontSize: '13px', color: '#ffffeea6', textDecoration: 'none',
            padding: '4px 8px', borderRadius: '6px', fontFamily: 'inherit',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffe' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#ffffeea6' }}>
            ← Dashboard
          </Link>
          <span style={{ color: '#ffffee14' }}>·</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffe' }}>{funnel.name}</span>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px',
            background: status === 'published' ? '#ffffee0f' : '#ffffee08',
            color: status === 'published' ? '#6ba0c0' : '#ffffeea6',
            border: `1px solid ${status === 'published' ? '#ffffee2e' : '#ffffee14'}`,
          }}>
            {status}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Save status */}
          <span style={{ fontSize: '11px', fontWeight: 500 }}>
            {saveError ? (
              <span style={{ color: 'hsl(0 55% 52%)' }} title={saveError}>
                {saveError.includes('retry') ? '⚠ Save failed — retry' : '⚠ Save failed'}
              </span>
            ) : saving ? (
              <span style={{ color: '#ffffeea6' }}>Saving…</span>
            ) : savedAt ? (
              <span style={{ color: '#ffffeea6' }}>Saved {savedAt}</span>
            ) : hasUnsaved ? (
              <span style={{ color: '#ffffeea6' }}>Unsaved changes</span>
            ) : (
              <span style={{ color: '#ffffee2e' }}>Saved</span>
            )}
          </span>

          <button
            onClick={undoLastAIEdit}
            disabled={!canUndo}
            title="Undo last AI edit"
            style={{
              fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px',
              border: '1px solid #ffffee14', background: canUndo ? '#ffffee0f' : '#ffffee08',
              color: canUndo ? '#ffffeea6' : '#ffffee2e', cursor: canUndo ? 'pointer' : 'default',
              opacity: canUndo ? 1 : 0.4, fontFamily: 'inherit',
            }}
          >
            ↶ Undo
          </button>

          <button
            onClick={forceSave}
            disabled={saving}
            title="Save now (Ctrl+S)"
            style={{
              fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '6px',
              border: '1px solid #ffffee14', background: saving ? '#ffffee08' : '#ffffee0f',
              color: saving ? '#ffffee2e' : '#ffffeea6', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1, fontFamily: 'inherit',
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>

          {publishError && (
            <span style={{ fontSize: '11px', color: 'hsl(0 55% 52%)' }} title={publishError}>
              ⚠ Publish failed
            </span>
          )}

          {status === 'published' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 4px',
              paddingLeft: '8px', borderRadius: '6px', border: '1px solid #ffffee14',
              background: '#ffffee08',
            }}>
              <span style={{
                fontSize: '11px', color: '#ffffeea6',
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                /f/{funnel.slug}
              </span>
              <button onClick={copyLiveUrl} title="Copy live URL" style={{
                fontSize: '10px', padding: '3px 6px', borderRadius: '4px',
                border: '1px solid #ffffee14', background: copied ? '#ffffee0f' : 'transparent',
                color: copied ? '#6ba0c0' : '#ffffeea6', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: copied ? 700 : 500,
              }}>
                {copied ? 'Copied' : 'Copy'}
              </button>
              <a href={`/f/${funnel.slug}`} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '10px', padding: '3px 6px', borderRadius: '4px',
                border: '1px solid #ffffee14', color: '#ffffeea6', textDecoration: 'none',
              }}>
                ↗
              </a>
            </div>
          )}

          <button onClick={togglePublish} disabled={publishing} style={{
            fontSize: '13px', fontWeight: 700, padding: '6px 16px', borderRadius: '8px',
            border: 'none', cursor: publishing ? 'not-allowed' : 'pointer',
            opacity: publishing ? 0.6 : 1,
            background: status === 'published' ? '#ffffee0f' : '#ffe',
            color: status === 'published' ? '#ffe' : '#1a1a1a',
            fontFamily: 'inherit',
          }}>
            {publishing ? '…' : status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT — Kenzo AI Chat ────────────────────────────────── */}
        <aside style={{
          width: '360px', flexShrink: 0, borderRight: '1px solid #ffffee14',
          background: '#222', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
            <AiBuilderPanel
              funnelId={funnel.id}
              blocks={blocks}
              settings={settings}
              selectedBlockId={selectedId}
              onUpdatePage={(newBlocks, newSettings) => {
                // Snapshot before applying AI edit (for undo)
                setUndoStack(prev => [...prev, { blocks: [...blocks], settings: { ...settings } }])
                setCanUndo(true)
                setBlocks(newBlocks)
                if (newSettings) setSettings(newSettings)
                save(newBlocks, newSettings)
              }}
            />
          </div>
        </aside>

        {/* ── CENTER — Canvas ──────────────────────────────────────── */}
        <main
          style={{
            flex: 1, overflowY: 'auto', background: isDark ? '#1a1a1a' : '#1a1a1a',
            padding: isDark ? '0' : '32px 24px', display: 'flex', justifyContent: 'center',
          }}
          onClick={() => setSelectedId(null)}
        >
          <CanvasErrorBoundary>
            <div style={{ width: '100%', maxWidth: isDark ? '100%' : '680px', ...canvasVars }}>
              {visibleBlocks.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', minHeight: '100%', height: '100%',
                  color: '#ffffee2e', fontSize: '14px', gap: '8px', padding: '80px 24px',
                }}>
                  <span style={{ fontSize: '28px' }}>⚡</span>
                  <span>Add a section from the right panel</span>
                </div>
              ) : isDark ? (
                <div style={{ background: settings.bgColor, fontFamily: `'${settings.font}', system-ui, sans-serif`, position: 'relative' }}>
                  <FunnelBackground background={settings.background} accent={settings.accentColor} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {visibleBlocks.map((block, i) => (
                      <CanvasBlock key={block.id} block={block} index={i} total={visibleBlocks.length} selected={selectedId === block.id} onSelect={() => handleBlockClick(block.id)} onMove={(dir) => moveBlock(block.id, dir)} onDelete={() => deleteBlock(block.id)} settings={settings} />
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#fff', borderRadius: '12px', overflow: 'hidden',
                  boxShadow: '0 4px 40px rgba(0,0,0,0.4)', minHeight: '500px',
                  fontFamily: `'${settings.font}', system-ui, sans-serif`, position: 'relative',
                }}>
                  <FunnelBackground background={settings.background} accent={settings.accentColor} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {visibleBlocks.map((block, i) => (
                      <CanvasBlock key={block.id} block={block} index={i} total={visibleBlocks.length} selected={selectedId === block.id} onSelect={() => handleBlockClick(block.id)} onMove={(dir) => moveBlock(block.id, dir)} onDelete={() => deleteBlock(block.id)} settings={settings} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CanvasErrorBoundary>
        </main>

        {/* ── RIGHT — Sections / Theme ──────────────────────────────── */}
        <aside style={{
          width: '280px', flexShrink: 0, borderLeft: '1px solid #ffffee14',
          background: '#222', display: 'flex', flexDirection: 'column', height: '100%',
          overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #ffffee14', flexShrink: 0 }}>
            <button
              onClick={() => setRightTab('sections')}
              style={{
                flex: 1, background: 'none', border: 'none',
                color: rightTab === 'sections' ? '#ffe' : '#ffffeea6',
                fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                textTransform: 'uppercase', padding: '14px 0',
                borderBottom: rightTab === 'sections' ? '2px solid #ffe' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}
            >
              Sections
            </button>
            <button
              onClick={() => setRightTab('theme')}
              style={{
                flex: 1, background: 'none', border: 'none',
                color: rightTab === 'theme' ? '#ffe' : '#ffffeea6',
                fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                textTransform: 'uppercase', padding: '14px 0',
                borderBottom: rightTab === 'theme' ? '2px solid #ffe' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}
            >
              Theme
            </button>
          </div>

          {/* Panel body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
            {rightTab === 'sections' ? (
              selectedBlock ? (
                <SectionSettingsPanel
                  block={selectedBlock}
                  onChangeProps={(props) => updateBlock(selectedBlock.id, props)}
                  onChangeStyle={(style) => updateBlockStyle(selectedBlock.id, style)}
                  onBack={() => setSelectedId(null)}
                />
              ) : (
                <SectionListPanel
                  blocks={blocks}
                  selectedId={selectedId}
                  accentColor={settings.accentColor}
                  dragIndex={dragIndex}
                  onSelect={(id) => setSelectedId(id)}
                  onAdd={addBlock}
                  onMove={moveBlock}
                  onDelete={deleteBlock}
                  onDuplicate={duplicateBlock}
                  onToggleHidden={toggleBlockHidden}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                />
              )
            ) : (
              <GlobalSettingsPanel settings={settings} onChange={updateSettings} />
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

// ─── Section List Panel ──────────────────────────────────────────────────────

function SectionListPanel({
  blocks, selectedId, accentColor, dragIndex,
  onSelect, onAdd, onMove, onDelete, onDuplicate, onToggleHidden,
  onDragStart, onDragOver, onDrop, onDragEnd,
}: {
  blocks: Block[]
  selectedId: string | null
  accentColor: string
  dragIndex: number | null
  onSelect: (id: string) => void
  onAdd: (type: BlockType) => void
  onMove: (id: string, dir: -1 | 1) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onToggleHidden: (id: string) => void
  onDragStart: (e: React.DragEvent, idx: number) => void
  onDragOver: (e: React.DragEvent, idx: number) => void
  onDrop: (e: React.DragEvent, idx: number) => void
  onDragEnd: () => void
}) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <p style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
          color: '#ffffee2e', margin: 0,
        }}>
          Sections
        </p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            width: '24px', height: '24px', borderRadius: '6px',
            border: '1px solid #ffffee14', background: 'transparent',
            color: '#ffffeea6', fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit', lineHeight: 1,
          }}
        >
          {showAdd ? '−' : '+'}
        </button>
      </div>

      {/* Add panel */}
      {showAdd && (
        <div style={{
          marginBottom: '12px', padding: '10px', borderRadius: '8px',
          background: '#ffffee08', border: '1px solid #ffffee14',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 600, color: '#ffffee2e', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Add Section
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {SECTION_TYPES.map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => { onAdd(type); setShowAdd(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 10px', borderRadius: '6px',
                  border: '1px solid transparent', background: 'transparent',
                  color: '#ffffeea6', fontSize: '12px', cursor: 'pointer',
                  textAlign: 'left', width: '100%', fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffffee0f'
                  e.currentTarget.style.color = '#ffe'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#ffffeea6'
                }}
              >
                <span style={{
                  width: '22px', height: '22px', borderRadius: '4px',
                  background: '#ffffee08', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '10px', flexShrink: 0,
                }}>
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </div>
          <div style={{ height: '1px', background: '#ffffee14', margin: '8px 0' }} />
          <p style={{ fontSize: '10px', fontWeight: 600, color: '#ffffee2e', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Add Element
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {ELEMENT_TYPES.map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => { onAdd(type); setShowAdd(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 10px', borderRadius: '6px',
                  border: '1px solid transparent', background: 'transparent',
                  color: '#ffffeea6', fontSize: '12px', cursor: 'pointer',
                  textAlign: 'left', width: '100%', fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffffee0f'
                  e.currentTarget.style.color = '#ffe'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#ffffeea6'
                }}
              >
                <span style={{
                  width: '22px', height: '22px', borderRadius: '4px',
                  background: '#ffffee08', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '10px', flexShrink: 0,
                }}>
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section list */}
      {blocks.length === 0 ? (
        <div style={{
          padding: '24px 8px', color: '#ffffee2e', fontSize: '12px',
          textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <span>No sections yet</span>
          <Link
            href="/templates"
            style={{
              fontSize: '11px', color: '#6ba0c0', textDecoration: 'none',
              padding: '4px 8px', borderRadius: '4px',
            }}
          >
            Browse templates →
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {blocks.map((block, i) => (
              <SectionRow
                key={block.id}
                block={block}
                index={i}
                selected={selectedId === block.id}
                hidden={block.hidden ?? false}
                accentColor={accentColor}
                dragActive={dragIndex === i}
                onSelect={() => onSelect(block.id)}
                onMove={(dir) => onMove(block.id, dir)}
                onDelete={() => onDelete(block.id)}
                onDuplicate={() => onDuplicate(block.id)}
                onToggleHidden={() => onToggleHidden(block.id)}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>
          <div style={{ marginTop: '12px' }}>
            <Link
              href="/templates"
              style={{
                display: 'block', textAlign: 'center', fontSize: '11px',
                color: '#ffffeea6', textDecoration: 'none',
                padding: '8px', borderRadius: '6px', border: '1px solid #ffffee14',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffe'; e.currentTarget.style.borderColor = '#ffffee2e' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#ffffeea6'; e.currentTarget.style.borderColor = '#ffffee14' }}
            >
              Browse templates
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Section Row ─────────────────────────────────────────────────────────────

function SectionRow({ block, index, selected, hidden, accentColor, dragActive, onSelect, onMove, onDelete, onDuplicate, onToggleHidden, onDragStart, onDragOver, onDrop, onDragEnd }: {
  block: Block; index: number; selected: boolean; hidden: boolean; accentColor: string; dragActive: boolean
  onSelect: () => void; onMove: (dir: -1 | 1) => void; onDelete: () => void; onDuplicate: () => void
  onToggleHidden: () => void
  onDragStart: (e: React.DragEvent, idx: number) => void; onDragOver: (e: React.DragEvent, idx: number) => void
  onDrop: (e: React.DragEvent, idx: number) => void; onDragEnd: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const typeLabel = block.type.replace('ic-', '').replace('-', ' ')
  const titleCased = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px',
        borderRadius: '6px',
        border: `1px solid ${dragActive ? '#ffffee2e' : selected ? '#ffffee2e' : 'transparent'}`,
        background: selected ? '#ffffee0f' : dragActive ? '#ffffee08' : hovered ? '#ffffee08' : 'transparent',
        color: selected ? '#ffe' : hidden ? '#ffffee2e' : '#ffffeea6',
        fontSize: '12px', cursor: 'pointer', transition: 'all 0.1s', position: 'relative',
      }}
    >
      {/* Drag handle */}
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnd={onDragEnd}
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
        style={{
          flexShrink: 0, cursor: 'grab', color: '#ffffee2e', fontSize: '10px',
          letterSpacing: '1px', padding: '2px 1px', userSelect: 'none', lineHeight: 1,
        }}
      >⋮⋮</div>

      <span style={{
        fontSize: '10px', color: hidden ? '#ffffee2e' : '#ffffee2e',
        width: '14px', flexShrink: 0, textAlign: 'right',
      }}>{index + 1}</span>

      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, opacity: hidden ? 0.4 : 1 }}>
        {titleCased}
      </span>

      <div style={{
        display: 'flex', gap: '3px', flexShrink: 0,
        opacity: hovered || selected ? 1 : 0, transition: 'opacity 0.1s',
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleHidden() }}
          title={hidden ? 'Show section' : 'Hide section'}
          style={{
            width: '22px', height: '22px', borderRadius: '4px',
            border: '1px solid #ffffee14',
            background: hidden ? '#ffffee0f' : 'transparent',
            color: hidden ? '#ffe' : '#ffffeea6', fontSize: '10px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 0, lineHeight: 1,
          }}
        >
          {hidden ? '◌' : '👁'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate() }}
          title="Duplicate"
          style={{
            width: '22px', height: '22px', borderRadius: '4px',
            border: '1px solid #ffffee14', background: 'transparent',
            color: '#ffffeea6', fontSize: '10px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 0, lineHeight: 1,
          }}
        >
          ⧉
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          title="Delete"
          style={{
            width: '22px', height: '22px', borderRadius: '4px',
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.08)',
            color: 'hsl(0 55% 52%)', fontSize: '10px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 0, lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── Canvas Block Wrapper ────────────────────────────────────────────────────

function CanvasBlock({ block, index, total, selected, onSelect, onMove, onDelete, settings }: {
  block: Block; index: number; total: number; selected: boolean
  onSelect: () => void; onMove: (dir: -1 | 1) => void; onDelete: () => void
  settings: FunnelSettings
}) {
  const [hovered, setHovered] = useState(false)

  // Build per-section style overrides
  const sectionStyle: Record<string, string | number | undefined> = {}
  if (block.style) {
    const s = block.style
    if (s.bgColor) sectionStyle.backgroundColor = s.bgColor
    if (s.textColor) sectionStyle.color = s.textColor
    if (s.accentColor) sectionStyle['--accent'] = s.accentColor
    if (s.headingFont) sectionStyle['--heading-font'] = s.headingFont
    if (s.bodyFont) sectionStyle.fontFamily = s.bodyFont
    if (s.fontScale) sectionStyle['--font-scale'] = String(s.fontScale)
    if (s.align) sectionStyle.textAlign = s.align
    if (s.paddingY !== undefined) {
      sectionStyle.paddingTop = `${s.paddingY}px`
      sectionStyle.paddingBottom = `${s.paddingY}px`
    }
    if (s.borderRadius !== undefined) sectionStyle.borderRadius = `${s.borderRadius}px`
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        outline: selected ? '2px solid #ffe' : hovered ? '2px solid #ffffee2e' : '2px solid transparent',
        outlineOffset: '-2px',
        transition: 'outline 0.1s',
        cursor: 'pointer',
        ...sectionStyle,
      }}
    >
      {(hovered || selected) && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: 'absolute', top: '8px', right: '8px',
          display: 'flex', gap: '4px', zIndex: 10,
        }}>
          <CtrlBtn onClick={() => onMove(-1)} disabled={index === 0} label="↑" />
          <CtrlBtn onClick={() => onMove(1)} disabled={index === total - 1} label="↓" />
          <CtrlBtn onClick={onDelete} label="✕" danger />
        </div>
      )}
      <BlockRenderer block={block} settings={settings} trusted />
    </div>
  )
}

function CtrlBtn({ onClick, disabled, label, danger }: {
  onClick: () => void; disabled?: boolean; label: string; danger?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '28px', height: '28px', borderRadius: '6px',
      border: `1px solid ${danger ? 'rgba(239,68,68,0.5)' : '#ffffee2e'}`,
      background: danger ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.7)',
      color: danger ? 'hsl(0 55% 52%)' : '#ffe', fontSize: '11px',
      fontWeight: 700, cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.3 : 1, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      {label}
    </button>
  )
}

// ─── Per-Section Settings Panel ──────────────────────────────────────────────

function SectionSettingsPanel({ block, onChangeProps, onChangeStyle, onBack }: {
  block: Block
  onChangeProps: (props: Block['props']) => void
  onChangeStyle: (style: BlockStyle) => void
  onBack: () => void
}) {
  const label = (text: string) => (
    <span style={{
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px',
      textTransform: 'uppercase', color: '#ffffee2e',
      display: 'block', marginBottom: '6px',
    }}>{text}</span>
  )
  const wrap = (content: React.ReactNode) => <div style={{ marginBottom: '14px' }}>{content}</div>
  const inp: React.CSSProperties = {
    width: '100%', background: '#00000047', border: '1px solid #ffffee14',
    borderRadius: '7px', padding: '7px 10px', fontSize: '13px',
    color: '#ffe', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }
  const ta: React.CSSProperties = { ...inp, resize: 'vertical' as const }
  const selectStyle: React.CSSProperties = { ...inp, cursor: 'pointer' }

  const typeLabel = block.type.replace('ic-', '').replace('-', ' ')
  const titleCased = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)
  const style = block.style || {}

  const FONTS = ['Inter', 'Lora', 'Satoshi', 'DM Sans', 'Poppins', 'Plus Jakarta Sans', 'Space Grotesk', 'Montserrat']

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', color: '#ffffeea6', cursor: 'pointer',
          fontSize: '12px', padding: '0 0 12px', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#ffe' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#ffffeea6' }}
      >
        ← Back to sections
      </button>

      <p style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#ffffee2e', marginBottom: '16px',
      }}>
        {titleCased} Settings
      </p>

      {/* ── Content Controls ──────────────────────────────────────── */}

      {block.type === 'heading' && <>
        {wrap(<>{label('Text')}<textarea value={block.props.text} onChange={e => onChangeProps({ ...block.props, text: e.target.value })} rows={3} style={ta} /></>)}
        {wrap(<>{label('Level')}
          <select value={block.props.level || 'h1'} onChange={e => onChangeProps({ ...block.props, level: e.target.value as 'h1' | 'h2' | 'h3' })} style={selectStyle}>
            <option value="h1">H1 — Page heading</option>
            <option value="h2">H2 — Section heading</option>
            <option value="h3">H3 — Subheading</option>
          </select>
        </>)}
      </>}

      {block.type === 'text' && <>
        {wrap(<>{label('Text')}<textarea value={block.props.text} onChange={e => onChangeProps({ ...block.props, text: e.target.value })} rows={5} style={ta} /></>)}
      </>}

      {block.type === 'button' && <>
        {wrap(<>{label('Label')}<input type="text" value={block.props.label} onChange={e => onChangeProps({ ...block.props, label: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('URL')}<input type="text" value={block.props.href} onChange={e => onChangeProps({ ...block.props, href: e.target.value })} placeholder="https://..." style={inp} /></>)}
        {wrap(<>{label('Style')}
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['filled', 'outline', 'ghost'] as const).map(s => (
              <button key={s} onClick={() => onChangeProps({ ...block.props, style: s })} style={{
                flex: 1, padding: '6px', border: (block.props.style || 'filled') === s ? '1px solid #ffffee2e' : '1px solid #ffffee14',
                borderRadius: '6px', background: (block.props.style || 'filled') === s ? '#ffffee0f' : 'transparent',
                color: (block.props.style || 'filled') === s ? '#ffe' : '#ffffeea6', fontSize: '10px',
                cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit',
              }}>{s}</button>
            ))}
          </div>
        </>)}
      </>}

      {block.type === 'image' && <>
        {wrap(<>{label('Image URL')}<input type="text" value={block.props.src} onChange={e => onChangeProps({ ...block.props, src: e.target.value })} placeholder="https://..." style={inp} /></>)}
        {wrap(<>{label('Alt text')}<input type="text" value={block.props.alt} onChange={e => onChangeProps({ ...block.props, alt: e.target.value })} style={inp} /></>)}
      </>}

      {block.type === 'form' && wrap(<>{label('Fields')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(['email', 'name', 'phone'] as FormField[]).map(f => (
            <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ffffeea6', cursor: 'pointer' }}>
              <input type="checkbox" checked={block.props.fields.includes(f)} onChange={e => {
                const fields = e.target.checked ? [...block.props.fields, f] : block.props.fields.filter(x => x !== f)
                onChangeProps({ ...block.props, fields })
              }} style={{ accentColor: '#ffe' }} />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
          ))}
        </div>
      </>)}

      {block.type === 'ic-hero' && <>
        {wrap(<>{label('Badge')}<input type="text" value={block.props.badge} onChange={e => onChangeProps({ ...block.props, badge: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('Headline')}<textarea value={block.props.headline} onChange={e => onChangeProps({ ...block.props, headline: e.target.value })} rows={4} style={ta} /></>)}
        {wrap(<>{label('Subtext')}<textarea value={block.props.subtext} onChange={e => onChangeProps({ ...block.props, subtext: e.target.value })} rows={3} style={ta} /></>)}
        {wrap(<>{label('CTA Label')}<input type="text" value={block.props.ctaLabel} onChange={e => onChangeProps({ ...block.props, ctaLabel: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('CTA URL')}<input type="text" value={block.props.ctaHref} onChange={e => onChangeProps({ ...block.props, ctaHref: e.target.value })} style={inp} /></>)}
      </>}

      {block.type === 'ic-ticker' && wrap(<>{label('Items (one per line)')}
        <textarea value={block.props.items.join('\n')} onChange={e => onChangeProps({ ...block.props, items: e.target.value.split('\n').filter(Boolean) })} rows={8} style={ta} />
      </>)}

      {block.type === 'ic-cards' && <>
        {wrap(<>{label('Section Headline')}<textarea value={block.props.headline} onChange={e => onChangeProps({ ...block.props, headline: e.target.value })} rows={2} style={ta} /></>)}
        {block.props.cards.map((card, i) => (
          <div key={i} style={{ marginBottom: '14px', padding: '12px', background: '#ffffee08', borderRadius: '8px', border: '1px solid #ffffee14' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#ffffee2e', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Card {i + 1}</p>
              {block.props.cards.length > 1 && (
                <button onClick={() => {
                  const cards = block.props.cards.filter((_, idx) => idx !== i)
                  onChangeProps({ ...block.props, cards })
                }} style={{ background: 'none', border: 'none', color: 'hsl(0 55% 52%)', fontSize: '14px', cursor: 'pointer', padding: '0 4px' }}>×</button>
              )}
            </div>
            {wrap(<>{label('Title')}<input type="text" value={card.title} onChange={e => {
              const cards = [...block.props.cards]; cards[i] = { ...cards[i], title: e.target.value }
              onChangeProps({ ...block.props, cards })
            }} style={inp} /></>)}
            {wrap(<>{label('Description')}<textarea value={card.desc} onChange={e => {
              const cards = [...block.props.cards]; cards[i] = { ...cards[i], desc: e.target.value }
              onChangeProps({ ...block.props, cards })
            }} rows={2} style={ta} /></>)}
            {wrap(<>{label('Bullets (one per line)')}<textarea value={(card.bullets || []).join('\n')} onChange={e => {
              const cards = [...block.props.cards]; cards[i] = { ...cards[i], bullets: e.target.value.split('\n').filter(Boolean) }
              onChangeProps({ ...block.props, cards })
            }} rows={2} style={ta} /></>)}
          </div>
        ))}
        <button onClick={() => onChangeProps({ ...block.props, cards: [...block.props.cards, { title: 'New card', desc: 'Description.', bullets: [] }] })} style={{
          width: '100%', padding: '8px', borderRadius: '7px', border: '1px dashed #ffffee14',
          background: 'transparent', color: '#ffffeea6', fontSize: '12px', cursor: 'pointer', marginBottom: '14px', fontFamily: 'inherit',
        }}>
          + Add card
        </button>
        {wrap(<>{label('CTA Label')}<input type="text" value={block.props.ctaLabel} onChange={e => onChangeProps({ ...block.props, ctaLabel: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('CTA URL')}<input type="text" value={block.props.ctaHref} onChange={e => onChangeProps({ ...block.props, ctaHref: e.target.value })} style={inp} /></>)}
      </>}

      {block.type === 'ic-faq' && <>
        {wrap(<>{label('Headline')}<input type="text" value={block.props.headline} onChange={e => onChangeProps({ ...block.props, headline: e.target.value })} style={inp} /></>)}
        {block.props.items.map((item, i) => (
          <div key={i} style={{ marginBottom: '12px', padding: '10px', background: '#ffffee08', borderRadius: '8px', border: '1px solid #ffffee14' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#ffffee2e', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Q{i + 1}</p>
              {block.props.items.length > 1 && (
                <button onClick={() => {
                  const items = block.props.items.filter((_, idx) => idx !== i)
                  onChangeProps({ ...block.props, items })
                }} style={{ background: 'none', border: 'none', color: 'hsl(0 55% 52%)', fontSize: '14px', cursor: 'pointer', padding: '0 4px' }}>×</button>
              )}
            </div>
            {wrap(<>{label('Question')}<input type="text" value={item.q} onChange={e => {
              const items = [...block.props.items]; items[i] = { ...items[i], q: e.target.value }
              onChangeProps({ ...block.props, items })
            }} style={inp} /></>)}
            {wrap(<>{label('Answer')}<textarea value={item.a} onChange={e => {
              const items = [...block.props.items]; items[i] = { ...items[i], a: e.target.value }
              onChangeProps({ ...block.props, items })
            }} rows={3} style={ta} /></>)}
          </div>
        ))}
        <button onClick={() => onChangeProps({ ...block.props, items: [...block.props.items, { q: 'New question', a: 'Answer here.' }] })} style={{
          width: '100%', padding: '8px', borderRadius: '7px', border: '1px dashed #ffffee14',
          background: 'transparent', color: '#ffffeea6', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          + Add question
        </button>
      </>}

      {block.type === 'ic-apply' && <>
        {wrap(<>{label('Headline')}<input type="text" value={block.props.headline} onChange={e => onChangeProps({ ...block.props, headline: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('Subtext')}<textarea value={block.props.subtext} onChange={e => onChangeProps({ ...block.props, subtext: e.target.value })} rows={2} style={ta} /></>)}
      </>}

      {block.type === 'ic-cta' && <>
        {wrap(<>{label('Button Label')}<input type="text" value={block.props.label} onChange={e => onChangeProps({ ...block.props, label: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('URL')}<input type="text" value={block.props.href} onChange={e => onChangeProps({ ...block.props, href: e.target.value })} style={inp} /></>)}
        {wrap(<>{label('Subtext')}<input type="text" value={block.props.subtext} onChange={e => onChangeProps({ ...block.props, subtext: e.target.value })} style={inp} /></>)}
      </>}

      {block.type === 'ic-results' && <>
        {wrap(<>{label('Headline')}<input type="text" value={block.props.headline} onChange={e => onChangeProps({ ...block.props, headline: e.target.value })} style={inp} /></>)}
        {wrap(<>
          {label('Photo URLs (one per line)')}
          <textarea value={block.props.photos.join('\n')} onChange={e => onChangeProps({ ...block.props, photos: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} rows={10} placeholder={'https://example.com/photo1.jpg'} style={ta} />
        </>)}
      </>}

      {/* ── Style Overrides ────────────────────────────────────────── */}
      <div style={{ height: '1px', background: '#ffffee14', margin: '18px 0' }} />
      <p style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#ffffee2e', marginBottom: '12px',
      }}>
        Style Overrides
      </p>

      {wrap(<>
        {label('Background color')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={style.bgColor || '#222222'} onChange={e => onChangeStyle({ ...style, bgColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid #ffffee14', background: '#00000047', cursor: 'pointer' }} />
          <input type="text" value={style.bgColor || ''} onChange={e => onChangeStyle({ ...style, bgColor: e.target.value || undefined })} placeholder="theme default" style={{ ...inp, flex: 1 }} />
        </div>
      </>)}

      {wrap(<>
        {label('Text color')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={style.textColor || '#ffffee'} onChange={e => onChangeStyle({ ...style, textColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid #ffffee14', background: '#00000047', cursor: 'pointer' }} />
          <input type="text" value={style.textColor || ''} onChange={e => onChangeStyle({ ...style, textColor: e.target.value || undefined })} placeholder="theme default" style={{ ...inp, flex: 1 }} />
        </div>
      </>)}

      {wrap(<>
        {label('Accent color')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={style.accentColor || '#6ba0c0'} onChange={e => onChangeStyle({ ...style, accentColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid #ffffee14', background: '#00000047', cursor: 'pointer' }} />
          <input type="text" value={style.accentColor || ''} onChange={e => onChangeStyle({ ...style, accentColor: e.target.value || undefined })} placeholder="theme default" style={{ ...inp, flex: 1 }} />
        </div>
      </>)}

      {wrap(<>
        {label('Heading font')}
        <select value={style.headingFont || ''} onChange={e => onChangeStyle({ ...style, headingFont: e.target.value || undefined })} style={selectStyle}>
          <option value="">Theme default</option>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </>)}

      {wrap(<>
        {label('Body font')}
        <select value={style.bodyFont || ''} onChange={e => onChangeStyle({ ...style, bodyFont: e.target.value || undefined })} style={selectStyle}>
          <option value="">Theme default</option>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </>)}

      {wrap(<>
        {label(`Font scale — ${(style.fontScale || 1.0).toFixed(1)}x`)}
        <input type="range" min={0.8} max={1.2} step={0.05} value={style.fontScale || 1.0} onChange={e => onChangeStyle({ ...style, fontScale: Number(e.target.value) || undefined })} style={{ width: '100%', accentColor: '#ffe', cursor: 'pointer' }} />
      </>)}

      {wrap(<>
        {label('Text alignment')}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['left', 'center', 'right'] as const).map(a => (
            <button key={a} onClick={() => onChangeStyle({ ...style, align: a })} style={{
              flex: 1, padding: '6px', border: (style.align || 'left') === a ? '1px solid #ffffee2e' : '1px solid #ffffee14',
              borderRadius: '6px', background: (style.align || 'left') === a ? '#ffffee0f' : 'transparent',
              color: (style.align || 'left') === a ? '#ffe' : '#ffffeea6', fontSize: '10px',
              cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit',
            }}>{a}</button>
          ))}
        </div>
      </>)}

      {wrap(<>
        {label(`Vertical padding — ${style.paddingY ?? 'theme'}px`)}
        <input type="range" min={0} max={120} step={8} value={style.paddingY ?? 0} onChange={e => {
          const v = Number(e.target.value)
          onChangeStyle({ ...style, paddingY: v > 0 ? v : undefined })
        }} style={{ width: '100%', accentColor: '#ffe', cursor: 'pointer' }} />
      </>)}

      {wrap(<>
        {label(`Border radius — ${style.borderRadius ?? 'theme'}px`)}
        <input type="range" min={0} max={24} value={style.borderRadius ?? 0} onChange={e => {
          const v = Number(e.target.value)
          onChangeStyle({ ...style, borderRadius: v > 0 ? v : undefined })
        }} style={{ width: '100%', accentColor: '#ffe', cursor: 'pointer' }} />
      </>)}

      {wrap(<>
        {label('Button style')}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['filled', 'outline', 'ghost'] as const).map(s => (
            <button key={s} onClick={() => onChangeStyle({ ...style, buttonStyle: s })} style={{
              flex: 1, padding: '6px', border: style.buttonStyle === s ? '1px solid #ffffee2e' : '1px solid #ffffee14',
              borderRadius: '6px', background: style.buttonStyle === s ? '#ffffee0f' : 'transparent',
              color: style.buttonStyle === s ? '#ffe' : '#ffffeea6', fontSize: '10px',
              cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit',
            }}>{s}</button>
          ))}
        </div>
      </>)}

      {/* Reset to theme */}
      <button
        onClick={() => onChangeStyle({})}
        style={{
          width: '100%', padding: '8px', borderRadius: '7px',
          border: '1px dashed #ffffee14', background: 'transparent',
          color: '#ffffeea6', fontSize: '11px', cursor: 'pointer',
          marginTop: '8px', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#ffe'; e.currentTarget.style.borderColor = '#ffffee2e' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#ffffeea6'; e.currentTarget.style.borderColor = '#ffffee14' }}
      >
        Reset to theme defaults
      </button>
    </div>
  )
}

// ─── Global Settings Panel (Theme tab) ───────────────────────────────────────

const BGS: { id: BackgroundId; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'particles', label: 'Particles' },
  { id: 'grid', label: 'Grid' },
  { id: 'glow', label: 'Glow' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'dots', label: 'Dots' },
  { id: 'noise', label: 'Noise' },
  { id: 'waves', label: 'Waves' },
  { id: 'stars', label: 'Stars' },
]

const FONTS = ['Inter', 'Lora', 'Satoshi', 'DM Sans', 'Poppins', 'Plus Jakarta Sans', 'Space Grotesk', 'Montserrat']

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: '40px', height: '22px', borderRadius: '11px',
      background: value ? '#ffe' : '#ffffee14',
      cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: '3px', left: value ? '21px' : '3px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: value ? '#1a1a1a' : '#ffffeea6',
        transition: 'left 0.2s',
      }} />
    </div>
  )
}

function GlobalSettingsPanel({ settings, onChange }: { settings: FunnelSettings; onChange: (patch: Partial<FunnelSettings>) => void }) {
  const inp: React.CSSProperties = {
    width: '100%', background: '#00000047', border: '1px solid #ffffee14',
    borderRadius: '7px', padding: '7px 10px', fontSize: '13px',
    color: '#ffe', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }
  const label = (text: string) => <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#ffffee2e', display: 'block', marginBottom: '6px' }}>{text}</span>
  const wrap = (content: React.ReactNode) => <div style={{ marginBottom: '14px' }}>{content}</div>
  const section = (title: string) => <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#ffffee2e', margin: '18px 0 10px', borderTop: '1px solid #ffffee14', paddingTop: '14px' }}>{title}</p>

  const tokens = resolveTokens(settings)
  const resolvedAccent = settings.accentColor || tokens['--accent']
  const resolvedBg = settings.bgColor || tokens['--bg']
  const resolvedText = settings.textColor || tokens['--text']

  return (
    <div>
      {/* Theme */}
      {section('Theme')}
      {wrap(<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {(Object.values(THEME_PRESETS) as { id: ThemeId; name: string; cssVars: Record<string, string> }[]).map((preset) => (
          <button
            key={preset.id}
            onClick={() => onChange({ theme: preset.id, accentColor: '', bgColor: '', textColor: '' })}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              padding: '8px 4px', borderRadius: '8px',
              border: settings.theme === preset.id ? '1px solid #ffffee2e' : '1px solid #ffffee14',
              background: settings.theme === preset.id ? '#ffffee0f' : 'transparent',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <div style={{ display: 'flex', gap: '2px' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: preset.cssVars['--bg'], border: '1px solid #ffffee14' }} />
              <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: preset.cssVars['--accent'], border: '1px solid #ffffee14' }} />
              <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: preset.cssVars['--text'], border: '1px solid #ffffee14' }} />
            </div>
            <span style={{ fontSize: '10px', color: settings.theme === preset.id ? '#ffe' : '#ffffeea6', fontWeight: settings.theme === preset.id ? 700 : 500 }}>
              {preset.name}
            </span>
          </button>
        ))}
      </div>)}

      {/* Colors */}
      {section('Colors')}
      {wrap(<>
        {label('Accent color')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={resolvedAccent} onChange={e => onChange({ accentColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid #ffffee14', background: '#00000047', cursor: 'pointer' }} />
          <input type="text" value={settings.accentColor} onChange={e => onChange({ accentColor: e.target.value })} placeholder={tokens['--accent']} style={{ ...inp, flex: 1 }} />
        </div>
      </>)}
      {wrap(<>
        {label('Background')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={resolvedBg} onChange={e => onChange({ bgColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid #ffffee14', background: '#00000047', cursor: 'pointer' }} />
          <input type="text" value={settings.bgColor} onChange={e => onChange({ bgColor: e.target.value })} placeholder={tokens['--bg']} style={{ ...inp, flex: 1 }} />
        </div>
      </>)}
      {wrap(<>
        {label('Text color')}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="color" value={resolvedText} onChange={e => onChange({ textColor: e.target.value })} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid #ffffee14', background: '#00000047', cursor: 'pointer' }} />
          <input type="text" value={settings.textColor} onChange={e => onChange({ textColor: e.target.value })} placeholder={tokens['--text']} style={{ ...inp, flex: 1 }} />
        </div>
      </>)}

      {/* Typography */}
      {section('Typography')}
      {wrap(<>{label('Body font')}<select value={settings.font} onChange={e => onChange({ font: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>{FONTS.map(f => <option key={f} value={f}>{f}</option>)}</select></>)}
      {wrap(<>{label('Heading font')}<select value={settings.headingFont} onChange={e => onChange({ headingFont: e.target.value })} style={{ ...inp, cursor: 'pointer' }}><option value="">Same as body</option>{FONTS.map(f => <option key={f} value={f}>{f}</option>)}</select></>)}
      {wrap(<>
        {label(`Font scale — ${settings.fontScale.toFixed(1)}x`)}
        <input type="range" min={0.8} max={1.2} step={0.05} value={settings.fontScale} onChange={e => onChange({ fontScale: Number(e.target.value) })} style={{ width: '100%', accentColor: '#ffe', cursor: 'pointer' }} />
      </>)}
      {wrap(<>{label('Letter spacing')}<select value={settings.letterSpacing} onChange={e => onChange({ letterSpacing: e.target.value as 'tight' | 'normal' | 'wide' })} style={{ ...inp, cursor: 'pointer' }}><option value="tight">Tight</option><option value="normal">Normal</option><option value="wide">Wide</option></select></>)}
      {wrap(<>{label('Heading weight')}<select value={settings.fontWeight} onChange={e => onChange({ fontWeight: e.target.value as 'regular' | 'medium' | 'bold' })} style={{ ...inp, cursor: 'pointer' }}><option value="regular">Regular (700)</option><option value="medium">Medium (800)</option><option value="bold">Bold (900)</option></select></>)}

      {/* Layout */}
      {section('Layout')}
      {wrap(<>{label(`Max width — ${settings.maxWidth}px`)}<input type="range" min={600} max={1400} step={50} value={settings.maxWidth} onChange={e => onChange({ maxWidth: Number(e.target.value) })} style={{ width: '100%', accentColor: '#ffe', cursor: 'pointer' }} /></>)}
      {wrap(<>{label('Section spacing')}<select value={settings.sectionSpacing} onChange={e => onChange({ sectionSpacing: e.target.value as 'compact' | 'normal' | 'spacious' })} style={{ ...inp, cursor: 'pointer' }}><option value="compact">Compact</option><option value="normal">Normal</option><option value="spacious">Spacious</option></select></>)}
      {wrap(<>{label(`Border radius — ${settings.borderRadius}px`)}<input type="range" min={0} max={24} value={settings.borderRadius} onChange={e => onChange({ borderRadius: Number(e.target.value) })} style={{ width: '100%', accentColor: '#ffe', cursor: 'pointer' }} /></>)}

      {/* Buttons */}
      {section('Buttons')}
      {wrap(<>{label('Button style')}<div style={{ display: 'flex', gap: '4px' }}>{(['filled', 'outline', 'ghost'] as const).map(s => (<button key={s} onClick={() => onChange({ buttonStyle: s })} style={{ flex: 1, padding: '8px 6px', borderRadius: '7px', border: settings.buttonStyle === s ? '1px solid #ffffee2e' : '1px solid #ffffee14', background: settings.buttonStyle === s ? '#ffffee0f' : 'transparent', color: settings.buttonStyle === s ? '#ffe' : '#ffffeea6', fontSize: '10px', fontWeight: settings.buttonStyle === s ? 700 : 500, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit' }}>{s}</button>))}</div></>)}
      {wrap(<>{label('Button size')}<select value={settings.buttonSize} onChange={e => onChange({ buttonSize: e.target.value as 'sm' | 'md' | 'lg' })} style={{ ...inp, cursor: 'pointer' }}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></>)}
      {wrap(<>{label(`Button radius — ${settings.buttonRadius}px`)}<input type="range" min={0} max={50} value={settings.buttonRadius} onChange={e => onChange({ buttonRadius: Number(e.target.value) })} style={{ width: '100%', accentColor: '#ffe', cursor: 'pointer' }} /></>)}

      {/* Background */}
      {section('Background')}
      {wrap(<>{label('Background style')}<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>{(BGS as { id: BackgroundId; label: string }[]).map(bg => (<button key={bg.id} onClick={() => onChange({ background: bg.id })} style={{ padding: '8px 6px', borderRadius: '7px', border: settings.background === bg.id ? '1px solid #ffffee2e' : '1px solid #ffffee14', background: settings.background === bg.id ? '#ffffee0f' : 'transparent', color: settings.background === bg.id ? '#ffe' : '#ffffeea6', fontSize: '10px', fontWeight: settings.background === bg.id ? 700 : 500, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit' }}>{bg.label}</button>))}</div></>)}

      {/* Effects */}
      {section('Effects')}
      {wrap(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{label('Glow effect')}<Toggle value={settings.glowEnabled} onChange={v => onChange({ glowEnabled: v })} /></div>)}
      {wrap(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{label('Gradient headlines')}<Toggle value={settings.gradientHeadlines} onChange={v => onChange({ gradientHeadlines: v })} /></div>)}
      {wrap(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{label('Glassmorphism')}<Toggle value={settings.glassmorphism} onChange={v => onChange({ glassmorphism: v })} /></div>)}

      {/* Ticker */}
      {section('Ticker & Scroll')}
      {wrap(<>{label(`Scroll speed — ${settings.tickerSpeed}s`)}<input type="range" min={8} max={80} value={settings.tickerSpeed} onChange={e => onChange({ tickerSpeed: Number(e.target.value) })} style={{ width: '100%', accentColor: '#ffe', cursor: 'pointer' }} /></>)}

      {/* Page */}
      {section('Page')}
      {wrap(<>{label('Page title')}<input type="text" value={settings.pageTitle} onChange={e => onChange({ pageTitle: e.target.value })} placeholder="My Funnel" style={inp} /></>)}
      {wrap(<>{label('Favicon URL')}<input type="text" value={settings.faviconUrl} onChange={e => onChange({ faviconUrl: e.target.value })} placeholder="https://..." style={inp} /></>)}
      {wrap(<>{label('OG Image URL')}<input type="text" value={settings.ogImage} onChange={e => onChange({ ogImage: e.target.value })} placeholder="https://.../og.png" style={inp} /></>)}

      {/* Tracking */}
      {section('Tracking')}
      {wrap(<>{label('Facebook Pixel ID')}<input type="text" value={settings.pixelId} onChange={e => onChange({ pixelId: e.target.value })} placeholder="1234567890" style={inp} /></>)}

      {/* Advanced */}
      {section('Advanced')}
      {wrap(<>
        {label('Custom CSS')}
        <textarea value={settings.customCss} onChange={e => onChange({ customCss: e.target.value })} rows={8} placeholder="/* Add custom CSS here */" style={{ ...inp, resize: 'vertical', fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: '11px', lineHeight: 1.5 }} />
      </>)}
    </div>
  )
}
