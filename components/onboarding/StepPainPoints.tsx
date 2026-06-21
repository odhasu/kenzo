'use client'

import { StepShell } from './StepShell'

export function StepPainPoints({
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
      step={5}
      totalSteps={5}
      title="Objections and proof"
      description="What stops them from buying, and what proves you can deliver."
      currentStep={4}
      onNext={onNext}
      onBack={onBack}
      nextLabel="Generate My Funnel"
    >
      {/* Q1: Pain points */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What keeps your ideal client up at night?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          The problem they can&apos;t shake. The thing they think about at 3am.
        </p>
        <textarea
          value={values.pain_points || ''}
          onChange={(e) => onChange('pain_points', e.target.value)}
          placeholder="e.g. They're terrified they'll be stuck in middle management forever, watching less talented people get promoted past them"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
        />
      </div>

      {/* Q2: Top objection */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What&apos;s their biggest objection to buying?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          What are they scared of? Price? Time commitment? Won&apos;t work for them?
        </p>
        <input
          type="text"
          value={values.top_objection || ''}
          onChange={(e) => onChange('top_objection', e.target.value)}
          placeholder="e.g. I don't have time for coaching on top of my 60-hour work week"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>

      {/* Q3: Inaction cost */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What happens if they don&apos;t solve this problem?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          The cost of doing nothing. The status quo.
        </p>
        <input
          type="text"
          value={values.inaction_cost || ''}
          onChange={(e) => onChange('inaction_cost', e.target.value)}
          placeholder="e.g. They stay stuck at the same level, get passed over for promotion again, and keep burning out"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition"
        />
      </div>

      {/* Q4: Social proof */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1.5">
          What proof do you have that your offer works?
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Testimonials, case studies, revenue numbers, before/afters. Be specific.
        </p>
        <textarea
          value={values.social_proof || ''}
          onChange={(e) => onChange('social_proof', e.target.value)}
          placeholder="e.g. 4 clients promoted to VP/C-suite in the last 12 months, avg salary increase $42K, one client went from manager to director in 8 months"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
        />
      </div>
    </StepShell>
  )
}
