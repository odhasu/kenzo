import type { IcApplyProps } from '@/types/blocks'
import { ApplyForm } from '@/components/innercircle/ApplyForm'

export function IcApplyBlock({ props }: { props: IcApplyProps }) {
  return (
    <section id="apply" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', system-ui, sans-serif", borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '80px 20px 100px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: 'clamp(30px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-1.8px', lineHeight: 1.1, background: 'linear-gradient(to bottom, var(--text) 30%, var(--text-muted) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {props.headline}
        </h2>
        <div style={{ width: '60px', height: '3px', background: 'var(--accent)', margin: '0 auto 16px', borderRadius: '2px', boxShadow: '0 0 12px var(--accent-glow)' }} />
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px', marginBottom: '36px' }}>
          {props.subtext}
        </p>
        <ApplyForm />
      </div>
    </section>
  )
}
