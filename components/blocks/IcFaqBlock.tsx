'use client'

import { useState } from 'react'
import type { IcFaqProps } from '@/types/blocks'

export function IcFaqBlock({ props }: { props: IcFaqProps }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ background: '#050505', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: 'clamp(30px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-1.8px', lineHeight: 1.1, background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {props.headline}
        </h2>

        {props.items.map((item, i) => (
          <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ border: `1px solid ${open === i ? 'rgba(57,255,20,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '10px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', fontSize: '16px', fontWeight: 700, userSelect: 'none', letterSpacing: '-0.2px' }}>
              {item.q}
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: open === i ? 'rgba(57,255,20,0.14)' : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, color: open === i ? '#39FF14' : 'rgba(255,255,255,0.45)', transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s, background 0.15s, color 0.15s' }}>
                +
              </span>
            </div>
            <div style={{ maxHeight: open === i ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease', fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, padding: open === i ? '0 22px 20px' : '0 22px' }}>
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
