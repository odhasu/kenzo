import type { IcCtaProps, FunnelSettings } from '@/types/blocks'

export function IcCtaBlock({ props, settings }: { props: IcCtaProps; settings?: FunnelSettings }) {
  const borderTopStyle = { borderTop: '1px solid var(--border)' }

  const btnStyle: React.CSSProperties = (() => {
    const style = settings?.buttonStyle ?? 'filled'
    const base: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: 800,
      fontSize: `${settings?.buttonSize === 'sm' ? '14px' : settings?.buttonSize === 'md' ? '16px' : '17px'}`,
      padding: `${settings?.buttonSize === 'sm' ? '12px 24px' : settings?.buttonSize === 'md' ? '16px 32px' : '20px 40px'}`,
      borderRadius: `${settings?.buttonRadius ?? 12}px`,
      textDecoration: 'none',
      width: '100%',
      letterSpacing: '-0.3px',
      marginBottom: '10px',
      boxSizing: 'border-box' as const,
      boxShadow: (settings?.glowEnabled !== false && style === 'filled') ? '0 0 40px var(--accent-glow)' : 'none',
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
    <section style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: `'${settings?.font || 'Inter'}', system-ui, sans-serif`, ...borderTopStyle }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--section-py) 24px' }}>
        <a href={props.href} style={btnStyle}>
          {props.label}
        </a>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-dim)', marginTop: '10px' }}>
          {props.subtext}
        </p>
      </div>
    </section>
  )
}
