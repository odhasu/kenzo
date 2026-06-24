'use client'

import { useState } from 'react'
import type { Block, FunnelSettings } from '@/types/blocks'
import { TemplateMiniPreview } from './TemplateMiniPreview'

export function TemplateCard({
  templateId,
  name,
  description,
  archetype,
  blocks,
  settings,
  onUse,
  onEdit,
}: {
  templateId: string
  name: string
  description: string
  archetype: string
  blocks: Block[]
  settings: FunnelSettings
  onUse?: (templateId: string) => Promise<void>
  onEdit?: () => void
}) {
  const [loading, setLoading] = useState(false)

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
          setLoading(false)
        }
      }
    } catch {
      alert('Failed to create funnel')
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#222',
      borderRadius: '1rem',
      border: '1px solid #ffffee14',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffee2e' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffee14' }}
    >
      {/* Mini preview */}
      <div style={{
        height: '200px',
        overflow: 'hidden',
        background: settings.bgColor || '#050505',
        borderBottom: '1px solid #ffffee14',
      }}>
        <TemplateMiniPreview blocks={blocks} settings={settings} />
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#ffe',
            margin: 0,
            fontFamily: 'inherit',
          }}>
            {name}
          </h3>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '100px',
            background: '#ffffee0f',
            color: '#ffffeea6',
            textTransform: 'capitalize',
            letterSpacing: '0.3px',
          }}>
            {archetype}
          </span>
        </div>
        <p style={{
          fontSize: '12.5px',
          color: '#ffffeea6',
          margin: '0 0 16px',
          lineHeight: 1.45,
          flex: 1,
        }}>
          {description}
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleUse}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#ffe',
              color: '#1a1a1a',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Creating…' : 'Use template'}
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              style={{
                padding: '10px 14px',
                borderRadius: '0.5rem',
                border: '1px solid #ffffee2e',
                background: 'transparent',
                color: '#ffffeea6',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.15s, color 0.15s',
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
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
