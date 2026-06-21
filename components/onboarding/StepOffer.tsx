'use client'

import { StepShell } from './StepShell'

const OFFER_FORMATS = [
  '1:1 Coaching',
  'Group Program',
  'Online Course',
  'Done-For-You Service',
  'Mix / Hybrid',
]

export function StepOffer({
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
      step={3}
      totalSteps={5}
      title="What are you selling?"
      description="The offer, the format, and what makes it different."
      currentStep={2}
      onNext={onNext}
      onBack={onBack}
    >
      {/* Q1: Offer name */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s your main offer called?
        </label>
        <p className="text-xs text-gray-400 mb-2">Give it a name. Make it specific.</p>
        <input
          type="text"
          value={values.offer_name || ''}
          onChange={(e) => onChange('offer_name', e.target.value)}
          placeholder="e.g. The Executive Leadership Accelerator"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>

      {/* Q2: Format */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          What&apos;s the format?
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {OFFER_FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onChange('offer_format', f)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                values.offer_format === f
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Q3: What's included */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s included?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          List every deliverable — sessions, materials, access, community, bonuses
        </p>
        <textarea
          value={values.offer_includes || ''}
          onChange={(e) => onChange('offer_includes', e.target.value)}
          placeholder="e.g. 12 weekly 1:1 coaching sessions, leadership assessment, 360 feedback review, Slack access between sessions, 6-month roadmap"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
        />
      </div>

      {/* Q4: Guarantee */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s your guarantee or risk reversal?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          If you don&apos;t have one, just say so. Be honest.
        </p>
        <input
          type="text"
          value={values.guarantee || ''}
          onChange={(e) => onChange('guarantee', e.target.value)}
          placeholder="e.g. If you don't get promoted within 12 months, I'll coach you for free until you do"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>
    </StepShell>
  )
}
