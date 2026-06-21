'use client'

import { useEffect } from 'react'

interface FunnelBeaconProps {
  funnelId: string
  slug: string
}

/**
 * Client-side beacon that fires a view event on load and captures
 * Core Web Vitals (LCP, CLS, INP) via web-vitals when available.
 * Must be rendered inside a 'use client' boundary.
 */
export function FunnelBeacon({ funnelId, slug }: FunnelBeaconProps) {
  useEffect(() => {
    // ── View event ──────────────────────────────────────────────────
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        funnel_id: funnelId,
        event_type: 'view',
        path: `/f/${slug}`,
      }),
    }).catch(() => {
      // Silent fail — beacon should never break the page
    })

    // ── Web Vitals ──────────────────────────────────────────────────
    // Dynamic import of web-vitals to avoid bundling for all users
    const reportVital = (vital: string, value: number) => {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnel_id: funnelId,
          event_type: 'web_vital',
          path: `/f/${slug}`,
          value: Math.round(value),
          metadata: { vital, rating: getRating(vital, value) },
        }),
      }).catch(() => {})
    }

    const getRating = (vital: string, value: number): string => {
      switch (vital) {
        case 'LCP':
          return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
        case 'CLS':
          return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
        case 'INP':
          return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor'
        default:
          return 'unknown'
      }
    }

    // Use PerformanceObserver for LCP
    try {
      let lcpValue = 0
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (entries.length > 0) {
          lcpValue = entries[entries.length - 1].startTime
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

      // Report LCP on page hide / unload
      const reportLCP = () => {
        if (lcpValue > 0) reportVital('LCP', lcpValue)
      }
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') reportLCP()
      })
      window.addEventListener('pagehide', reportLCP)
    } catch {
      // PerformanceObserver not supported
    }

    // Use PerformanceObserver for CLS
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as LayoutShiftEntry
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value
          }
        }
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })

      const reportCLS = () => {
        if (clsValue > 0) reportVital('CLS', clsValue)
      }
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') reportCLS()
      })
      window.addEventListener('pagehide', reportCLS)
    } catch {
      // PerformanceObserver not supported
    }

    // Use PerformanceObserver for INP (Interaction to Next Paint)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // interactionId is a newer field on PerformanceEventTiming
          const eventEntry = entry as PerformanceEventTiming & { interactionId?: number }
          if (eventEntry.interactionId) {
            reportVital('INP', eventEntry.duration)
          }
        }
      })
      // durationThreshold is a newer option in PerformanceObserverInit
      inpObserver.observe({ type: 'event', buffered: true } as PerformanceObserverInit)
    } catch {
      // PerformanceObserver not supported
    }
  }, [funnelId, slug])

  return null // Invisible
}

// Type augmentation for LayoutShift
interface LayoutShiftEntry extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}
