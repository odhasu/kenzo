'use client'

import { useState } from 'react'

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function RoiCalculator() {
  const [retainer, setRetainer] = useState(4000)
  const [revSharePct, setRevSharePct] = useState(5)
  const [monthlyRevenue, setMonthlyRevenue] = useState(30000)
  const [tools, setTools] = useState(500)

  const growthOperatorTotal = retainer + (revSharePct / 100) * monthlyRevenue
  const toolsStack = tools
  const totalToday = growthOperatorTotal + toolsStack
  const withOpBot = 297
  const savePerMonth = totalToday - withOpBot
  const savePerYear = savePerMonth * 12

  return (
    <section id="calculator" className="relative z-[1] bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          ROI Calculator
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          See what OpBot saves you.
        </h2>

        {/* Sub */}
        <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
          Plug in your growth operator&apos;s retainer + rev share + your monthly revenue + tool
          spend. We&apos;ll do the math against OpBot&apos;s flat $297/mo.
        </p>

        {/* Inputs */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Retainer */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Growth operator monthly retainer
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={retainer}
                onChange={(e) => setRetainer(Number(e.target.value) || 0)}
                className="w-full text-sm font-semibold text-black outline-none"
              />
            </div>
          </div>

          {/* Rev share */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rev share % <span className="text-gray-400 font-normal">({revSharePct}%)</span>
            </label>
            <div className="mt-1.5">
              <input
                type="range"
                min={0}
                max={50}
                value={revSharePct}
                onChange={(e) => setRevSharePct(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>0%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          {/* Monthly revenue */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your monthly revenue
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value) || 0)}
                className="w-full text-sm font-semibold text-black outline-none"
              />
            </div>
          </div>

          {/* Tools */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tools you pay for monthly
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={tools}
                onChange={(e) => setTools(Number(e.target.value) || 0)}
                className="w-full text-sm font-semibold text-black outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live math */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Your numbers
          </h3>

          <div className="mt-5 space-y-3">
            <BreakdownRow
              label="Growth operator total"
              value={growthOperatorTotal}
              detail={`Retainer ${fmt(retainer)} + ${revSharePct}% of ${fmt(monthlyRevenue)}`}
            />
            <BreakdownRow label="Tools stack" value={toolsStack} />
            <div className="border-t border-gray-200 pt-3">
              <BreakdownRow
                label="Total today"
                value={totalToday}
                bold
              />
            </div>
            <BreakdownRow label="With OpBot" value={withOpBot} />
          </div>

          {/* Big highlight */}
          <div className="mt-6 rounded-xl bg-indigo-600 p-5 text-center">
            <p className="text-sm font-semibold text-indigo-200">
              You save {fmt(savePerMonth)}/mo · {fmt(savePerYear)}/year
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Numbers update as you type. Plug in your actual figures.
          </p>
        </div>
      </div>
    </section>
  )
}

function BreakdownRow({
  label,
  value,
  detail,
  bold = false,
}: {
  label: string
  value: number
  detail?: string
  bold?: boolean
}) {
  return (
    <div className={`flex items-center justify-between ${bold ? 'font-bold text-black' : ''}`}>
      <div>
        <span className="text-sm text-gray-700">{label}</span>
        {detail && (
          <span className="ml-2 text-xs text-gray-400">{detail}</span>
        )}
      </div>
      <span className={`text-sm tabular-nums ${bold ? 'text-black' : 'text-gray-700'}`}>
        {fmt(value)}/mo
      </span>
    </div>
  )
}
