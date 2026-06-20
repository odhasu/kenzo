import { WaitlistForm } from '@/components/WaitlistForm'

// ── reusable placeholder ──────────────────────────────────────────────────

function Placeholder({
  label,
  aspect = '16/9',
  rounded = 'rounded-xl',
}: {
  label: string
  aspect?: string
  rounded?: string
}) {
  return (
    <div
      className={`flex items-center justify-center border border-gray-200 bg-gray-50 text-xs text-gray-400 ${rounded}`}
      style={{ aspectRatio: aspect }}
    >
      {label}
    </div>
  )
}

function BrowserMockup({ label }: { label: string }) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-2xl shadow-gray-100 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-300" />
        <div className="h-3 w-3 rounded-full bg-yellow-300" />
        <div className="h-3 w-3 rounded-full bg-green-300" />
        <div className="ml-3 h-5 flex-1 rounded-md bg-gray-100" />
      </div>
      <div
        className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/80 text-xs text-gray-400"
        style={{ aspectRatio: '16/9' }}
      >
        {label}
      </div>
    </div>
  )
}

function LogoPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-[10px] text-gray-400">
      {label}
    </div>
  )
}

// ── nav links ────────────────────────────────────────────────────────────

const NAV_LINKS = ['Builder', 'Templates', 'Attribution', 'AI Operator', 'Pricing']

// ── FAQ data ─────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'What exactly does Kenzo do?',
    a: 'Kenzo is an AI-native funnel builder that lets you create high-converting landing pages, forms, and video funnels in minutes — with AI writing the copy, designing the layout, and optimizing for conversions.',
  },
  {
    q: 'Who is Kenzo for?',
    a: 'High-ticket coaches, course creators, and consultants who sell offers in the $400–$10,000+ range and want fast, intelligent funnel pages without hiring a team.',
  },
  {
    q: 'What software does Kenzo replace?',
    a: 'Kenzo replaces the patchwork of landing page builders, form tools, analytics scripts, and funnel software — giving you one AI-powered platform that handles everything from copywriting to conversion tracking.',
  },
  {
    q: 'Can the AI really build my funnel?',
    a: 'Yes. You describe your offer in plain English and Kenzo generates the full funnel — sections, copy, forms, video embeds — in seconds. You can tweak anything before publishing.',
  },
  {
    q: 'Do I need to be technical?',
    a: 'Not at all. If you can type a description of your offer, you can build a funnel with Kenzo. No code, no design skills, no integrations wizardry required.',
  },
  {
    q: 'Does it connect to my tools?',
    a: 'Kenzo plugs into your existing stack — Stripe, email platforms, CRMs, analytics tools, and more — so your funnel fits into your workflow, not the other way around.',
  },
  {
    q: 'Is switching a pain?',
    a: 'No. You can bring your existing funnels over in an afternoon. The AI builder handles the heavy lifting of recreating pages and forms on Kenzo.',
  },
  {
    q: 'Is there a free trial?',
    a: 'We offer a free trial so you can build and publish your first funnel before committing. No credit card required to get started.',
  },
]

// ── attribution journey ──────────────────────────────────────────────────

const JOURNEY_STEPS = [
  'Ad click',
  'UTM source captured',
  'Page visit',
  'Video watch',
  'Scroll depth tracked',
  'Button click',
  'Form start',
  'Form submit',
  'Booking created',
  'Checkout started',
  'Payment confirmed',
  'Conversion',
]

// ── Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const gradientText =
    'bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent'

  return (
    <div className="relative overflow-hidden bg-white">
      {/* ── Aurora blobs (hero only) ──────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 opacity-60 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-indigo-100 to-blue-50 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[300px] w-[500px] rounded-full bg-gradient-to-tr from-purple-100 to-pink-50 opacity-30 blur-3xl" />
      </div>

      {/* ── 1. NAV ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-black">Kenzo</span>
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-gray-500 transition-colors hover:text-black"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm text-gray-500 transition-colors hover:text-black"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Start free trial
            </a>
          </div>
        </nav>
      </header>

      {/* ── 2. HERO ───────────────────────────────────────────────────── */}
      <section className="relative z-[1] flex flex-col items-center px-6 pt-20 pb-32 text-center">
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-gray-500 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Early access — limited spots
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-black sm:text-6xl leading-[1.1]">
          Build and scale high-ticket funnels{' '}
          <br />
          <span className={gradientText}>with AI</span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 max-w-xl text-lg text-gray-500 leading-relaxed">
          Kenzo is the funnel platform built for high-ticket coaches and creators.
          Build fast and scale further with AI-native building, analytics, and
          decision making.
        </p>

        {/* Waitlist form */}
        <div className="mt-10 w-full max-w-md">
          <WaitlistForm />
        </div>
        <p className="mt-3 text-xs text-gray-400">No spam. Unsubscribe anytime.</p>

        {/* Browser mockup */}
        <div className="mt-16 w-full max-w-3xl">
          <BrowserMockup label="[ product screenshot ]" />
        </div>
      </section>

      {/* ── 3. AI BUILDER ──────────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left — text */}
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
              Pages, video, and forms — all in one AI-native builder.
            </h2>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed">
              AI writes the copy, designs the layout, and builds a funnel built to convert.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-black transition hover:gap-2"
            >
              Explore the builder →
            </a>

            {/* Replaces row */}
            <div className="mt-10">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                Replaces
              </p>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <LogoPlaceholder key={i} label="[ logo ]" />
                ))}
              </div>
            </div>
          </div>

          {/* Right — browser mockup */}
          <BrowserMockup label="[ builder screenshot ]" />
        </div>
      </section>

      {/* ── 4. EDGE SERVING ────────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-6xl px-6 py-24 border-t border-gray-100">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left — placeholder */}
          <div className="order-2 md:order-1">
            <Placeholder label="[ globe / map visual ]" aspect="1/1" rounded="rounded-2xl" />
          </div>

          {/* Right — text */}
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
              Funnels that load instantly, anywhere on Earth.
            </h2>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed">
              Kenzo keeps every funnel fast by loading each page from a server close to
              the visitor.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-black transition hover:gap-2"
            >
              Explore edge serving →
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. ATTRIBUTION ─────────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-6xl px-6 py-24 border-t border-gray-100">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left — text */}
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
              Know exactly what converts.
            </h2>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed">
              Track the same visitor and every action they take across multiple channels.
            </p>
          </div>

          {/* Right — timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200" />

            <div className="flex flex-col gap-2">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  {/* Dot + connector */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`h-[7px] w-[7px] rounded-full ${
                        i === 0
                          ? 'bg-black'
                          : i === JOURNEY_STEPS.length - 1
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                      }`}
                    />
                  </div>
                  {/* Pill */}
                  <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. AI OPERATOR ─────────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-6xl px-6 py-24 border-t border-gray-100">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left — text */}
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
              An AI operator that builds and runs your funnel for you.
            </h2>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed">
              Fully agentic AI that builds, tests, and improves your funnel over time.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-black transition hover:gap-2"
            >
              Explore the AI operator →
            </a>
          </div>

          {/* Right — placeholder */}
          <Placeholder label="[ performance dashboard ]" aspect="4/3" rounded="rounded-2xl" />
        </div>
      </section>

      {/* ── 7. SOCIAL PROOF ────────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-6xl px-6 py-24 border-t border-gray-100 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Creators making the switch
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          High-ticket coaches and course creators, now on Kenzo.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-12 rounded-full border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      </section>

      {/* ── 8. API / INTEGRATIONS ──────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-6xl px-6 py-24 border-t border-gray-100 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Connect your entire tech stack.
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Plugs into all the tools you already use.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <LogoPlaceholder key={i} label="[ logo ]" />
          ))}
        </div>
      </section>

      {/* ── 9. MIGRATION ───────────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-3xl px-6 py-24 border-t border-gray-100 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Switching is the easy part.
        </h2>
        <p className="mt-5 text-lg text-gray-500 leading-relaxed">
          Already running funnels somewhere else? Moving to Kenzo takes an afternoon,
          not a quarter — bring your offer over and let the AI builder do the heavy
          lifting.
        </p>
        <a
          href="/signup"
          className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Start migration
        </a>
      </section>

      {/* ── 10. PRICING ────────────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-4xl px-6 py-24 border-t border-gray-100 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Start free. Upgrade when you scale.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Launch card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-left shadow-sm">
            <h3 className="text-xl font-bold text-black">Launch</h3>
            <p className="mt-1 text-sm text-gray-500">For creators getting started.</p>
            <p className="mt-4">
              <span className="text-4xl font-bold text-black">$99</span>
              <span className="text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                10,000 monthly visits
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                1 custom domain
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                3 team members
              </li>
            </ul>
            <a
              href="/signup"
              className="mt-8 block rounded-full border border-black bg-black px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Start free trial
            </a>
          </div>

          {/* Scale card */}
          <div className="relative rounded-2xl border-2 border-black bg-white p-8 text-left shadow-sm">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1 text-[11px] font-semibold text-white">
              Most popular
            </span>
            <h3 className="text-xl font-bold text-black">Scale</h3>
            <p className="mt-1 text-sm text-gray-500">For growing businesses.</p>
            <p className="mt-4">
              <span className="text-4xl font-bold text-black">$199</span>
              <span className="text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Unlimited visits
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                10 custom domains
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                10 team seats
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                Remove Kenzo badge
              </li>
            </ul>
            <a
              href="/signup"
              className="mt-8 block rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Start free trial
            </a>
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ────────────────────────────────────────────────────── */}
      <section className="relative z-[1] mx-auto max-w-2xl px-6 py-24 border-t border-gray-100">
        <h2 className="text-center text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Frequently asked questions
        </h2>

        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-gray-200 bg-white transition"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-black select-none">
                {item.q}
                <span className="ml-4 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 12. FOOTER ─────────────────────────────────────────────────── */}
      <footer className="relative z-[1] border-t border-gray-200 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div>
              <span className="text-lg font-bold tracking-tight text-black">Kenzo</span>
              <p className="mt-2 text-sm text-gray-500">The funnel builder for operators.</p>
            </div>

            {/* Product */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Product
              </p>
              <ul className="space-y-2">
                {['Builder', 'Templates', 'Attribution', 'AI Operator', 'Pricing'].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-black"
                      >
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Company
              </p>
              <ul className="space-y-2">
                {['About', 'Changelog', 'Contact'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 transition-colors hover:text-black"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Legal
              </p>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Cookies'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 transition-colors hover:text-black"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
            © 2026 Kenzo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
