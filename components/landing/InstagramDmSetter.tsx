'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  sender: 'jordan' | 'mira'
  text: string
  tag?: string
  chip?: string
  delay: number
}

const CONVERSATION: Message[] = [
  { sender: 'jordan', text: 'Hey! Saw your content about scaling consulting businesses. Do you work with solo consultants or just agencies?', delay: 0 },
  { sender: 'mira', text: 'Hey Jordan! We work with both actually. Are you consulting full-time right now? 😊', delay: 1500, tag: 'Mira drafted · sent on approval' },
  { sender: 'jordan', text: 'Yeah, full-time for about 3 years now. Mostly strategy work with SaaS founders. Looking to add a few more clients this quarter.', delay: 2000 },
  { sender: 'mira', text: 'That\'s exactly who we help. Our coaches typically add 3-5 clients in the first 60 days. Want me to send over a case study from someone in a similar space?', delay: 2000, tag: 'Mira drafted · sent on approval' },
  { sender: 'jordan', text: 'Yes please. And do you have availability for a quick call this week?', delay: 2000 },
  { sender: 'mira', text: 'Of course! How\'s Thursday at 2:00 PM? I\'ll send the case study now and we can walk through the full platform on the call.', delay: 2000, tag: 'Mira drafted · sent on approval' },
  { sender: 'jordan', text: 'Thursday 2pm works. Talk then!', delay: 1500 },
]

export function InstagramDmSetter() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [showChip, setShowChip] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || started.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          // Animate messages sequentially
          let totalDelay = 0
          CONVERSATION.forEach((_, i) => {
            totalDelay += CONVERSATION[i].delay + 800
            setTimeout(() => setVisibleMessages(i + 1), totalDelay)
          })
          // Show chip after last message
          setTimeout(() => setShowChip(true), totalDelay + 1000)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative z-[1] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          {/* Left — text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
              Instagram DM setter
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl leading-[1.1]">
              A setter that works your DMs while you sleep.
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Mira monitors your Instagram inbox 24/7. She qualifies leads, answers questions,
              sends case studies, and books calls directly onto your calendar. Every message is
              drafted for your approval — you tap send, or set her to auto-pilot.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                'Qualifies leads using your criteria from the onboarding interview',
                'Drafts every reply in your voice — you approve or auto-send',
                'Books calls directly into your calendar, no back-and-forth',
                'Learns from every conversation. Replies get better over time',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 text-indigo-500">•</span>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — animated chat */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
            {/* IG-style header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                J
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Jordan</p>
                <p className="text-[10px] text-gray-400">Instagram · Active now</p>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3 min-h-[300px]">
              {CONVERSATION.slice(0, visibleMessages).map((msg, i) => (
                <div key={i}>
                  <div
                    className={`flex ${msg.sender === 'jordan' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-fade-in ${
                        msg.sender === 'jordan'
                          ? 'bg-white border border-gray-200 text-gray-800'
                          : 'bg-indigo-600 text-white'
                      }`}
                      style={{ animationDelay: '0ms', animationDuration: '400ms' }}
                    >
                      {msg.text}
                    </div>
                  </div>
                  {msg.tag && (
                    <p className="mt-1 text-right text-[10px] text-indigo-400 font-medium">
                      {msg.tag}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Final chip */}
            {showChip && (
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 animate-fade-in">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Call booked · Thursday 2:00 PM · added to your calendar
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
