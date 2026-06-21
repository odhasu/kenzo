'use client'

import { StepShell } from './StepShell'

export function StepClient({
  values,
  onChange,
  onNext,
  onBack,
}: {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onNext: () => void
  onBack?: () => void
}) {
  return (
    <StepShell
      step={2}
      totalSteps={5}
      title="Who is your dream client?"
      description="The more specific, the better the copy AI can write."
      currentStep={1}
      onNext={onNext}
      onBack={onBack}
    >
      {/* Q1: Dream client */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          Describe your dream client
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Role, situation, pain level. Who are they and what&apos;s their world like?
        </p>
        <textarea
          value={values.dream_client || ''}
          onChange={(e) => onChange('dream_client', e.target.value)}
          placeholder="e.g. VP of Engineering at a Series B startup, managing 40 engineers, overwhelmed by 1:1s and politics, knows they need leadership skills but has no time to learn"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
        />
      </div>

      {/* Q2: What they tried */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What have they tried before that didn&apos;t work?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Books, courses, other coaches, DIY approaches — the more specific, the better
        </p>
        <textarea
          value={values.tried_before || ''}
          onChange={(e) => onChange('tried_before', e.target.value)}
          placeholder="e.g. read every leadership book, took a $2K online course, tried internal mentoring program — nothing stuck because no accountability"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
        />
      </div>

      {/* Q3: What they want */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s the one thing they want most right now?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          The thing they&apos;d pay anything for. The outcome they can&apos;t stop thinking about.
        </p>
        <input
          type="text"
          value={values.client_wants || ''}
          onChange={(e) => onChange('client_wants', e.target.value)}
          placeholder="e.g. a promotion to CTO within 12 months without burning out"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>
    </StepShell>
  )
}
