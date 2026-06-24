'use client'

import { useState, useEffect } from 'react'

const TARGET_DATE = new Date('2026-07-15T12:00:00')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(): TimeLeft {
  const now = Date.now()
  const diff = Math.max(0, TARGET_DATE.getTime() - now)
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function WaitlistHero() {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Time + mounted are client-only (Date.now differs from the server); set post-mount to avoid a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    setTime(calcTimeLeft())
    setMounted(true)
    /* eslint-enable react-hooks/set-state-in-effect */
    const interval = setInterval(() => setTime(calcTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const closed = mounted && time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0

  return (
    <section className="relative z-10 flex flex-col items-center px-6 pt-16 pb-28 text-center">
      {/* Subtle radial glow behind timer */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
        <div
          className="mt-12 h-[500px] w-[700px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #39ff14 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
          style={{ borderColor: 'rgba(57,255,20,0.2)', color: '#39ff14' }}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#39ff14' }} />
          The Inner Circle
        </div>

        {/* H1 */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.05]">
          {closed ? 'The Inner Circle Is Now Closed' : 'The Inner Circle Opens Soon'}
        </h1>

        {/* Sub */}
        <p className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
          style={{ color: '#9ca3af' }}>
          {closed
            ? 'We are currently at capacity. Join the waitlist below to be first in line when doors reopen.'
            : 'Join 200+ members building $5K–$30K/month high-ticket reselling businesses. Doors close when the timer hits zero.'}
        </p>

        {/* Countdown */}
        <div className="mt-10 flex items-center gap-3 sm:gap-4">
          {([
            { value: pad(time.days), label: 'Days' },
            { value: pad(time.hours), label: 'Hours' },
            { value: pad(time.minutes), label: 'Minutes' },
            { value: pad(time.seconds), label: 'Seconds' },
          ] as const).map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
              {i > 0 && (
                <span className="text-3xl sm:text-4xl font-light" style={{ color: '#39ff14' }}>:</span>
              )}
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center rounded-xl text-4xl sm:text-5xl md:text-6xl font-bold tabular-nums tracking-tight"
                  style={{
                    background: 'rgba(57,255,20,0.06)',
                    border: '1px solid rgba(57,255,20,0.15)',
                    color: '#ffffff',
                    minWidth: '80px',
                    padding: '16px 8px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {mounted ? unit.value : '--'}
                </div>
                <span className="mt-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#6b7280' }}>
                  {unit.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Target date */}
        <p className="mt-6 text-sm" style={{ color: '#6b7280' }}>
          {closed ? 'Doors closed on' : 'Doors close on'}{' '}
          <span style={{ color: '#39ff14', fontWeight: 600 }}>
            {TARGET_DATE.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </p>
      </div>
    </section>
  )
}
