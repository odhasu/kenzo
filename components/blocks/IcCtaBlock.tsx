import type { IcCtaProps } from '@/types/blocks'

export function IcCtaBlock({ props }: { props: IcCtaProps }) {
  return (
    <section style={{ background: '#050505', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px 60px' }}>
        <a href={props.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#39FF14', color: '#000', fontWeight: 800, fontSize: '17px', padding: '20px 28px', borderRadius: '12px', textDecoration: 'none', width: '100%', boxShadow: '0 0 40px rgba(57,255,20,0.28)', letterSpacing: '-0.3px', marginBottom: '10px', boxSizing: 'border-box' }}>
          {props.label}
        </a>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '10px' }}>
          {props.subtext}
        </p>
      </div>
    </section>
  )
}
