'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface InsightsData {
  traffic: {
    totalViews: number
    submissions: number
    conversionRate: number
  }
  speed: {
    avgTimeToCloseDays: number
    closeRate: number
    avgDealValue: number
  }
  pipeline: {
    leadsByStage: Record<string, number>
    pipelineValue: number
    closedWonWeekly: number[]
    totalLeads: number
  }
  performance: Record<string, { p50: number; p75: number; count: number }>
}

export default function InsightsPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/insights/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error)
        else setData(d)
      })
      .catch(() => setError('Failed to load insights'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-lg font-bold text-black mb-2">Could not load insights</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Link href={`/dashboard/funnels/${id}`} className="text-sm text-indigo-600 hover:underline">
            ← Back to funnel
          </Link>
        </div>
      </div>
    )
  }

  const noData = !data || data.traffic.totalViews === 0

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/funnels/${id}`} className="text-sm text-gray-400 hover:text-black transition">
              ← Back to funnel
            </Link>
            <span className="text-gray-200">|</span>
            <h1 className="text-sm font-bold text-black">Insights</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {noData ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-black mb-2">No data yet</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              Publish your funnel and share it to start collecting analytics. Views, conversions, and performance data will appear here.
            </p>
            <Link
              href={`/dashboard/funnels/${id}/edit`}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Edit funnel →
            </Link>
          </div>
        ) : (
          <>
            {/* Group 1: Traffic & Conversion */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4">Traffic & Conversion</h2>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Total Views" value={data.traffic.totalViews.toLocaleString()} />
                <MetricCard label="Submissions" value={data.traffic.submissions.toLocaleString()} />
                <MetricCard label="Conversion Rate" value={`${data.traffic.conversionRate}%`} />
              </div>
            </section>

            {/* Group 2: Speed / Time-to-Value */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4">Speed</h2>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Avg Time to Close" value={`${data.speed.avgTimeToCloseDays}d`} />
                <MetricCard label="Close Rate" value={`${data.speed.closeRate}%`} />
                <MetricCard label="Avg Deal Value" value={`$${data.speed.avgDealValue.toLocaleString()}`} />
              </div>
            </section>

            {/* Group 3: Pipeline Value */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4">Pipeline</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <MetricCard label="Total Leads" value={data.pipeline.totalLeads.toLocaleString()} />
                <MetricCard label="Pipeline Value" value={`$${data.pipeline.pipelineValue.toLocaleString()}`} />
                <MetricCard
                  label="Closed Won (4w)"
                  value={`$${data.pipeline.closedWonWeekly.reduce((a, b) => a + b, 0).toLocaleString()}`}
                />
              </div>
              {/* Stage breakdown */}
              {Object.keys(data.pipeline.leadsByStage).length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-black mb-3">Leads by Stage</h3>
                  <div className="space-y-2">
                    {Object.entries(data.pipeline.leadsByStage).map(([stage, count]) => (
                      <div key={stage} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{stage.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-semibold text-black">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Group 4: Page Load Performance */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4">Page Performance</h2>
              {Object.keys(data.performance).length === 0 ? (
                <p className="text-sm text-gray-400">No web vital data collected yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(data.performance).map(([vital, perf]) => (
                    <div key={vital} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">{vital}</p>
                      <div className="flex items-baseline gap-4">
                        <div>
                          <p className="text-[10px] text-gray-300">P50</p>
                          <p className="text-xl font-bold text-black">{perf.p50}{vital === 'CLS' ? '' : 'ms'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-300">P75</p>
                          <p className="text-xl font-bold text-black">{perf.p75}{vital === 'CLS' ? '' : 'ms'}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-300 mt-2">{perf.count} sample{perf.count !== 1 ? 's' : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-black">{value}</p>
    </div>
  )
}
