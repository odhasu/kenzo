import { createClient } from '@/lib/supabase/server'

export default async function AdminFunnelsPage() {
  const supabase = await createClient()

  const { data: funnels } = await supabase
    .from('funnels')
    .select('id, name, slug, status, user_id, created_at, pages(id)')
    .order('created_at', { ascending: false })

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h2 className="text-xl font-semibold text-black">All Funnels</h2>
      <p className="mt-1 text-sm text-gray-500">{funnels?.length ?? 0} total</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Pages</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Created</th>
            </tr>
          </thead>
          <tbody>
            {funnels?.map((f) => (
              <tr key={f.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-black">{f.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">/f/{f.slug}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{f.user_id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-sm text-gray-600">{f.pages?.length ?? 0}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    f.status === 'published'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>{f.status}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(f.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
