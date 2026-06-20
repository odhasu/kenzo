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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h2 className="text-2xl font-bold text-black">Overview</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-black">Recent funnels</h3>
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

  if (!funnels?.length) return <p className="mt-4 text-sm text-gray-400">No funnels yet.</p>

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Name</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Slug</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Status</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Created</th>
          </tr>
        </thead>
        <tbody>
          {funnels.map((f) => (
            <tr key={f.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-5 py-3 text-sm font-medium text-black">{f.name}</td>
              <td className="px-5 py-3 text-sm text-gray-500">/f/{f.slug}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  f.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>{f.status}</span>
              </td>
              <td className="px-5 py-3 text-sm text-gray-400">{new Date(f.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
