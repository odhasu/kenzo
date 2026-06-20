import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

  const page = funnel.pages?.[0]

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
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {page ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-500">
              Page: {page.title} — {Array.isArray(page.content) ? page.content.length : 0} blocks
            </p>
            <p className="mt-4 text-zinc-400">Block editor coming next session.</p>
          </div>
        ) : (
          <p className="text-zinc-500">No pages found for this funnel.</p>
        )}
      </main>
    </div>
  )
}
