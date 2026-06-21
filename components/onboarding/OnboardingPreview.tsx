'use client'

import { Block } from '@/types/blocks'
import { FunnelSettings } from '@/types/blocks'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { resolveTokens } from '@/lib/themes'
import { PreviewErrorBoundary } from '@/components/PreviewErrorBoundary'

export function OnboardingPreview({
  blocks,
  settings,
}: {
  blocks: Block[]
  settings: FunnelSettings
}) {
  const tokens = resolveTokens(settings)
  const cssVars = {
    '--accent': tokens.accent,
    '--accent-glow': tokens.accentGlow,
    '--accent-dim': tokens.accentDim,
    '--bg': tokens.bg,
    '--surface': tokens.surface,
    '--text': tokens.text,
    '--text-muted': tokens.textMuted,
    '--text-dim': tokens.textDim,
    '--card': tokens.card,
    '--card-text': tokens.cardText,
    '--border': tokens.border,
    '--border-strong': tokens.borderStrong,
    '--radius': tokens.radius,
    '--font': tokens.font,
  } as React.CSSProperties

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100/50 overflow-hidden shadow-inner">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
        </div>
        <span className="ml-2 text-[10px] text-gray-400">Live preview</span>
      </div>
      <div
        className="overflow-auto max-h-[500px]"
        style={{
          maxWidth: settings.maxWidth || 1100,
          margin: '0 auto',
          ...cssVars,
        }}
      >
        <PreviewErrorBoundary>
          <div style={{ pointerEvents: 'none' }}>
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} settings={settings} />
            ))}
          </div>
        </PreviewErrorBoundary>
      </div>
    </div>
  )
}
