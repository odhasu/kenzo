import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EditorLayout } from '@/components/editor/EditorLayout'
import type { Block } from '@/types/blocks'
import { DEFAULT_SETTINGS } from '@/types/blocks'

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: funnel, error } = await supabase
    .from('funnels')
    .select('*, pages(*)')
    .eq('id', id)
    .single()

  if (error || !funnel) redirect('/dashboard')

  const page = funnel.pages?.sort(
    (a: { order: number }, b: { order: number }) => a.order - b.order
  )[0]

  const rawSettings = page?.settings ?? {}
  const initialSettings = { ...DEFAULT_SETTINGS, ...rawSettings }

  return (
    <EditorLayout
      pageId={page?.id ?? ''}
      initialBlocks={(page?.content ?? []) as Block[]}
      initialSettings={initialSettings}
      funnel={{
        id: funnel.id,
        name: funnel.name,
        slug: funnel.slug,
        status: funnel.status,
      }}
    />
  )
}
