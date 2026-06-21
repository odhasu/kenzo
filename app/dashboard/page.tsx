import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CreateFunnelButton } from './create-funnel-button'
import { FunnelCard } from './funnel-card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: funnels } = await supabase
    .from('funnels')
    .select('*')
    .order('created_at', { ascending: false })

  const gradientText =
    'bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent'

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 opacity-50 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-indigo-100 to-blue-50 opacity-30 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[300px] w-[500px] rounded-full bg-gradient-to-tr from-purple-100 to-pink-50 opacity-25 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-bold tracking-tight text-black">
              Kenzo
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-black"
              >
                Funnels
              </Link>
              <Link
                href="/dashboard/leads"
                className="text-sm text-gray-500 transition-colors hover:text-black"
              >
                Leads
              </Link>
              <Link
                href="/dashboard/train"
                className="text-sm text-gray-500 transition-colors hover:text-black"
              >
                AI Training ✦
              </Link>
              <Link
                href="/dashboard/developer"
                className="text-sm text-gray-500 transition-colors hover:text-black"
              >
                Dev Console 🛠️
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-gray-400 transition-colors hover:text-black"
            >
              Admin
            </Link>
            <CreateFunnelButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-[1] mx-auto max-w-6xl px-6 py-12">
        {/* Page title */}
        <div className="mb-10">
          <h1 className={`text-4xl font-bold tracking-tight leading-[1.1] ${gradientText}`}>
            Your Funnels
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {funnels?.length ?? 0} funnel{funnels?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Empty state */}
        {!funnels?.length ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-24 text-center backdrop-blur-sm">
            <div className="text-4xl">⚡</div>
            <h3 className="mt-4 text-lg font-semibold text-black">No funnels yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first funnel to get started
            </p>
            <div className="mt-6">
              <CreateFunnelButton />
            </div>
          </div>
        ) : (
          /* Funnel grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {funnels.map((funnel) => (
              <FunnelCard key={funnel.id} funnel={funnel} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
