import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-800/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-white">Kenzo <span className="text-xs font-normal text-red-400">Admin</span></h1>
            <nav className="flex gap-4">
              <Link href="/admin" className="text-sm text-zinc-400 hover:text-white transition">Overview</Link>
              <Link href="/admin/users" className="text-sm text-zinc-400 hover:text-white transition">Users</Link>
              <Link href="/admin/funnels" className="text-sm text-zinc-400 hover:text-white transition">Funnels</Link>
            </nav>
          </div>
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition">← Back to dashboard</Link>
        </div>
      </header>
      {children}
    </div>
  )
}
