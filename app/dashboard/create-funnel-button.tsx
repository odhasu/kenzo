'use client'

import Link from 'next/link'

export function CreateFunnelButton() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center rounded-full bg-[#ffe] px-5 py-2 text-sm font-semibold text-[#1a1a1a] shadow-sm transition hover:bg-[#ffffeecc]"
    >
      + New funnel
    </Link>
  )
}
