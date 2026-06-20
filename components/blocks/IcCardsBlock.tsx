import type { IcCardsProps, FunnelSettings } from '@/types/blocks'

export function IcCardsBlock({ props, settings }: { props: IcCardsProps; settings?: FunnelSettings }) {
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

  const btnStyle: React.CSSProperties = (() => {
    const style = settings?.buttonStyle ?? 'filled'
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: 800,
      fontSize: `${settings?.buttonSize === 'sm' ? '14px' : settings?.buttonSize === 'md' ? '16px' : '17px'}`,
      padding: `${settings?.buttonSize === 'sm' ? '12px 24px' : settings?.buttonSize === 'md' ? '16px 32px' : '20px 40px'}`,
      borderRadius: `${settings?.buttonRadius ?? 12}px`,
      textDecoration: 'none',
      letterSpacing: '-0.3px',
      boxShadow: (settings?.glowEnabled !== false && style === 'filled') ? '0 0 40px var(--accent-glow)' : 'none',
    }
    if (style === 'outline') {
      return { ...base, background: 'transparent', border: '2px solid var(--accent)', color: 'var(--accent)' }
    }
    if (style === 'ghost') {
      return { ...base, background: 'transparent', color: 'var(--accent)' }
    }
    return { ...base, background: 'var(--accent)', color: 'var(--bg)' }
  })()

  return (
    <section style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: `'${settings?.font || 'Inter'}', system-ui, sans-serif`, borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--section-py) 24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '48px', fontSize: `calc(clamp(30px, 6vw, 56px) * var(--font-scale))`, fontWeight: 'var(--heading-weight)', letterSpacing: 'var(--letter-spacing)', lineHeight: 1.1, ...headlineStyle }}>
          {props.headline}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {props.cards.map((card) => (
            <div key={card.title} style={{ paddingTop: '20px' }}>
              <span style={{ width: '16px', height: '16px', background: '#c8a96e', borderRadius: '50%', border: '3px solid #8a6a30', margin: '0 auto', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
              <div style={{ background: 'var(--card)', color: 'var(--card-text)', borderRadius: '12px', padding: '24px 22px 28px', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(50% + 14px) 100%, 50% calc(100% - 9px), calc(50% - 14px) 100%, 0 calc(100% - 14px))' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '8px' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--card-text)', opacity: 0.65, marginBottom: '14px', lineHeight: 1.5 }}>{card.desc}</p>
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '14px' }} />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', padding: 0, margin: 0 }}>
                  {card.bullets.map((b) => (
                    <li key={b} style={{ fontSize: '13px', color: 'var(--card-text)', opacity: 0.65, display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: 1.4 }}>
                      <span style={{ color: 'var(--card-text)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a href={props.ctaHref} style={btnStyle}>
            {props.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
