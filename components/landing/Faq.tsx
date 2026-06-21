'use client'

import { useState } from 'react'

const FAQ_ITEMS = [
  {
    q: 'Will OpBot actually replace my growth operator?',
    a: 'For most coaches, yes — the parts a growth operator handles (DM outreach, lead qualification, follow-ups, calendar management, pipeline tracking) are exactly what OpBot automates. If your operator also closes deals on the phone, you still need a closer. But the hourly work of managing conversations, scheduling, and keeping your pipeline organized? That goes to zero. Most of our coaches keep their closer and let OpBot handle everything else.',
  },
  {
    q: "I'm already on GoHighLevel. Why switch?",
    a: 'GHL is a toolbox. OpBot is a worker. GHL gives you a blank canvas and expects you to build everything — funnels, workflows, automations, pipelines. Most coaches spend weeks setting it up and still need a VA to run it. OpBot interviews you once and builds the whole system for you. If you already have GHL wired perfectly and your VA runs it smoothly, stick with it. If you have 12 tabs open and a funnel that still isn\'t live, OpBot is the fix.',
  },
  {
    q: "What's included for $297/mo, and what costs extra?",
    a: 'Everything described on this page is included: funnel builder, CRM, calendar, email sequences, SMS automation, AI workforce (all 12+ agents), analytics, and pipeline management. SMS sending costs are pass-through at carrier rates (usually $15–50/mo depending on volume). White-label agency mode is available on a per-coach-seat basis. No per-lead fees, no revenue share, no setup fees.',
  },
  {
    q: 'How does the AI write copy that sounds like me, not a robot?',
    a: 'During onboarding, you answer 18 questions about your voice, your offer, how you talk to clients, and what you would never say. OpBot stores this in Sage (the Knowledge Library agent). Every other agent pulls from Sage when writing — so Mira\'s DMs, Maya\'s emails, and your landing page all sound like you. You can edit anything before it goes live. The voice model gets better as you approve or rewrite outputs.',
  },
  {
    q: 'White-label: what does my client actually see?',
    a: 'Your client sees your brand on every page. The dashboard, funnel pages, booking calendar, email notifications, and CRM all carry your logo and colors. They log in at a subdomain you control. OpBot is never mentioned unless you choose to reveal it. Your client\'s experience is: "My coach gave me access to their platform."',
  },
  {
    q: 'How fast can I be live?',
    a: 'DIY: about 60 seconds to sign up, ~10 minutes for the onboarding interview, and your funnel is live within 15 minutes of starting. DFY (Done-For-You): we build your entire stack within 48 hours of your onboarding call. Most coaches are live same-day on the DIY plan.',
  },
  {
    q: 'Can I bring my existing leads, Stripe, and domain?',
    a: 'Yes. Import leads via CSV (we provide a template). Stripe connects in two clicks for payment processing on your funnel. Custom domains are supported — point your DNS at OpBot and we handle SSL. You can bring your existing Calendly, but the native booking calendar is included and works better with the CRM.',
  },
  {
    q: 'Will the texting and email get me in trouble?',
    a: 'No. SMS runs on 10DLC-registered numbers with full compliance: double opt-in, clear opt-out language on every message, and automatic opt-out handling. Email sequences follow CAN-SPAM: unsubscribe link on every email, physical address in footer, honest subject lines. We built this for coaches selling high-ticket offers — compliance is table stakes, not an afterthought.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your dashboard, no phone call required. Your data is yours — export leads, emails, and analytics as CSV before you go. If you come back within 90 days, everything is exactly as you left it.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section id="faq" className="relative z-[1] bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24">
        {/* Eyebrow */}
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-indigo-500">
          FAQ
        </p>

        {/* Headline */}
        <h2 className="mt-3 text-center text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
          Honest answers, no spin.
        </h2>

        {/* FAQ accordion */}
        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white transition"
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-black">{item.q}</span>
                <span
                  className={`ml-4 flex-shrink-0 text-gray-400 transition-transform duration-200 text-lg ${
                    openIndex === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
