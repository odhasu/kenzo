import { createClient } from '@/lib/supabase/server'
import { getUserFunnels } from '@/lib/funnels'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreateFunnelButton } from './create-funnel-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const funnels = await getUserFunnels()

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold text-white">Kenzo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Your funnels</h2>
          <CreateFunnelButton />
        </div>

        {funnels.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-zinc-500">No funnels yet. Create your first one.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {funnels.map((funnel) => (
              <Link
                key={funnel.id}
                href={`/dashboard/funnels/${funnel.id}/edit`}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700"
              >
                <h3 className="font-medium text-white">{funnel.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    funnel.status === 'published'
                      ? 'bg-green-900/50 text-green-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {funnel.status}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(funnel.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function LogoutButton() {
  return (
    <form action="/auth/logout" method="POST">
      <button className="text-sm text-zinc-500 hover:text-zinc-300">Log out</button>
    </form>
  )
}
