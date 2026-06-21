const QUOTES = [
  {
    quote: "I've had a think, and I'd be stupid to miss out on this.",
    author: 'Agency owner',
    context: 'After a 15-minute demo call',
  },
  {
    quote: "It's almost too good to be true, but it's not.",
    author: 'Coaching agency',
    context: 'During onboarding',
  },
  {
    quote: "It's ridiculous how much time it saves me.",
    author: 'High-ticket coach',
    context: 'First month using OpBot',
  },
  {
    quote: 'Saved me a ton on software and team, while improving my systems big time!',
    author: 'Agency owner',
    context: 'Two months in',
  },
]

export function Testimonials() {
  return (
    <section className="relative z-[1] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Testimonials
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Real reactions, from real demo calls.
        </h2>

        {/* Quote cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {QUOTES.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-black">{item.author}</p>
                <p className="text-xs text-gray-400">{item.context}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
