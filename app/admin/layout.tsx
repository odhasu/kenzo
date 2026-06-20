import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Aurora blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[300px] w-[400px] rounded-full bg-gradient-to-bl from-indigo-100 to-blue-50 opacity-25 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold tracking-tight text-black">Kenzo</Link>
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-600 border border-red-200">
              Admin
            </span>
            <nav className="flex gap-5">
              <Link href="/admin" className="text-sm text-gray-500 transition-colors hover:text-black">Overview</Link>
              <Link href="/admin/users" className="text-sm text-gray-500 transition-colors hover:text-black">Users</Link>
              <Link href="/admin/funnels" className="text-sm text-gray-500 transition-colors hover:text-black">Funnels</Link>
            </nav>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-400 transition-colors hover:text-black">← Dashboard</Link>
        </div>
      </header>
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
