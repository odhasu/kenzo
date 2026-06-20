import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminFunnelsPage() {
  const supabase = await createClient()

  const { data: funnels } = await supabase
    .from('funnels')
    .select('id, name, slug, status, user_id, created_at, pages(id)')
    .order('created_at', { ascending: false })

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h2 className="text-xl font-semibold text-white">All Funnels</h2>
      <p className="mt-1 text-sm text-zinc-500">{funnels?.length ?? 0} total</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800/50 bg-zinc-900/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Pages</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Created</th>
            </tr>
          </thead>
          <tbody>
            {funnels?.map((f) => (
              <tr key={f.id} className="border-b border-zinc-800/30 last:border-0">
                <td className="px-4 py-3 text-sm font-medium text-white">{f.name}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {f.status === 'published' ? (
                    <Link href={`/f/${f.slug}`} className="text-blue-400 hover:text-blue-300">/f/{f.slug}</Link>
                  ) : (
                    <span>/f/{f.slug}</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-zinc-500">{f.user_id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-sm text-zinc-300">{f.pages?.length ?? 0}</td>
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
    </main>
  )
}
