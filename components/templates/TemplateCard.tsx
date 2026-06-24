'use client'

import { useState } from 'react'
import type { Block, FunnelSettings } from '@/types/blocks'
import { TemplateMiniPreview } from './TemplateMiniPreview'

const ACCENT_COLORS: Record<string, string> = {
  'template-1': '#4ade80',
  'template-2': '#60a5fa',
  'template-3': '#c084fc',
}

export function TemplateCard({
  templateId,
  name,
  description,
  blocks,
  settings,
  onUse,
  onEdit,
}: {
  templateId: string
  name: string
  description: string
  blocks: Block[]
  settings: FunnelSettings
  onUse?: (templateId: string) => Promise<void>
  onEdit?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const accent = ACCENT_COLORS[templateId] || '#4ade80'

  async function handleUse() {
    setLoading(true)
    try {
      if (onUse) {
        await onUse(templateId)
      } else {
        const res = await fetch('/api/templates/use', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId }),
        })
        const data = await res.json()
        if (data.error) {
          alert(data.error)
        } else if (data.redirect) {
          window.location.href = data.redirect
        }
      }
    } catch {
      alert('Failed to create funnel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: '1rem',
        border: '1px solid #ffffff14',
        overflow: 'hidden',
        display: 'flex',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff2e' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff14' }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: '4px',
          flexShrink: 0,
          background: accent,
          borderRadius: '1rem 0 0 1rem',
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '20px' }}>
        {/* Mini preview */}
        <div
          style={{
            width: '180px',
            height: '120px',
            flexShrink: 0,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            background: settings.bgColor || '#050505',
            border: '1px solid #ffffff0a',
          }}
        >
          <TemplateMiniPreview blocks={blocks} settings={settings} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#ffe',
              margin: '0 0 6px',
              fontFamily: 'inherit',
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontSize: '12.5px',
              color: '#ffffeea6',
              margin: '0 0 16px',
              lineHeight: 1.5,
              flex: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onEdit && (
              <button
                onClick={onEdit}
                style={{
                  padding: '8px 16px',
                  borderRadius: '0.5rem',
                  border: '1px solid #ffffff2e',
                  background: 'transparent',
                  color: '#ffffeea6',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffffff0f'
                  e.currentTarget.style.color = '#ffe'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#ffffeea6'
                }}
              >
                Edit template
              </button>
            )}
            <button
              onClick={handleUse}
              disabled={loading}
              style={{
                padding: '8px 16px',
                borderRadius: '0.5rem',
                border: 'none',
                background: '#ffe',
                color: '#1a1a1a',
                fontSize: '12px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Creating…' : 'Use template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
