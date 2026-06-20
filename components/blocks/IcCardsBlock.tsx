import type { IcCardsProps } from '@/types/blocks'

export function IcCardsBlock({ props }: { props: IcCardsProps }) {
  return (
    <section style={{ background: '#050505', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '48px', fontSize: 'clamp(30px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-1.8px', lineHeight: 1.1, background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {props.headline}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {props.cards.map((card) => (
            <div key={card.title} style={{ paddingTop: '20px' }}>
              <span style={{ width: '16px', height: '16px', background: '#c8a96e', borderRadius: '50%', border: '3px solid #8a6a30', margin: '0 auto', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
              <div style={{ background: '#f0ece4', color: '#111', borderRadius: '12px', padding: '24px 22px 28px', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(50% + 14px) 100%, 50% calc(100% - 9px), calc(50% - 14px) 100%, 0 calc(100% - 14px))' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '8px' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: '#444', marginBottom: '14px', lineHeight: 1.5 }}>{card.desc}</p>
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '14px' }} />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', padding: 0, margin: 0 }}>
                  {card.bullets.map((b) => (
                    <li key={b} style={{ fontSize: '13px', color: '#444', display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: 1.4 }}>
                      <span style={{ color: '#111', fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a href={props.ctaHref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#39FF14', color: '#000', fontWeight: 800, fontSize: '17px', padding: '18px 40px', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 0 40px rgba(57,255,20,0.28)', letterSpacing: '-0.3px' }}>
            {props.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
