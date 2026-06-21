const ROWS = [
  { feature: 'Builds your funnel + copy for you', opbot: '✓', setter: '✗', ghl: '✗' },
  { feature: 'AI Instagram DM setter', opbot: '✓', setter: 'Add-on', ghl: '✗' },
  { feature: 'CRM + pipeline built in', opbot: '✓', setter: 'Add-on', ghl: '✗' },
  { feature: 'Booking calendar + reminders', opbot: '✓', setter: 'Add-on', ghl: '✗' },
  { feature: 'Email + SMS automation', opbot: '✓', setter: 'Add-on', ghl: '✗' },
  { feature: 'Everything integrates automatically', opbot: '✓', setter: '✗', ghl: '✗' },
  { feature: 'Time to go live', opbot: 'Minutes', setter: 'Days', ghl: '2–4 weeks' },
  { feature: 'Tools to wire together', opbot: 'None', setter: '12+', ghl: 'Many' },
  { feature: 'White-label for agencies', opbot: '✓', setter: '✗', ghl: '✗' },
  { feature: 'What you pay', opbot: '$297/mo', setter: '$2K+/mo', ghl: '$297+/mo' },
]

function Cell({ value, isOpBot }: { value: string; isOpBot: boolean }) {
  const isCheck = value === '✓'
  const isCross = value === '✗'
  const isAddOn = value === 'Add-on'

  return (
    <td
      className={`px-4 py-3 text-sm text-center ${
        isOpBot ? 'bg-indigo-50/50 font-semibold' : ''
      }`}
    >
      {isCheck ? (
        <span className="text-green-500 text-base">✓</span>
      ) : isCross ? (
        <span className="text-red-300">✗</span>
      ) : isAddOn ? (
        <span className="text-xs font-medium text-amber-500">Add-on</span>
      ) : (
        <span className={isOpBot ? 'text-indigo-700' : 'text-gray-700'}>{value}</span>
      )}
    </td>
  )
}

export function ComparisonTable() {
  return (
    <section className="relative z-[1] bg-white">
      <div className="mx-auto max-w-5xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Honest comparison
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          One platform vs. the patchwork.
        </h2>

        {/* Sub */}
        <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
          Most coaches end up paying for a setter tool, a funnel builder, a CRM, a calendar, and
          an email platform separately, then wiring them together. Here&apos;s how that stacks up.
        </p>

        {/* Table */}
        <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Feature
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50/50">
                  OpBot
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Setter tool + 12 apps
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  GoHighLevel
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {row.feature}
                  </td>
                  <Cell value={row.opbot} isOpBot />
                  <Cell value={row.setter} isOpBot={false} />
                  <Cell value={row.ghl} isOpBot={false} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Comparison reflects typical coach setups. GoHighLevel includes the tools but still
          needs weeks of setup and a separate AI setter.
        </p>
      </div>
    </section>
  )
}
