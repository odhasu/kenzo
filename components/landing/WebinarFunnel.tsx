const TIMELINE = [
  { label: 'On signup', steps: ['Registration confirmed + add to calendar'] },
  { label: '3 days out', steps: ['Value email'] },
  { label: '24h out', steps: ['Reminder email + SMS'] },
  { label: '3h out', steps: ["It's today: link"] },
  { label: '1h out', steps: ['Starting soon'] },
  { label: 'Go-live', steps: ["We're live"] },
  { label: 'After', steps: ['Replay + 5-email close sequence'] },
]

export function WebinarFunnel() {
  return (
    <section className="relative z-[1] bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          {/* Left — text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
              Webinar funnel
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
              The webinar funnel that actually shows up rates.
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Most webinar funnels get a 35-45% show-up rate. OpBot&apos;s 19-touch sequence
              pushes that past 70%. Every touch is written, scheduled, and sent automatically —
              you show up and present.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                'Registration page with countdown timer and social proof',
                '19 automated touches across email and SMS before, during, and after',
                'Post-webinar: replay + 5-email close sequence, all written for you',
                'Every registrant flows into your CRM with full engagement history',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 text-indigo-500">•</span>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — timeline */}
          <div className="relative">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-600">
              19 touches
            </div>

            {/* Vertical line */}
            <div className="relative pl-8">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-indigo-200" />

              <div className="flex flex-col gap-4">
                {TIMELINE.map((item, i) => (
                  <div key={item.label} className="relative">
                    {/* Dot */}
                    <div
                      className={`absolute left-[-21px] top-1.5 h-[7px] w-[7px] rounded-full ${
                        i === 0
                          ? 'bg-indigo-600 ring-4 ring-indigo-100'
                          : i === TIMELINE.length - 1
                            ? 'bg-green-500'
                            : 'bg-indigo-300'
                      }`}
                    />

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                        {item.label}
                      </p>
                      {item.steps.map((step) => (
                        <p key={step} className="mt-1 text-sm text-gray-700">
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
