'use client'

import type { Block, FunnelSettings } from '@/types/blocks'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { resolveTokens } from '@/lib/themes'

export function TemplateMiniPreview({ blocks, settings }: { blocks: Block[]; settings: FunnelSettings }) {
  const tokens = resolveTokens(settings)
  const vars = tokens as unknown as React.CSSProperties

  return (
    <div
      style={{
        transform: 'scale(0.28)',
        transformOrigin: 'top left',
        width: '357%', // 100/0.28
        height: '357%',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        borderRadius: '12px',
        fontFamily: `'${settings.font}', system-ui, sans-serif`,
        ...vars,
      }}
    >
      {blocks.map(block => (
        <BlockRenderer key={block.id} block={block} settings={settings} />
      ))}
    </div>
  )
}
