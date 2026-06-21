'use client'

import { useState } from 'react'
import { Lead } from '@/lib/leads'
import { LeadCard } from './LeadCard'

const STAGES: {
  key: string
  label: string
  color: string
}[] = [
  { key: 'qualified', label: 'Qualified', color: 'border-l-amber-400' },
  { key: 'booked', label: 'Booked', color: 'border-l-blue-400' },
  { key: 'follow_up', label: 'Follow Up', color: 'border-l-orange-400' },
  { key: 'closed_won', label: 'Closed Won', color: 'border-l-green-400' },
  { key: 'lost', label: 'Lost', color: 'border-l-red-400' },
  { key: 'no_show', label: 'No-Show', color: 'border-l-gray-400' },
  { key: 'unqualified', label: 'Unqualified', color: 'border-l-gray-400' },
]

export function KanbanBoard({
  leads,
  onStageChange,
  onAddLead,
}: {
  leads: Lead[]
  onStageChange: (leadId: string, newStage: string, extra?: { disposition?: string; booked_call_at?: string }) => Promise<void>
  onAddLead: () => void
}) {
  const [movingId, setMovingId] = useState<string | null>(null)

  const leadsByStage = (stage: string) =>
    leads.filter((l) => l.stage === stage)

  const stageTotal = (stage: string) =>
    leadsByStage(stage).reduce((sum, l) => sum + (l.deal_value || 0), 0)

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId)
    setMovingId(leadId)
  }

  const handleDrop = async (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    setMovingId(null)
    if (leadId && stage !== leads.find((l) => l.id === leadId)?.stage) {
      const extra: { disposition?: string; booked_call_at?: string } = {}
      if (stage === 'closed_won') extra.disposition = 'closed_won'
      if (stage === 'lost') extra.disposition = 'lost'
      if (stage === 'no_show') extra.disposition = 'no_show'
      if (stage === 'unqualified') extra.disposition = 'unqualified'
      if (stage === 'follow_up') extra.disposition = 'follow_up'
      if (stage === 'booked') extra.booked_call_at = new Date().toISOString()
      await onStageChange(leadId, stage, extra)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-[900px] pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leadsByStage(stage.key)
          const total = stageTotal(stage.key)

          return (
            <div
              key={stage.key}
              className="flex-1 min-w-[200px]"
              onDrop={(e) => handleDrop(e, stage.key)}
              onDragOver={handleDragOver}
            >
              {/* Stage header */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {stage.label}
                  <span className="ml-1.5 text-gray-400 font-normal">
                    ({stageLeads.length})
                  </span>
                </h4>
                {total > 0 && (
                  <span className="text-[10px] font-semibold text-gray-500">
                    ${total.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stage cards */}
              <div className="space-y-2">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    className={`cursor-grab active:cursor-grabbing transition-opacity ${
                      movingId === lead.id ? 'opacity-50' : ''
                    }`}
                  >
                    <LeadCard lead={lead} />
                  </div>
                ))}

                {/* Drop target hint */}
                {stageLeads.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center text-[10px] text-gray-400">
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add lead button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onAddLead}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          + Add Lead
        </button>
      </div>
    </div>
  )
}
