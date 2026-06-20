'use client'

import { useState } from 'react'
import type { IcFaqProps, FunnelSettings } from '@/types/blocks'

export function IcFaqBlock({ props, settings }: { props: IcFaqProps; settings?: FunnelSettings }) {
  const [open, setOpen] = useState<number | null>(null)
  const gradientOn = settings?.gradientHeadlines !== false

  const headlineStyle: React.CSSProperties = gradientOn
    ? {
        background: 'linear-gradient(to bottom, var(--text) 30%, var(--text-muted) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : {
        color: 'var(--text)',
      }

  return (
    <section style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: `'${settings?.font || 'Inter'}', system-ui, sans-serif`, borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--section-py) 24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: `calc(clamp(30px, 6vw, 56px) * var(--font-scale))`, fontWeight: 'var(--heading-weight)', letterSpacing: 'var(--letter-spacing)', lineHeight: 1.1, ...headlineStyle }}>
          {props.headline}
        </h2>

        {props.items.map((item, i) => (
          <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ border: `1px solid ${open === i ? 'var(--accent-dim)' : 'var(--border)'}`, borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '10px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', fontSize: '16px', fontWeight: 700, userSelect: 'none', letterSpacing: '-0.2px' }}>
              {item.q}
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: open === i ? 'var(--accent-dim)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, color: open === i ? 'var(--accent)' : 'var(--text-muted)', transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s, background 0.15s, color 0.15s' }}>
                +
              </span>
            </div>
            <div style={{ maxHeight: open === i ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, padding: open === i ? '0 22px 20px' : '0 22px' }}>
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
