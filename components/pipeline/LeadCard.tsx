'use client'

import { Lead } from '@/lib/leads'

const SOURCE_LABELS: Record<string, string> = {
  ig_dm: 'IG DM',
  application: 'Application',
  webinar: 'Webinar',
  referral: 'Referral',
  manual: 'Manual',
  other: 'Other',
}

const STAGE_COLORS: Record<string, string> = {
  qualified: 'border-l-amber-400',
  booked: 'border-l-blue-400',
  follow_up: 'border-l-orange-400',
  closed_won: 'border-l-green-400',
  lost: 'border-l-red-400',
  no_show: 'border-l-gray-400',
  unqualified: 'border-l-gray-400',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export function LeadCard({ lead }: { lead: Lead }) {
  const sourceLabel = SOURCE_LABELS[lead.source] || lead.source
  const stageColor = STAGE_COLORS[lead.stage] || 'border-l-gray-400'

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-3 border-l-2 ${stageColor} shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Name + value */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-black truncate mr-2">{lead.name}</span>
        {lead.deal_value > 0 && (
          <span className="text-[10px] font-semibold text-gray-700 flex-shrink-0">
            ${lead.deal_value.toLocaleString()}
          </span>
        )}
      </div>

      {/* Source + time */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
        <span>{sourceLabel}</span>
        <span>·</span>
        <span>{timeAgo(lead.created_at)} ago</span>
      </div>

      {/* Booked call info */}
      {lead.booked_call_at && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-indigo-500 font-medium">
          <span>📅</span>
          <span>{new Date(lead.booked_call_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
        </div>
      )}

      {/* Payment type badge */}
      {lead.payment_type !== 'unknown' && lead.stage === 'closed_won' && (
        <div className="mt-1.5">
          <span className="inline-block rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] font-semibold text-green-700">
            {lead.payment_type === 'pif' ? 'PIF' : 'Payment Plan'}
          </span>
        </div>
      )}

      {/* Disposition badge */}
      {lead.disposition && (
        <div className="mt-1.5">
          <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
            {lead.disposition.replace(/_/g, ' ')}
          </span>
        </div>
      )}
    </div>
  )
}
