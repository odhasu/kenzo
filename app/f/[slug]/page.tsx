import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { Block, FunnelSettings } from '@/types/blocks'
import { DEFAULT_SETTINGS } from '@/types/blocks'
import { resolveTokens } from '@/lib/themes'
import type { Metadata } from 'next'

export const revalidate = 60

async function getFunnelData(slug: string) {
  const supabase = await createClient()

  const { data: funnel } = await supabase
    .from('funnels')
    .select('*, pages(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!funnel) return null

  const page = funnel.pages?.sort((a: { order: number }, b: { order: number }) => a.order - b.order)[0]
  const blocks = (page?.content || []) as Block[]
  const rawSettings = (page?.settings || {}) as Partial<FunnelSettings>
  const settings: FunnelSettings = { ...DEFAULT_SETTINGS, ...rawSettings }

  return { settings, blocks }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await getFunnelData(slug)
  if (!data) return {}

  const { settings } = data
  const meta: Metadata = {}
  if (settings.pageTitle) meta.title = settings.pageTitle
  if (settings.faviconUrl) meta.icons = { icon: settings.faviconUrl }
  if (settings.ogImage) meta.openGraph = { images: [settings.ogImage] }
  return meta
}

export default async function PublicFunnelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getFunnelData(slug)

  if (!data) notFound()

  const { settings, blocks } = data
  const tokens = resolveTokens(settings)
  const isDark = !settings.theme.startsWith('light')

  return (
    <>
      {settings.customCss && (
        <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
      )}
      {settings.pixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.pixelId}');fbq('track','PageView');`,
          }}
        />
      )}
      {settings.pixelId && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' } as React.CSSProperties}
            src={`https://www.facebook.com/tr?id=${settings.pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
      <div
        style={{
          ...tokens,
          background: 'var(--bg)',
          minHeight: '100vh',
          overflowX: 'hidden',
          fontFamily: `'${settings.font}', system-ui, sans-serif`,
        } as React.CSSProperties}
      >
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
    </>
  )
}
