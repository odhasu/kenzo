const SEGMENTS = [
  {
    title: 'High-ticket coaches',
    description:
      'You sell $400–$4,000+ offers and close over the phone or Zoom. You need more than a landing page — you need a pipeline, a setter, and follow-ups that don\'t depend on you remembering. OpBot replaces your VA and your patchwork of tools with one system that books calls while you coach.',
  },
  {
    title: 'Consultants done with GHL',
    description:
      'You bought GoHighLevel because someone told you it was "all-in-one." Six months later, you have 12 tabs open, a VA who can\'t figure out workflows, and a funnel that still isn\'t live. OpBot builds the whole thing for you in minutes — no drag, no drop, no duct tape.',
  },
  {
    title: 'Course creators scaling past 1:1',
    description:
      'You\'re moving from done-for-you services to a course or group program. You need a funnel that qualifies applicants, a CRM that tracks them, and email sequences that nurture. OpBot writes and wires all of it from one interview — live before your next launch.',
  },
  {
    title: 'Agencies (white-label)',
    description:
      'You run a coaching or marketing agency with multiple clients. Each one needs their own funnel, CRM, calendar, and follow-ups. OpBot\'s white-label mode lets you run unlimited coaches under your brand, with custom domains per coach and flexible billing. One platform, one bill, no per-seat traps.',
  },
]

export function WhoItsFor() {
  return (
    <section className="relative z-[1] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Who it&apos;s for
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Built for coaches and consultants who are done duct-taping.
        </h2>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-black">{seg.title}</h3>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{seg.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
