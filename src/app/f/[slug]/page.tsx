import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { Block } from '@/types/blocks'

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

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-8 bg-white px-6 py-16">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </main>
  )
}
