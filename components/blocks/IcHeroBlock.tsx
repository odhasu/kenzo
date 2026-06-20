import type { IcHeroProps } from '@/types/blocks'

export function IcHeroBlock({ props }: { props: IcHeroProps }) {
  return (
    <section style={{ textAlign: 'center', padding: '60px 22px 40px', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--surface)', border: '1px solid var(--border-strong)', backdropFilter: 'blur(12px)', color: 'var(--text-muted)', fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', padding: '9px 18px', borderRadius: '100px', marginBottom: '36px' }}>
          <span style={{ color: 'var(--text-muted)' }}>🔒</span>
          {props.badge}
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2.5px', marginBottom: '22px', background: 'linear-gradient(to bottom, var(--text) 30%, var(--text-muted) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {props.headline}
        </h1>

        <p style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-muted)', marginBottom: '36px', lineHeight: 1.6 }}>
          {props.subtext}
        </p>

        <a href={props.ctaHref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent)', color: 'var(--bg)', fontWeight: 800, fontSize: '17px', letterSpacing: '-0.3px', padding: '20px 40px', borderRadius: 'var(--radius)', textDecoration: 'none', boxShadow: '0 0 40px var(--accent-glow), 0 4px 20px rgba(0,0,0,0.4)', transition: 'opacity 0.15s' }}>
          {props.ctaLabel}
        </a>
      </div>
    </section>
  )
}
