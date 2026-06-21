import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function FunnelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: funnel, error } = await supabase
    .from('funnels')
    .select('*, pages(*)')
    .eq('id', id)
    .single()

  if (error || !funnel) {
    notFound()
  }

  const page = funnel.pages?.[0]
  const blockCount = page?.content?.length ?? 0

  // Quick stats (Phase 3 fills these from funnel_events)
  const stats = {
    views: 0,
    submissions: 0,
    pipelineValue: 0,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-black transition">
              ← Back to funnels
            </Link>
            <span className="text-gray-200">|</span>
            <h1 className="text-sm font-bold text-black">{funnel.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/funnels/${funnel.id}/edit`}
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Edit funnel
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Overview card */}
        <div className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-1">{funnel.name}</h2>
              <p className="text-sm text-gray-400">/f/{funnel.slug}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                funnel.status === 'published'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              {funnel.status}
            </span>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Sections</p>
              <p className="text-2xl font-bold text-black">{blockCount}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Views</p>
              <p className="text-2xl font-bold text-black">{stats.views}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">Analytics coming in Phase 3</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Pipeline</p>
              <p className="text-2xl font-bold text-black">${stats.pipelineValue.toLocaleString()}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">Analytics coming in Phase 3</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/dashboard/funnels/${funnel.id}/edit`}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              ✦ Edit funnel
            </Link>
            <Link
              href={`/dashboard/funnels/${funnel.id}/insights`}
              className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-black"
            >
              View insights →
            </Link>
            <Link
              href={`/f/${funnel.slug}`}
              target="_blank"
              className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-400 transition hover:border-gray-300 hover:text-black"
            >
              Preview ↗
            </Link>
          </div>
        </div>

        {/* Meta info */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-black mb-4">Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Created</p>
              <p className="text-black font-medium">
                {new Date(funnel.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Last updated</p>
              <p className="text-black font-medium">
                {funnel.updated_at
                  ? new Date(funnel.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Funnel ID</p>
              <p className="text-black font-mono text-xs">{funnel.id}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Pages</p>
              <p className="text-black font-medium">{funnel.pages?.length ?? 0}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
