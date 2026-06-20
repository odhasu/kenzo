import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold text-black">Kenzo</Link>
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">Admin</span>
            <nav className="flex gap-4">
              <Link href="/admin" className="text-sm text-gray-500 hover:text-black transition">Overview</Link>
              <Link href="/admin/users" className="text-sm text-gray-500 hover:text-black transition">Users</Link>
              <Link href="/admin/funnels" className="text-sm text-gray-500 hover:text-black transition">Funnels</Link>
            </nav>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-black transition">← Dashboard</Link>
        </div>
      </header>
      {children}
    </div>
  )
}
