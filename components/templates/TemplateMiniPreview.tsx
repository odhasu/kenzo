'use client'

import type { Block, FunnelSettings } from '@/types/blocks'

export function TemplateMiniPreview({
  blocks,
  settings,
}: {
  blocks: Block[]
  settings: FunnelSettings
}) {
  const bg = settings.bgColor || '#050505'
  const accent = settings.accentColor || '#4ade80'

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        gap: '6px',
        transform: 'scale(0.85)',
        transformOrigin: 'center center',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {blocks.slice(0, 4).map((block, i) => (
        <div
          key={block.id}
          style={{
            width: '90%',
            padding: i === 0 ? '12px 10px' : '6px 10px',
            borderRadius: '6px',
            background: i === 0 ? `${accent}18` : '#ffffff08',
            border: i === 0 ? `1px solid ${accent}30` : '1px solid #ffffff0a',
            textAlign: 'center',
            opacity: 1 - i * 0.15,
          }}
        >
          {i === 0 && (
            <div
              style={{
                fontSize: '8px',
                fontWeight: 700,
                color: accent,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '3px',
              }}
            >
              {block.type}
            </div>
          )}
          <div
            style={{
              fontSize: i === 0 ? '9px' : '7px',
              fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? '#ffe' : '#ffffeea6',
              lineHeight: 1.3,
            }}
          >
            {getBlockPreviewText(block)}
          </div>
        </div>
      ))}
      {blocks.length > 4 && (
        <div style={{ fontSize: '8px', color: '#ffffee4d', marginTop: '2px' }}>
          +{blocks.length - 4} more
        </div>
      )}
    </div>
  )
}

function getBlockPreviewText(block: Block): string {
  const p = block.props as unknown as Record<string, unknown>
  switch (block.type) {
    case 'ic-hero':
      return (p.headline as string) || 'Headline'
    case 'ic-ticker':
      return 'Ticker • ' + (((p.items as string[]) || []).length || 0) + ' items'
    case 'ic-cards':
      return (p.headline as string) || 'Cards Section'
    case 'ic-faq':
      return (p.headline as string) || 'FAQ Section'
    case 'ic-cta':
      return (p.label as string) || 'CTA Button'
    case 'ic-apply':
      return (p.headline as string) || 'Application'
    case 'ic-results':
      return (p.headline as string) || 'Results'
    case 'heading':
      return (p.text as string) || 'Heading'
    case 'text':
      return ((p.text as string) || 'Text').slice(0, 30)
    case 'button':
      return (p.label as string) || 'Button'
    default:
      return block.type
  }
}
