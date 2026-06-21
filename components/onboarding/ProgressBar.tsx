'use client'

const STEP_LABELS = ['Niche', 'Ideal Client', 'Offer', 'Pricing', 'Pain Points']

export function ProgressBar({
  currentStep,
  totalSteps,
  hasFollowUp = false,
}: {
  currentStep: number
  totalSteps: number
  hasFollowUp?: boolean
}) {
  const phase = hasFollowUp ? 'AI Follow-up' : null

  return (
    <div className="flex items-center gap-2">
      {STEP_LABELS.map((label, i) => {
        const isDone = i < currentStep
        const isCurrent = i === currentStep
        return (
          <div key={label} className="flex items-center gap-2">
            {/* Dot */}
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                isDone
                  ? 'bg-indigo-600'
                  : isCurrent
                    ? 'bg-indigo-600 ring-4 ring-indigo-100'
                    : 'bg-gray-200'
              }`}
            />
            {/* Label (only on larger screens) */}
            <span
              className={`hidden text-xs font-medium sm:inline ${
                isDone || isCurrent ? 'text-indigo-700' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
            {/* Connector line */}
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`hidden h-px w-6 sm:block ${
                  i < currentStep ? 'bg-indigo-300' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
      {/* Follow-up phase indicator */}
      {phase && currentStep >= totalSteps && (
        <>
          <div className="hidden h-px w-6 bg-indigo-300 sm:block" />
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
          <span className="hidden text-xs font-medium text-indigo-700 sm:inline">
            {phase}
          </span>
        </>
      )}
    </div>
  )
}
