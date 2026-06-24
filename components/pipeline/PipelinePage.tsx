'use client'

import { useState, useEffect } from 'react'
import { Lead, getUserLeads, getPipelineStats, updateLeadStage, PipelineStats } from '@/lib/leads'
import { KanbanBoard } from './KanbanBoard'
import { AddLeadModal } from './AddLeadModal'
import Link from 'next/link'

export function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<PipelineStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [leadsData, statsData] = await Promise.all([
          fetch('/api/leads').then((r) => r.json()),
          fetch('/api/leads/stats').then((r) => r.json()),
        ])
        if (!active) return
        setLeads(leadsData.leads || [])
        setStats(statsData.stats || null)
      } catch {
        if (active) setError('Failed to load pipeline data.')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const handleStageChange = async (
    leadId: string,
    newStage: string,
    extra?: { disposition?: string; booked_call_at?: string }
  ) => {
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, stage: newStage, ...extra }),
      })
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? {
                ...l,
                stage: newStage,
                disposition: extra?.disposition || l.disposition,
                booked_call_at: extra?.booked_call_at || l.booked_call_at,
              }
            : l
        )
      )
      // Refresh stats
      const statsRes = await fetch('/api/leads/stats')
      const statsData = await statsRes.json()
      setStats(statsData.stats)
    } catch {
      setError('Failed to update lead stage.')
    }
  }

  const handleAddLead = async (lead: {
    name: string
    email: string
    source: string
    deal_value: number
    stage: string
    notes: string
  }) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })
      const data = await res.json()
      if (data.lead) {
        setLeads((prev) => [data.lead, ...prev])
        setShowAddModal(false)
        const statsRes = await fetch('/api/leads/stats')
        const statsData = await statsRes.json()
        setStats(statsData.stats)
      }
    } catch {
      setError('Failed to add lead.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black transition">
              ← Dashboard
            </Link>
            <h1 className="text-lg font-bold text-black">Leads Pipeline</h1>
          </div>
          {stats && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{stats.totalLeads} leads</span>
              <span>·</span>
              <span>${stats.totalWeighted.toLocaleString()} weighted</span>
              {stats.activeClosers > 0 && (
                <>
                  <span>·</span>
                  <span>{stats.activeClosers} closers active</span>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Stats bar */}
      {stats && (
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-6 text-xs">
            <span className="text-gray-500">
              This week:{' '}
              <strong className="text-black">{stats.closedThisWeek} closed</strong>
              {stats.closedThisWeekValue > 0 && (
                <span className="text-green-600 ml-1">
                  · ${stats.closedThisWeekValue.toLocaleString()}
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Kanban */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <KanbanBoard
          leads={leads}
          onStageChange={handleStageChange}
          onAddLead={() => setShowAddModal(true)}
        />
      </div>

      {/* Add lead modal */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLead}
        />
      )}
    </div>
  )
}
