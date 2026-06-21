'use client'

import { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'

export function StepShell({
  step,
  totalSteps,
  title,
  description,
  currentStep,
  children,
  onBack,
  onNext,
  nextLabel = 'Next',
  loading = false,
  hasFollowUp = false,
}: {
  step: number
  totalSteps: number
  title: string
  description: string
  currentStep: number
  children: ReactNode
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  loading?: boolean
  hasFollowUp?: boolean
}) {
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            hasFollowUp={hasFollowUp}
          />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          {/* Step number */}
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">
            Step {step} of {totalSteps}
          </p>

          {/* Title */}
          <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            {title}
          </h2>

          {/* Description */}
          <p className="mt-2 text-gray-500 text-sm leading-relaxed">{description}</p>

          {/* Questions */}
          <div className="mt-6 space-y-5">{children}</div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <div>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Back
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onNext}
              disabled={loading}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Thinking...' : nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
