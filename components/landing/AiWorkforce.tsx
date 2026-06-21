const AGENTS = [
  {
    initial: 'S',
    name: 'Sam',
    role: 'Setter',
    description:
      'Qualifies leads, handles objections, and books calls. Works the full pipeline from first touch to booked meeting.',
    example: '"Sam booked 4 calls yesterday while you slept. One of them closed for $4,900 this morning."',
  },
  {
    initial: 'M',
    name: 'Mira',
    role: 'Instagram DM',
    description:
      'Monitors your Instagram inbox 24/7. Drafts replies in your voice, qualifies leads, and books calls directly onto your calendar.',
    example: '"Mira turned a 2am DM into a Thursday 2pm call. You approved the draft with one tap."',
  },
  {
    initial: 'I',
    name: 'Iris',
    role: 'SMS Inbox',
    description:
      'Handles all text conversations. Sends reminders, follows up after calls, and reactivates cold leads — all compliant and on-brand.',
    example: '"Iris sent 47 texts yesterday. 3 replies booked calls. Zero went to spam. 10DLC compliant."',
  },
  {
    initial: 'C',
    name: 'Coral',
    role: 'Call Prep',
    description:
      'Prepares a full brief before every call: lead history, engagement summary, talking points, and recommended close strategy.',
    example: '"Coral\'s brief flagged that the lead watched the full VSL twice and visited pricing 4×. Close at $4,500."',
  },
  {
    initial: 'C',
    name: 'Cole',
    role: 'Closer',
    description:
      'Reviews call recordings, scores dispositions, and surfaces deals that need a follow-up. Keeps your pipeline honest.',
    example: '"Cole flagged 3 deals stuck in Follow Up for 9+ days. You sent one text. One closed same day."',
  },
  {
    initial: 'L',
    name: 'Lex',
    role: 'Lead Analyst',
    description:
      'Scores every lead on behavior, source, and engagement. Tells you which leads to prioritize and which to let cool.',
    example: '"Lex moved a webinar lead from Warm to Hot after they replayed the VSL and opened all 5 follow-up emails."',
  },
  {
    initial: 'F',
    name: 'Forge',
    role: 'Funnel Auditor',
    description:
      'Audits your funnel pages weekly. Flags drop-off points, suggests copy tweaks, and tracks conversion rate changes over time.',
    example: '"Forge found a 22% drop-off on step 3 of your application. Suggested removing one field. Conversions up 18%."',
  },
  {
    initial: 'M',
    name: 'Maya',
    role: 'Marketer',
    description:
      'Writes your email sequences, SMS copy, landing page headlines, and ad creative. Everything in your voice from the onboarding interview.',
    example: '"Maya wrote a 5-email close sequence in 3 minutes. Reads exactly like you. Open rates at 41%."',
  },
  {
    initial: 'D',
    name: 'Dana',
    role: 'Data Analyst',
    description:
      'Builds reports on lead sources, conversion rates, revenue per channel, and ROI. Answers questions like "where did my best leads come from this month?"',
    example: '"Dana\'s report: Instagram DMs are your #1 source by revenue. Webinar is #1 by volume. Double down on IG."',
  },
  {
    initial: 'O',
    name: 'Otto',
    role: 'Ops Manager',
    description:
      'Keeps everything wired together. Calendars sync, emails send on schedule, leads don\'t fall through cracks, integrations don\'t break.',
    example: '"Otto caught a calendar sync issue before it affected any bookings. Fixed automatically. Zero missed calls."',
  },
  {
    initial: 'S',
    name: 'Sage',
    role: 'Knowledge Library',
    description:
      'Stores everything OpBot learns about your business — your voice, your offers, your FAQs, your competitor intel. Used by every other agent.',
    example: '"When Mira replies to a DM, she pulls from Sage\'s 47 stored facts about your pricing, process, and case studies."',
  },
  {
    initial: 'O',
    name: 'OpBot',
    role: 'Master Agent',
    description:
      'Orchestrates the workforce. Routes tasks, resolves conflicts, and surfaces the 3 things you need to know each morning.',
    example: '"Morning brief: 2 hot leads to call, 1 deal stuck in follow-up, Mira booked 3 calls overnight. Go."',
  },
]

export function AiWorkforce() {
  return (
    <section id="workforce" className="relative z-[1] bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          AI workforce
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          12+ named agents. One unified team.
        </h2>

        {/* Sub */}
        <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
          OpBot isn&apos;t one AI. It&apos;s a workforce. Each agent has a job, a schedule, and a
          name. They share context through a contact brain, so what Coral learns on a call shows
          up in Sam&apos;s next follow-up.
        </p>

        {/* Agent cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.name + agent.role}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {agent.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{agent.name}</p>
                  <p className="text-[11px] font-medium text-indigo-500">{agent.role}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                {agent.description}
              </p>
              <p className="text-[11px] text-gray-400 italic leading-relaxed border-t border-gray-100 pt-3">
                {agent.example}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Plus Vega (webinar QA) and Helix (support triage) running quietly in the background.
        </p>
      </div>
    </section>
  )
}
