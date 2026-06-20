import type { IcHeroProps } from '@/types/blocks'

export function IcHeroBlock({ props }: { props: IcHeroProps }) {
  return (
    <section style={{ textAlign: 'center', padding: '60px 22px 40px', background: '#050505', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(15,15,15,0.8)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', padding: '9px 18px', borderRadius: '100px', marginBottom: '36px' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>🔒</span>
          {props.badge}
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2.5px', marginBottom: '22px', background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {props.headline}
        </h1>

        <p style={{ fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.48)', marginBottom: '36px', lineHeight: 1.6 }}>
          {props.subtext}
        </p>

        <a href={props.ctaHref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#39FF14', color: '#000', fontWeight: 800, fontSize: '17px', letterSpacing: '-0.3px', padding: '20px 40px', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 0 40px rgba(57,255,20,0.28), 0 4px 20px rgba(0,0,0,0.4)', transition: 'opacity 0.15s' }}>
          {props.ctaLabel}
        </a>
      </div>
    </section>
  )
}
