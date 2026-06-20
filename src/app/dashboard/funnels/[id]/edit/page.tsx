import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BlockEditor } from '@/components/editor/BlockEditor'
import { PublishButton } from './publish-button'
import type { Block } from '@/types/blocks'

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: funnel, error } = await supabase
    .from('funnels')
    .select('*, pages(*)')
    .eq('id', id)
    .single()

  if (error || !funnel) redirect('/dashboard')

  const page = funnel.pages?.sort((a: { order: number }, b: { order: number }) => a.order - b.order)[0]

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
              ← Back
            </Link>
            <h1 className="text-lg font-bold text-white">{funnel.name}</h1>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              funnel.status === 'published'
                ? 'bg-green-900/50 text-green-400'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {funnel.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {funnel.status === 'published' && (
              <a
                href={`/f/${funnel.slug}`}
                target="_blank"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View live →
              </a>
            )}
            <PublishButton funnelId={funnel.id} currentStatus={funnel.status} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {page ? (
          <BlockEditor pageId={page.id} initialBlocks={(page.content || []) as Block[]} />
        ) : (
          <p className="text-zinc-500">No pages found for this funnel.</p>
        )}
      </main>
    </div>
  )
}
