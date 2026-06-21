const STEPS = [
  {
    step: '01',
    time: '~10 min',
    title: 'Tell OpBot about your business',
    description:
      'A 5-step AI interview (18 questions) covering niche, ideal client, offer, pricing, and pain points. Onboarding once, used everywhere.',
    chips: ['Niche', 'Offer', 'Pricing', 'Voice'],
  },
  {
    step: '02',
    time: '<2 min',
    title: 'AI generates your entire ops stack',
    description:
      'Your funnel, follow-ups, and CRM are written and wired together automatically, live before you finish your coffee. (Full breakdown below.)',
    chips: ['Written for you', 'Fully wired', 'In your voice'],
  },
  {
    step: '03',
    time: '24/7',
    title: 'Your workforce shows up to work',
    description:
      'Sam works the pipeline, Mira watches Instagram, Iris handles SMS, Coral preps calls, Cole reviews them. You make decisions, not Zaps.',
    chips: ['Sam', 'Mira', 'Iris', 'Coral', 'Cole'],
  },
]

export function HowItWorks() {
  return (
    <section className="relative z-[1] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          How it works
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Built in 5 minutes. Not 5 weeks.
        </h2>

        {/* Steps */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="group rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md hover:border-indigo-200"
            >
              {/* Step number + time badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold tracking-tight text-gray-200 group-hover:text-indigo-200 transition-colors">
                  {s.step}
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                  {s.time}
                </span>
              </div>

              <h3 className="text-lg font-bold text-black">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{s.description}</p>

              {/* Chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-500"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
