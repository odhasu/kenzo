'use client'

import Link from 'next/link'

type Funnel = {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
}

export function FunnelCard({ funnel }: { funnel: Funnel }) {
  return (
    <Link
      href={`/dashboard/funnels/${funnel.id}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-black group-hover:text-gray-700">
          {funnel.name}
        </h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            funnel.status === 'published'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}
        >
          {funnel.status}
        </span>
      </div>
      <p className="mb-3 text-xs text-gray-400">/f/{funnel.slug}</p>
      <p className="text-[11px] text-gray-300">
        {new Date(funnel.created_at).toLocaleDateString()}
      </p>
    </Link>
  )
}
