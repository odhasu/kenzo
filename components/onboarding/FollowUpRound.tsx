'use client'

import { useState } from 'react'

interface FollowUpQuestion {
  key: string
  question: string
}

export function FollowUpRound({
  questions,
  onComplete,
  onBack,
  loading,
}: {
  questions: FollowUpQuestion[]
  onComplete: (answers: Record<string, string>) => void
  onBack?: () => void
  loading: boolean
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Almost there
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            A few more details
          </h2>
          <p className="mt-2 text-gray-500 text-sm">
            OpBot needs a bit more context to write copy that actually converts. Answer what you
            can — skip what you can&apos;t.
          </p>
        </div>

        {/* Questions card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="space-y-5">
            {questions.map((q) => (
              <div key={q.key}>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  {q.question}
                </label>
                <textarea
                  value={answers[q.key] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
                  }
                  placeholder="Type your answer here..."
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition resize-none"
                />
              </div>
            ))}
          </div>

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
              onClick={() => onComplete(answers)}
              disabled={loading}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Building your funnel...' : 'Generate My Funnel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
