import Link from 'next/link'

export function WaitlistFooter() {
  return (
    <footer className="relative z-10 flex flex-col items-center justify-center px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium no-underline transition-opacity hover:opacity-80"
        style={{ color: '#6b7280' }}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
          style={{ background: '#1a1a1a', color: '#39ff14' }}>
          K
        </span>
        Built using kenzo
      </Link>
      <p className="mt-2 text-[11px]" style={{ color: '#4b5563' }}>
        &copy; {new Date().getFullYear()} kenzo — All rights reserved.
      </p>
    </footer>
  )
}
