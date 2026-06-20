import type { IcApplyProps, FunnelSettings } from '@/types/blocks'
import { ApplyForm } from '@/components/innercircle/ApplyForm'

export function IcApplyBlock({ props, settings }: { props: IcApplyProps; settings?: FunnelSettings }) {
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
    <section id="apply" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: `'${settings?.font || 'Inter'}', system-ui, sans-serif`, borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--section-py) 24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: `calc(clamp(30px, 6vw, 56px) * var(--font-scale))`, fontWeight: 'var(--heading-weight)', letterSpacing: 'var(--letter-spacing)', lineHeight: 1.1, ...headlineStyle }}>
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
