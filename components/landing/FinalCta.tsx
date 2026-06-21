export function FinalCta() {
  return (
    <section id="book-demo" className="relative z-[1] bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Get started
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Stop running your business by hand.
        </h2>

        {/* Sub */}
        <p className="mt-5 max-w-xl mx-auto text-lg text-gray-500 leading-relaxed">
          Two ways in. Start DIY in 60 seconds, or book a 15-min demo for our Done-For-You,
          Consulting, or Agency White-Label packages.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row justify-center">
          <a
            href="/signup"
            className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            Start DIY for $297/mo
          </a>
          <a
            href="#book-demo"
            className="rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Book a Demo
          </a>
        </div>

        {/* Microcopy */}
        <p className="mt-4 text-xs text-gray-400">
          15-min demo · Live walk-through · No pitch theatre
        </p>
      </div>
    </section>
  )
}
