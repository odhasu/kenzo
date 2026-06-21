'use client'

import { useState } from 'react'

const SOURCES = [
  { value: 'ig_dm', label: 'IG DM' },
  { value: 'application', label: 'Application' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'referral', label: 'Referral' },
  { value: 'manual', label: 'Manual' },
  { value: 'other', label: 'Other' },
]

const STAGES = [
  { value: 'qualified', label: 'Qualified' },
  { value: 'booked', label: 'Booked' },
  { value: 'follow_up', label: 'Follow Up' },
]

export function AddLeadModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (lead: {
    name: string
    email: string
    source: string
    deal_value: number
    stage: string
    notes: string
  }) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [source, setSource] = useState('manual')
  const [dealValue, setDealValue] = useState('')
  const [stage, setStage] = useState('qualified')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await onAdd({
      name: name.trim(),
      email: email.trim(),
      source,
      deal_value: parseFloat(dealValue) || 0,
      stage,
      notes: notes.trim(),
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">Add Lead</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full name"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Source + Stage row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black focus:border-indigo-500 focus:outline-none transition bg-white"
              >
                {SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black focus:border-indigo-500 focus:outline-none transition bg-white"
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deal value */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Deal value ($)
            </label>
            <input
              type="number"
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any context about this lead..."
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {saving ? 'Adding...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
