import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 opacity-60 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-indigo-100 to-blue-50 opacity-40 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight text-black">Kenzo</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Log in</Link>
          <Link href="/signup" className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
            Get started →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Now in beta
        </div>

        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-black sm:text-6xl">
          Build funnels that
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">actually convert</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-500 leading-relaxed">
          Create, publish, and track high-converting funnel pages in minutes. No code required.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800"
          >
            Start building →
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
            View demo
          </Link>
        </div>

        {/* Glass card preview */}
        <div className="mt-20 w-full max-w-3xl rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-2xl shadow-gray-100 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="space-y-3">
            <div className="h-6 w-2/3 rounded-lg bg-gray-100" />
            <div className="h-4 w-full rounded-lg bg-gray-50" />
            <div className="h-4 w-5/6 rounded-lg bg-gray-50" />
            <div className="mt-4 h-10 w-32 rounded-full bg-black/10" />
          </div>
        </div>
      </main>
    </div>
  )
}
