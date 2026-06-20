import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CreateFunnelButton } from './create-funnel-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: funnels } = await supabase
    .from('funnels')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold text-black">Kenzo</Link>
            <nav className="flex gap-4">
              <span className="text-sm font-medium text-black">Funnels</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs font-medium text-gray-400 hover:text-black transition">Admin</Link>
            <CreateFunnelButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Your funnels</h2>
            <p className="mt-1 text-sm text-gray-500">{funnels?.length ?? 0} funnel{funnels?.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {!funnels?.length ? (
          <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-black">No funnels yet</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first funnel to get started</p>
            <div className="mt-6"><CreateFunnelButton /></div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {funnels.map((funnel) => (
              <Link
                key={funnel.id}
                href={`/dashboard/funnels/${funnel.id}/edit`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-black group-hover:text-gray-700">{funnel.name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    funnel.status === 'published'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {funnel.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">/f/{funnel.slug}</span>
                </div>
                <p className="mt-4 text-xs text-gray-400">{new Date(funnel.created_at).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
