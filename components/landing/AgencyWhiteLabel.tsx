const FEATURES = [
  {
    title: 'Your brand on every funnel',
    description:
      'Replace the OpBot logo with yours. Every funnel, CRM, calendar, and email your client sees carries your brand. You look like the platform.',
  },
  {
    title: 'Custom domains per coach',
    description:
      'Each client gets their own subdomain or custom domain. Their funnel lives at funnels.clientname.com, their calendar at book.clientname.com. Fully white-labeled.',
  },
  {
    title: 'Branded invite emails',
    description:
      'When you invite a client to their OpBot dashboard, the email comes from you — your logo, your colors, your sender name. They never see OpBot unless you want them to.',
  },
  {
    title: 'Flexible billing',
    description:
      'Charge your clients whatever you want. OpBot bills you $297/mo flat per coach seat — no per-lead fees, no revenue share, no surprises. You set your margin.',
  },
]

export function AgencyWhiteLabel() {
  return (
    <section id="agency" className="relative z-[1] bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Agency / white-label
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl leading-[1.1]">
          Run unlimited coaches under your brand.
        </h2>

        {/* Sub */}
        <p className="mt-4 max-w-2xl text-lg text-gray-400 leading-relaxed">
          You sell the coaching. OpBot runs the operations. Your clients see your brand on every
          page, every calendar, every email. One platform, one bill, your margins, your brand.
        </p>

        {/* Feature blocks */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8"
            >
              <h3 className="text-base font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#book-demo"
            className="inline-block rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-500"
          >
            Book an agency demo
          </a>
        </div>
      </div>
    </section>
  )
}
