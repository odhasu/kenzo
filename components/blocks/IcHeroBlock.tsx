import type { IcHeroProps, FunnelSettings } from '@/types/blocks'

export function IcHeroBlock({ props, settings }: { props: IcHeroProps; settings?: FunnelSettings }) {
  const gradientOn = settings?.gradientHeadlines !== false
  const glassOn = settings?.glassmorphism === true

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

  const btnStyle: React.CSSProperties = (() => {
    const style = settings?.buttonStyle ?? 'filled'
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: 800,
      fontSize: `calc(${settings?.buttonSize === 'sm' ? '14px' : settings?.buttonSize === 'md' ? '16px' : '17px'} * var(--font-scale))`,
      letterSpacing: '-0.3px',
      padding: `${settings?.buttonSize === 'sm' ? '12px 24px' : settings?.buttonSize === 'md' ? '16px 32px' : '20px 40px'}`,
      borderRadius: `${settings?.buttonRadius ?? 12}px`,
      textDecoration: 'none',
      transition: 'opacity 0.15s',
      boxShadow: (settings?.glowEnabled !== false && style === 'filled') ? '0 0 40px var(--accent-glow), 0 4px 20px rgba(0,0,0,0.4)' : 'none',
    }
    if (style === 'outline') {
      return { ...base, background: 'transparent', border: '2px solid var(--accent)', color: 'var(--accent)' }
    }
    if (style === 'ghost') {
      return { ...base, background: 'transparent', color: 'var(--accent)' }
    }
    // filled
    return { ...base, background: 'var(--accent)', color: 'var(--bg)' }
  })()

  return (
    <section style={{ textAlign: 'center', padding: 'var(--section-py) 24px', background: 'var(--bg)', color: 'var(--text)', fontFamily: `'${settings?.font || 'Inter'}', system-ui, sans-serif` }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--surface)', border: '1px solid var(--border-strong)', backdropFilter: glassOn ? 'blur(12px)' : 'none', color: 'var(--text-muted)', fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', padding: '9px 18px', borderRadius: '100px', marginBottom: '36px' }}>
          <span style={{ color: 'var(--text-muted)' }}>🔒</span>
          {props.badge}
        </div>

        <h1 style={{ fontSize: `calc(clamp(32px, 5.5vw, 64px) * var(--font-scale))`, fontWeight: 'var(--heading-weight)', lineHeight: 1.1, letterSpacing: 'var(--letter-spacing)', marginBottom: '22px', ...headlineStyle }}>
          {props.headline}
        </h1>

        <p style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-muted)', marginBottom: '36px', lineHeight: 1.6 }}>
          {props.subtext}
        </p>

        <a href={props.ctaHref} style={btnStyle}>
          {props.ctaLabel}
        </a>
      </div>
    </section>
  )
}
