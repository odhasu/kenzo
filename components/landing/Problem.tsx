const CURRENT_STACK = [
  'GoHighLevel',
  'Calendly Pro',
  'ConvertKit / ActiveCampaign',
  'Notion / Airtable as CRM',
  'Typeform / Tally',
  'Pipedrive / HubSpot Starter',
  'Your $5K/mo growth operator',
  'The integration tax',
]

const OPBOT_REPLACEMENTS = [
  'AI-generated funnels',
  'Native booking calendar',
  'Built-in CRM + pipelines',
  'Email automation (8 triggers)',
  'SMS sequences fully compliant',
  'Sales team + call disposition forms',
  'Track every lead from click to close',
  'White-label agency mode',
]

export function Problem() {
  return (
    <section className="relative z-[1] bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          The problem
        </p>

        {/* Headline */}
        <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl leading-[1.1]">
          The stack you&apos;re drowning in.
        </h2>

        {/* Sub */}
        <p className="mt-5 max-w-2xl text-lg text-gray-400 leading-relaxed">
          Six logins, four credit cards, one growth operator on retainer, and one Zap that
          quietly broke three weeks ago. Most coaching businesses run on this, and most of them
          don&apos;t realize how much of their week is just stack maintenance.
        </p>

        {/* Two columns */}
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {/* Left — Current stack */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400">
              Your current stack
            </h3>
            <ul className="mt-5 space-y-3">
              {CURRENT_STACK.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 text-red-400">✕</span>
                  <span className="text-sm text-gray-300 line-through decoration-gray-600">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — OpBot replacements */}
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-400">
              Replaced by → One platform: OpBot
            </h3>
            <ul className="mt-5 space-y-3">
              {OPBOT_REPLACEMENTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 text-green-400">✓</span>
                  <span className="text-sm text-gray-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
