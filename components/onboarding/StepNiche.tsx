'use client'

import { StepShell } from './StepShell'

const OFFER_TYPES = [
  'Coaching',
  'Consulting',
  'Course',
  'Done-for-you service',
  'Agency',
  'Other',
]

export function StepNiche({
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
      step={1}
      totalSteps={5}
      title="Tell OpBot about your business"
      description="What you sell, to whom, and why it matters."
      currentStep={0}
      onNext={onNext}
      onBack={onBack}
    >
      {/* Q1: Offer type */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          What do you sell?
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {OFFER_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange('offer_type', t)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                values.offer_type === t
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Q2: Niche */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s your specific niche or industry?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Be as specific as possible — e.g. &ldquo;fitness coaches helping busy parents over 40&rdquo;
        </p>
        <input
          type="text"
          value={values.niche || ''}
          onChange={(e) => onChange('niche', e.target.value)}
          placeholder="e.g. executive leadership coaching for tech founders"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>

      {/* Q3: Transformation */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s the main transformation you deliver?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Before → After. What changes for your clients?
        </p>
        <textarea
          value={values.transform || ''}
          onChange={(e) => onChange('transform', e.target.value)}
          placeholder="e.g. They go from overwhelmed solo consultant to CEO of a $30K/mo practice with a team and systems"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
        />
      </div>

      {/* Q4: Competitors */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          Who are your main competitors or alternatives clients consider?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Other coaches, platforms, courses, or &ldquo;just figure it out myself&rdquo;
        </p>
        <input
          type="text"
          value={values.competitors || ''}
          onChange={(e) => onChange('competitors', e.target.value)}
          placeholder="e.g. other leadership coaches, online courses, in-house training"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>
    </StepShell>
  )
}
