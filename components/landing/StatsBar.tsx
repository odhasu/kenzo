'use client'

import { useState, useEffect, useRef } from 'react'

const STATS = [
  { value: 1, suffix: '', label: 'platform — replaces 12+ tools' },
  { value: 12, suffix: '+', label: 'AI agents — working for you 24/7' },
  { value: 0, suffix: '', label: 'Minutes to live — not 2 to 4 weeks', format: 'minutes' },
  { value: 297, prefix: '$', suffix: '/mo flat — no per-seat traps' },
]

function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2000,
  format,
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  format?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || started.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * value))
            if (progress < 1) requestAnimationFrame(animate)
            else setCount(value)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {prefix}{format === 'minutes' ? 'Minutes' : count}{suffix}
    </span>
  )
}

export function StatsBar() {
  return (
    <section className="relative z-[1] border-y border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  format={stat.format}
                />
              </p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
