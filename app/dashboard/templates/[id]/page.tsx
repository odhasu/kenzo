'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Template, TemplateArchetype } from '@/lib/templates'
import type { BlockType, ThemeId, BackgroundId } from '@/types/blocks'
import { makeFunnelFromTemplate } from '@/lib/templates'
import { TemplateMiniPreview } from '@/components/templates/TemplateMiniPreview'

const ARCHETYPES: TemplateArchetype[] = ['application', 'waitlist', 'vsl', 'agency']
const THEMES: ThemeId[] = ['dark-green', 'dark-minimal', 'light-clean', 'light-blue']
const BACKGROUNDS: BackgroundId[] = ['none', 'gradient', 'particles', 'grid', 'glow', 'aurora', 'dots', 'noise', 'waves', 'stars']

const ALL_BLOCK_TYPES: BlockType[] = [
  'ic-hero', 'ic-ticker', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta', 'ic-apply',
  'heading', 'text', 'button', 'image', 'form', 'code',
]

export default function TemplateEditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [archetype, setArchetype] = useState<TemplateArchetype>('application')
  const [blockOrder, setBlockOrder] = useState<BlockType[]>([])
  const [theme, setTheme] = useState<ThemeId>('dark-green')
  const [background, setBackground] = useState<BackgroundId>('none')
  const [seedPropsJson, setSeedPropsJson] = useState('{}')
  const [jsonError, setJsonError] = useState('')

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(data => {
        const found = (Array.isArray(data) ? data : []).find((t: Template) => t.id === id)
        if (found) {
          setTemplate(found)
          setName(found.name)
          setDescription(found.description)
          setArchetype(found.archetype)
          setBlockOrder(found.blockOrder)
          setTheme(found.theme)
          setBackground(found.background)
          setSeedPropsJson(JSON.stringify(found.seedProps || {}, null, 2))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const toggleBlock = useCallback((type: BlockType) => {
    setBlockOrder(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type)
      }
      return [...prev, type]
    })
  }, [])

  const moveBlock = useCallback((index: number, direction: -1 | 1) => {
    setBlockOrder(prev => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }, [])

  async function handleSave() {
    // Validate JSON
    try {
      JSON.parse(seedPropsJson)
    } catch {
      setJsonError('Invalid JSON')
      return
    }
    setJsonError('')

    setSaving(true)
    setSaved(false)

    const body = {
      name,
      description,
      archetype,
      blockOrder,
      theme,
      background,
      seedProps: JSON.parse(seedPropsJson),
    }

    const res = await fetch(`/api/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      const data = await res.json()
      alert(data.error || 'Failed to save template')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#ffffeea6' }}>Loading template…</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: '#ffffeea6' }}>Template not found.</p>
        <button
          onClick={() => router.push('/dashboard/templates')}
          style={{
            padding: '8px 20px',
            borderRadius: '0.5rem',
            border: '1px solid #ffffee2e',
            background: 'transparent',
            color: '#ffe',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '13px',
          }}
        >
          Back to templates
        </button>
      </div>
    )
  }

  const previewBlocks = makeFunnelFromTemplate({
    ...template,
    name,
    description,
    archetype,
    blockOrder,
    theme,
    background,
    seedProps: (() => { try { return JSON.parse(seedPropsJson) } catch { return template.seedProps } })(),
  }).blocks

  const previewSettings = makeFunnelFromTemplate({
    ...template,
    theme,
    background,
  }).settings

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#ffe', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <button
              onClick={() => router.push('/dashboard/templates')}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffeea6',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'inherit',
                marginBottom: '8px',
                padding: 0,
              }}
            >
                ← Back to templates
            </button>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffe',
                margin: '0',
                fontFamily: "'Lora', Georgia, serif",
              }}
            >
              Edit: {name || template.name}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 28px',
              borderRadius: '0.5rem',
              border: 'none',
              background: saved ? '#4ade80' : '#ffe',
              color: '#1a1a1a',
              fontSize: '14px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: saving ? 0.6 : 1,
              transition: 'background 0.2s',
            }}
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save template'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          {/* Left: Preview */}
          <div
            style={{
              borderRadius: '1rem',
              border: '1px solid #ffffee14',
              overflow: 'hidden',
              background: previewSettings.bgColor || '#050505',
              position: 'sticky',
              top: '24px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#ffffeea6',
                padding: '10px 16px',
                borderBottom: '1px solid #ffffee14',
                background: '#1a1a1a',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Preview
            </div>
            <div style={{ height: '500px', overflow: 'hidden' }}>
              <TemplateMiniPreview blocks={previewBlocks} settings={previewSettings} />
            </div>
          </div>

          {/* Right: Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Basic info */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Basic Info</legend>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  placeholder="Template name"
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  placeholder="Short description"
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Archetype</label>
                <select
                  value={archetype}
                  onChange={e => setArchetype(e.target.value as TemplateArchetype)}
                  style={selectStyle}
                >
                  {ARCHETYPES.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </fieldset>

            {/* Theme */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Theme & Background</legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Theme</label>
                  <select
                    value={theme}
                    onChange={e => setTheme(e.target.value as ThemeId)}
                    style={selectStyle}
                  >
                    {THEMES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div style={fieldGroupStyle}>
                  <label style={labelStyle}>Background</label>
                  <select
                    value={background}
                    onChange={e => setBackground(e.target.value as BackgroundId)}
                    style={selectStyle}
                  >
                    {BACKGROUNDS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Block order */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Block Order</legend>
              <p style={{ fontSize: '11px', color: '#ffffeea6', margin: '0 0 8px' }}>
                Toggle blocks on/off. Drag order coming soon — use arrows for now.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {ALL_BLOCK_TYPES.filter(t => t.startsWith('ic-')).map(type => (
                  <button
                    key={type}
                    onClick={() => toggleBlock(type)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '100px',
                      border: '1px solid #ffffee2e',
                      background: blockOrder.includes(type) ? '#ffe' : 'transparent',
                      color: blockOrder.includes(type) ? '#1a1a1a' : '#ffffeea6',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {/* Ordered list with arrows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {blockOrder.map((type, i) => (
                  <div
                    key={type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: '#ffffee08',
                      border: '1px solid #ffffee14',
                      fontSize: '12px',
                      color: '#ffe',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#ffffeea6', fontSize: '10px', width: '16px' }}>{i + 1}</span>
                      {type}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => moveBlock(i, -1)}
                        disabled={i === 0}
                        style={arrowBtnStyle}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveBlock(i, 1)}
                        disabled={i === blockOrder.length - 1}
                        style={arrowBtnStyle}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
                {blockOrder.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#ffffeea6', textAlign: 'center', padding: '12px' }}>
                    No blocks selected. Toggle blocks above to add them.
                  </p>
                )}
              </div>
            </fieldset>

            {/* Seed props */}
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Seed Props (JSON)</legend>
              <p style={{ fontSize: '11px', color: '#ffffeea6', margin: '0 0 8px' }}>
                Override default props per block type. Must be valid JSON.
              </p>
              <textarea
                value={seedPropsJson}
                onChange={e => {
                  setSeedPropsJson(e.target.value)
                  setJsonError('')
                }}
                style={{
                  ...inputStyle,
                  minHeight: '200px',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  fontSize: '11px',
                  resize: 'vertical',
                  ...(jsonError ? { borderColor: '#f87171' } : {}),
                }}
                spellCheck={false}
              />
              {jsonError && (
                <p style={{ fontSize: '11px', color: '#f87171', margin: '4px 0 0' }}>{jsonError}</p>
              )}
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  )
}

const fieldsetStyle: React.CSSProperties = {
  border: '1px solid #ffffee14',
  borderRadius: '0.75rem',
  padding: '16px',
  background: '#1a1a1a',
}

const legendStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#ffffeea6',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: '0 6px',
}

const fieldGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '12px',
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: '#ffffeea6',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '0.5rem',
  border: '1px solid #ffffee2e',
  background: '#222',
  color: '#ffe',
  fontSize: '13px',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'auto',
}

const arrowBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid #ffffee14',
  borderRadius: '4px',
  color: '#ffffeea6',
  cursor: 'pointer',
  fontSize: '10px',
  padding: '2px 6px',
  fontFamily: 'inherit',
}
