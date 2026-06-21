'use client'

import { useState, useEffect } from 'react'

const ROTATING_WORDS = ['Coaches', 'Consultants', 'Course creators', 'Agencies']

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
        setVisible(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative z-[1] flex flex-col items-center px-6 pt-24 pb-32 text-center">
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-100 via-purple-50 to-violet-100 opacity-50 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-indigo-100 to-violet-50 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[300px] w-[500px] rounded-full bg-gradient-to-tr from-purple-100 to-indigo-50 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-[1] flex flex-col items-center">
        {/* Eyebrow with rotating word */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-gray-500 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          The 24/7 AI Growth Operator for{' '}
          <span
            className={`inline-block min-w-[90px] text-left font-semibold text-indigo-600 transition-all duration-300 ${
              visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
          >
            {ROTATING_WORDS[wordIndex]}
          </span>
        </div>

        {/* H1 */}
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-black sm:text-6xl leading-[1.1]">
          Your entire coaching business, built by AI in minutes.
        </h1>

        {/* Sub */}
        <p className="mt-6 max-w-2xl text-lg text-gray-500 leading-relaxed">
          Answer a few questions and OpBot builds your funnel, landing page, CRM, calendar,
          and email. Then an AI team works your Instagram DMs, SMS, and pipeline 24/7. One
          platform, $297/mo flat, live before your next sales call.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="/signup"
            className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            Start DIY for $297/mo
          </a>
          <a
            href="#book-demo"
            className="rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Book a Demo
          </a>
        </div>

        {/* Microcopy */}
        <p className="mt-4 text-xs text-gray-400">
          Self-serve in 60 seconds · or 15-min demo for DFY, Consulting, Agency
        </p>

        {/* Browser mockup */}
        <div className="mt-16 w-full max-w-4xl">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-2xl shadow-gray-200/50 backdrop-blur-sm">
      {/* Chrome dots */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-300" />
        <div className="h-3 w-3 rounded-full bg-yellow-300" />
        <div className="h-3 w-3 rounded-full bg-green-300" />
        <div className="ml-3 h-5 w-64 rounded-md bg-gray-100 text-[10px] flex items-center px-3 text-gray-400">
          app.opbot.io/dashboard
        </div>
      </div>
      {/* Dashboard content */}
      <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Leads', value: '128', change: '+18%', color: 'text-green-600' },
            { label: 'Bookings', value: '41', change: '+12%', color: 'text-green-600' },
            { label: 'Closed won', value: '11', change: '+9%', color: 'text-green-600' },
            { label: 'Revenue', value: '$42.6K', change: '+23%', color: 'text-green-600' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
              <p className="text-[10px] font-medium text-gray-400 uppercase">{kpi.label}</p>
              <p className="text-lg font-bold text-black">{kpi.value}</p>
              <p className={`text-[10px] font-semibold ${kpi.color}`}>{kpi.change}</p>
            </div>
          ))}
        </div>
        {/* Chart placeholder */}
        <div className="flex items-end gap-1 h-24 mb-3">
          {[40, 65, 45, 80, 55, 90, 70, 55, 85, 95, 60, 75, 88, 50].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-indigo-200"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        {/* Pipeline mini */}
        <div className="flex gap-2 text-[10px] text-gray-400">
          <span>Pipeline: $35.1K weighted</span>
          <span>·</span>
          <span>3 closers active</span>
        </div>
      </div>
    </div>
  )
}
