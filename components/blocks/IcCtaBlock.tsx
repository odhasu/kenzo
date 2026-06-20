import type { IcCtaProps } from '@/types/blocks'

export function IcCtaBlock({ props }: { props: IcCtaProps }) {
  return (
    <section style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', system-ui, sans-serif", borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px 60px' }}>
        <a href={props.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent)', color: 'var(--bg)', fontWeight: 800, fontSize: '17px', padding: '20px 28px', borderRadius: 'var(--radius)', textDecoration: 'none', width: '100%', boxShadow: '0 0 40px var(--accent-glow)', letterSpacing: '-0.3px', marginBottom: '10px', boxSizing: 'border-box' }}>
          {props.label}
        </a>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-dim)', marginTop: '10px' }}>
          {props.subtext}
        </p>
      </div>
    </section>
  )
}
