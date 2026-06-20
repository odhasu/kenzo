'use client'

import Link from 'next/link'

export function CreateFunnelButton() {
  return (
    <Link
      href="/create"
      className="inline-flex items-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
    >
      + New funnel
    </Link>
  )
}
