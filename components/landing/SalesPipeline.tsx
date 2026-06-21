interface Lead {
  name: string
  source: string
  time: string
  value: string
  tag?: string
  detail?: string
}

interface Column {
  title: string
  count: number
  total: string
  leads: Lead[]
  color: string
}

const COLUMNS: Column[] = [
  {
    title: 'Qualified',
    count: 4,
    total: '$14,800',
    color: 'border-l-amber-400',
    leads: [
      { name: 'Sarah K.', source: 'IG DM', time: '2h', value: '$4,500', tag: 'Hot' },
      { name: 'Mike R.', source: 'Application', time: '5h', value: '$3,000', tag: 'Warm' },
      { name: 'Priya N.', source: 'Webinar', time: '1d', value: '$4,800' },
      { name: 'James T.', source: 'Referral', time: '2d', value: '$2,500' },
    ],
  },
  {
    title: 'Booked',
    count: 3,
    total: '$11,400',
    color: 'border-l-blue-400',
    leads: [
      { name: 'Alex M.', source: '', time: 'Tomorrow 10:00 AM', value: '$4,500', detail: 'Prep sent' },
      { name: 'Dana L.', source: '', time: 'Thu 2:00 PM', value: '$3,400', detail: 'Prep sent' },
      { name: 'Owen P.', source: '', time: 'Fri 11:30 AM', value: '$3,500' },
    ],
  },
  {
    title: 'Closed Won',
    count: 2,
    total: '$8,900',
    color: 'border-l-green-400',
    leads: [
      { name: 'Maya H.', source: '', time: 'Paid in full today', value: '$4,900', tag: 'Won' },
      { name: 'Chris B.', source: '', time: 'Payment plan yesterday', value: '$4,000', tag: 'Won' },
    ],
  },
]

function Tag({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Hot: 'bg-red-50 text-red-600 border-red-200',
    Warm: 'bg-amber-50 text-amber-600 border-amber-200',
    Won: 'bg-green-50 text-green-600 border-green-200',
  }
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colors[label] || 'bg-gray-50 text-gray-500 border-gray-200'}`}
    >
      {label}
    </span>
  )
}

export function SalesPipeline() {
  return (
    <section className="relative z-[1] bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Sales team / pipeline
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          A real sales team. Built in.
        </h2>

        {/* Sub */}
        <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
          Every lead gets a disposition after every call. Your pipeline shows you exactly where
          every dollar is — who&apos;s closing, what&apos;s stuck, and what needs a follow-up today.
        </p>

        <ul className="mt-5 space-y-2">
          {[
            '5 disposition outcomes: Closed Won, Lost, No-Show, Follow Up, Unqualified',
            'Deal value + payment type: PIF (Paid in Full) vs payment plan',
            'Round-robin or manual lead assignment across your closer team',
            'Team leaderboard with per-closer revenue and close rate',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 text-indigo-500">•</span>
              <span className="text-sm text-gray-600">{item}</span>
            </li>
          ))}
        </ul>

        {/* Kanban mockup */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <span className="text-xs font-semibold text-gray-500">
              app.opbot.io/leads
            </span>
            <span className="text-[10px] text-gray-400">
              9 leads · $35,100 weighted
            </span>
          </div>

          {/* Columns */}
          <div className="p-4 grid gap-4 md:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-700">
                    {col.title}
                    <span className="ml-1.5 text-gray-400 font-normal">
                      ({col.count})
                    </span>
                  </h4>
                  <span className="text-[10px] font-semibold text-gray-500">
                    {col.total}
                  </span>
                </div>

                <div className="space-y-2">
                  {col.leads.map((lead) => (
                    <div
                      key={lead.name}
                      className={`rounded-xl border border-gray-200 bg-gray-50 p-3 border-l-2 ${col.color}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-black">{lead.name}</span>
                        <span className="text-[10px] font-semibold text-gray-700">
                          {lead.value}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        {lead.source && <span>{lead.source}</span>}
                        {lead.source && lead.time && <span>·</span>}
                        <span>{lead.time}</span>
                      </div>
                      {(lead.tag || lead.detail) && (
                        <div className="mt-1.5 flex items-center gap-2">
                          {lead.tag && <Tag label={lead.tag} />}
                          {lead.detail && (
                            <span className="text-[10px] text-gray-400">{lead.detail}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-5 py-3 text-center text-[10px] text-gray-400">
            This week 2 closed · $8,900 · 3 closers active
          </div>
        </div>
      </div>
    </section>
  )
}
