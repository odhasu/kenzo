import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { Block, FunnelSettings } from '@/types/blocks'
import { DEFAULT_SETTINGS } from '@/types/blocks'
import { resolveTokens } from '@/lib/themes'

export const revalidate = 60

export default async function PublicFunnelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: funnel } = await supabase
    .from('funnels')
    .select('*, pages(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!funnel) notFound()

  const page = funnel.pages?.sort((a: { order: number }, b: { order: number }) => a.order - b.order)[0]
  const blocks = (page?.content || []) as Block[]
  const rawSettings = (page?.settings || {}) as Partial<FunnelSettings>
  const settings: FunnelSettings = { ...DEFAULT_SETTINGS, ...rawSettings }

  const tokens = resolveTokens(settings)

  const isDark = !settings.theme.startsWith('light')

  return (
    <div style={{ ...tokens, background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden', fontFamily: `'${settings.font}', system-ui, sans-serif` } as React.CSSProperties}>
      {isDark ? (
        blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} settings={settings} />
        ))
      ) : (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} settings={settings} />
          ))}
        </main>
      )}
    </div>
  )
}
