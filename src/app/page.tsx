import { WaitlistForm } from '@/components/WaitlistForm'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 opacity-60 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-indigo-100 to-blue-50 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[300px] w-[500px] rounded-full bg-gradient-to-tr from-purple-100 to-pink-50 opacity-30 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
        <span className="text-xl font-bold tracking-tight text-black">Kenzo</span>
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-black transition-colors">Dashboard →</a>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-16 pb-32 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-gray-500 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Early access — limited spots
        </div>

        <h1 className="mt-2 max-w-2xl text-5xl font-bold tracking-tight text-black sm:text-6xl leading-[1.1]">
          Build funnels that
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            actually convert
          </span>
        </h1>

        <p className="mt-6 max-w-lg text-lg text-gray-500 leading-relaxed">
          Kenzo lets you create, publish, and track high-converting funnel pages in minutes — no code, no bloat.
        </p>

        {/* Waitlist form */}
        <div className="mt-10 w-full max-w-md">
          <WaitlistForm />
        </div>

        <p className="mt-4 text-xs text-gray-400">No spam. Unsubscribe anytime.</p>

        {/* Social proof numbers */}
        <div className="mt-16 flex items-center gap-8">
          {[
            { value: '500+', label: 'on the waitlist' },
            { value: '2 min', label: 'to build a page' },
            { value: '0', label: 'code required' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-black">{s.value}</p>
              <p className="mt-0.5 text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Glass card mockup */}
        <div className="mt-20 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-2xl shadow-gray-100 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-300" />
            <div className="h-3 w-3 rounded-full bg-yellow-300" />
            <div className="h-3 w-3 rounded-full bg-green-300" />
            <div className="ml-4 h-5 flex-1 rounded-md bg-gray-100" />
          </div>
          <div className="space-y-3">
            <div className="h-7 w-2/3 rounded-lg bg-gray-100" />
            <div className="h-4 w-full rounded-lg bg-gray-50" />
            <div className="h-4 w-5/6 rounded-lg bg-gray-50" />
            <div className="mt-5 flex gap-3">
              <div className="h-10 w-32 rounded-full bg-black/10" />
              <div className="h-10 w-24 rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
