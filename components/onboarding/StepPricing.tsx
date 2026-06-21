'use client'

import { StepShell } from './StepShell'

const PAYMENT_OPTIONS = ['Pay in full only', 'Payment plans available', 'Both PIF and plans']

export function StepPricing({
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
      step={4}
      totalSteps={5}
      title="How do you price?"
      description="Price, value, and how clients pay."
      currentStep={3}
      onNext={onNext}
      onBack={onBack}
    >
      {/* Q1: Price */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s the price of your main offer?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          A range is fine if it varies. Be specific.
        </p>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <span className="text-gray-400 text-sm">$</span>
          <input
            type="text"
            value={values.price || ''}
            onChange={(e) => onChange('price', e.target.value)}
            placeholder="e.g. 4,500 or 3,000 - 8,000"
            className="w-full text-sm text-black placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Q2: Value/ROI */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s the value or ROI your clients typically get?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Be concrete — dollar amounts, time saved, promotions earned, revenue gained
        </p>
        <textarea
          value={values.value_roi || ''}
          onChange={(e) => onChange('value_roi', e.target.value)}
          placeholder="e.g. clients typically earn a $30K+ salary increase within 12 months, plus save 15+ hours/week by building better delegation systems"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
        />
      </div>

      {/* Q3: Payment type */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          How do clients pay?
        </label>
        <div className="space-y-2">
          {PAYMENT_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange('payment_type', p)}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-left transition ${
                values.payment_type === p
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </StepShell>
  )
}
