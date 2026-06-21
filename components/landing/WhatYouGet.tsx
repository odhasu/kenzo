const CARDS = [
  {
    title: 'Landing page + VSL',
    description:
      'A full-page funnel with a video sales letter embedded. AI writes the headlines, body copy, and CTA stack based on your interview answers. Includes countdown timer, social proof badges, and mobile-optimized layout.',
  },
  {
    title: 'Qualification form',
    description:
      'A multi-step application that filters leads before they reach your calendar. Configurable questions, conditional logic, and auto-scoring. Submissions flow directly into your CRM pipeline.',
  },
  {
    title: 'Booking calendar',
    description:
      'Native scheduling with buffer times, round-robin assignment, and automated reminders via email + SMS. No Calendly needed. Syncs with your Google or Outlook calendar.',
  },
  {
    title: 'CRM pipeline',
    description:
      'A visual kanban with stages from Qualified to Closed Won. Each lead has a full timeline, call dispositions, deal value, and payment type. Your entire sales process lives here.',
  },
  {
    title: 'Email sequences',
    description:
      'Eight automated triggers: welcome, abandoned form, post-booking, pre-call reminder, post-call follow-up, no-show, closed-won nurture, and reactivation. Written in your voice from your interview.',
  },
  {
    title: 'SMS sequences',
    description:
      'Compliant SMS automation for reminders, follow-ups, and reactivation. Double opt-in, 10DLC-registered numbers, auto opt-out handling. Works alongside email sequences without duplication.',
  },
]

export function WhatYouGet() {
  return (
    <section id="what-you-get" className="relative z-[1] bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          What you get
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          One interview. Your whole system, done.
        </h2>

        {/* Sub */}
        <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
          Other platforms hand you a blank canvas and a 2-to-4-week setup. OpBot interviews you
          once, then writes and wires every piece of your funnel for you. Nothing to drag, drop,
          or duct-tape.
        </p>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-base font-bold text-black">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer line */}
        <p className="mt-8 text-center text-sm text-gray-400">
          7 funnel types · written in your voice · fully editable · live in minutes, not weeks
        </p>
      </div>
    </section>
  )
}
