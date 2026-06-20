import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      <h1 className="text-4xl font-bold text-white">Kenzo</h1>
      <p className="mt-3 text-lg text-zinc-400">Build high-converting funnels, fast.</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/signup"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-900"
        >
          Log in
        </Link>
      </div>
    </div>
  )
}
