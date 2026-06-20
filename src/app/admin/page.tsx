import { createClient } from '@/lib/supabase/server'

export default async function AdminOverview() {
  const supabase = await createClient()

  const [
    { count: funnelCount },
    { count: publishedCount },
    { count: pageCount },
  ] = await Promise.all([
    supabase.from('funnels').select('*', { count: 'exact', head: true }),
    supabase.from('funnels').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('pages').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Total Funnels', value: funnelCount ?? 0 },
    { label: 'Published', value: publishedCount ?? 0 },
    { label: 'Total Pages', value: pageCount ?? 0 },
  ]

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h2 className="text-xl font-semibold text-white">Overview</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-white">Recent Funnels</h3>
        <RecentFunnels />
      </div>
    </main>
  )
}

async function RecentFunnels() {
  const supabase = await createClient()
  const { data: funnels } = await supabase
    .from('funnels')
    .select('id, name, slug, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  if (!funnels?.length) {
    return <p className="mt-4 text-sm text-zinc-500">No funnels yet.</p>
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800/50 bg-zinc-900/30">
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Slug</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Created</th>
          </tr>
        </thead>
        <tbody>
          {funnels.map((f) => (
            <tr key={f.id} className="border-b border-zinc-800/30 last:border-0">
              <td className="px-4 py-3 text-sm font-medium text-white">{f.name}</td>
              <td className="px-4 py-3 text-sm text-zinc-400">/f/{f.slug}</td>
              <td className="px-4 py-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  f.status === 'published' ? 'bg-green-900/50 text-green-400' : 'bg-zinc-800 text-zinc-400'
                }`}>{f.status}</span>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500">{new Date(f.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
