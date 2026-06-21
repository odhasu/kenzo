'use client'

import { useState } from 'react'

type Range = '7d' | '30d' | '90d'

const DATA: Record<
  Range,
  {
    leads: number
    leadsChange: string
    bookings: number
    bookingsChange: string
    closed: number
    closedChange: string
    revenue: string
    revenueChange: string
    pageViews: number
    barData: number[]
  }
> = {
  '7d': {
    leads: 128,
    leadsChange: '+18%',
    bookings: 41,
    bookingsChange: '+12%',
    closed: 11,
    closedChange: '+9%',
    revenue: '$42.6K',
    revenueChange: '+23%',
    pageViews: 2940,
    barData: [40, 65, 45, 80, 55, 90, 70],
  },
  '30d': {
    leads: 512,
    leadsChange: '+22%',
    bookings: 164,
    bookingsChange: '+15%',
    closed: 43,
    closedChange: '+11%',
    revenue: '$172K',
    revenueChange: '+28%',
    pageViews: 12400,
    barData: [55, 70, 60, 85, 65, 75, 80, 90, 72, 88, 68, 95, 77, 82, 70, 92, 78, 85, 65, 90, 73, 88, 69, 94, 76, 82, 71, 91, 74, 86],
  },
  '90d': {
    leads: 1480,
    leadsChange: '+25%',
    bookings: 492,
    bookingsChange: '+18%',
    closed: 128,
    closedChange: '+14%',
    revenue: '$510K',
    revenueChange: '+31%',
    pageViews: 38500,
    barData: [60, 75, 65, 88, 70, 80, 85, 92, 78, 85, 72, 95, 82, 88, 75, 90, 80, 86, 70, 94, 78, 82, 72, 90, 76, 85, 70, 92, 78, 88],
  },
}

export function Analytics() {
  const [range, setRange] = useState<Range>('7d')
  const d = DATA[range]

  return (
    <section className="relative z-[1] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Analytics
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Track every lead from click to closed-won.
        </h2>

        {/* Sub */}
        <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
          Every lead, every touch, every dollar traced back to its source. Know exactly which
          channels, funnels, and agents are driving revenue — no more guessing where your
          clients came from.
        </p>

        <ul className="mt-5 space-y-2">
          {[
            'Source tracking from first click to payment — Instagram, webinar, referral, organic',
            'Agent-level performance: see which AI agents booked, followed up, and closed',
            'Conversion funnel with drop-off at every stage, updated live',
            'Export everything as CSV, or pipe it into your existing BI stack',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 text-indigo-500">•</span>
              <span className="text-sm text-gray-600">{item}</span>
            </li>
          ))}
        </ul>

        {/* Dashboard mockup */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <span className="text-xs font-semibold text-gray-500">Dashboard</span>
            {/* Range toggle */}
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              {(['7d', '30d', '90d'] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-md transition ${
                    range === r
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Leads', value: d.leads, change: d.leadsChange },
                { label: 'Bookings', value: d.bookings, change: d.bookingsChange },
                { label: 'Closed won', value: d.closed, change: d.closedChange },
                { label: 'Revenue', value: d.revenue, change: d.revenueChange },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-[10px] font-medium uppercase text-gray-400">
                    {kpi.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-black">{kpi.value}</p>
                  <p className="text-[11px] font-semibold text-green-600">{kpi.change}</p>
                </div>
              ))}
            </div>

            {/* Mini bar chart */}
            <div className="mb-6">
              <p className="text-[10px] font-medium uppercase text-gray-400 mb-2">
                Leads over time
              </p>
              <div className="flex items-end gap-0.5 h-32">
                {d.barData.map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-indigo-200 hover:bg-indigo-400 transition-colors" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Conversion funnel */}
            <div>
              <p className="text-[10px] font-medium uppercase text-gray-400 mb-3">
                Conversion funnel
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Page views', value: d.pageViews, width: '100%', color: 'bg-gray-200' },
                  { label: 'Leads', value: d.leads, width: `${Math.round((d.leads / d.pageViews) * 100)}%`, color: 'bg-indigo-300' },
                  { label: 'Booked calls', value: d.bookings, width: `${Math.round((d.bookings / d.pageViews) * 100)}%`, color: 'bg-indigo-400' },
                  { label: 'Closed won', value: d.closed, width: `${Math.round((d.closed / d.pageViews) * 100)}%`, color: 'bg-indigo-600' },
                ].map((stage) => (
                  <div key={stage.label} className="flex items-center gap-3">
                    <span className="w-24 text-[11px] text-gray-500 text-right flex-shrink-0">
                      {stage.label}
                    </span>
                    <div className="flex-1 h-6 rounded-md bg-gray-50 overflow-hidden">
                      <div
                        className={`h-full rounded-md ${stage.color} flex items-center justify-end px-2`}
                        style={{ width: stage.width }}
                      >
                        <span className="text-[10px] font-semibold text-white tabular-nums">
                          {stage.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
