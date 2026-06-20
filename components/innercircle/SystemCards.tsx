'use client';

const CARDS = [
  {
    title: 'Source The Deals',
    desc: 'Access my private vendors for untapped products at wholesale prices.',
    bullets: [
      'OEM vendors that pass StockX authentication.',
      'High-ticket items with guaranteed margins.',
      'Skip the middlemen & source direct.',
    ],
  },
  {
    title: 'Sell With Confidence',
    desc: '100% authentic OEM products — no replicas, no legal trouble, no bans.',
    bullets: [
      'Pass authentication on StockX & GOAT every time.',
      'Zero customer complaints — happy buyers, easy sales.',
      'Never worry about account bans or legal issues.',
    ],
  },
  {
    title: 'Scale To $10K+/Month',
    desc: 'Get a custom action plan built for your situation to hit $10K/month.',
    bullets: [
      '1-on-1 onboarding call with Oscar to map your path.',
      'Weekly group calls — get your questions answered live.',
      'Skool & Discord community with 200+ active members.',
      '10+ hours of training — learn at your own pace.',
    ],
  },
];

export function SystemCards() {
  return (
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '48px',
          fontSize: 'clamp(30px, 6vw, 56px)',
          fontWeight: 900,
          letterSpacing: '-1.8px',
          lineHeight: 1.1,
          background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        My Exact 3-Step System to{' '}
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            margin: '0 6px',
            WebkitTextFillColor: '#39FF14',
          }}
        >
          $10K/Month
        </span>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {CARDS.map((card) => (
          <div
            key={card.title}
            style={{
              paddingTop: '20px',
              transition: 'transform 0.25s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)')}
          >
            <span
              style={{
                width: '16px',
                height: '16px',
                background: '#c8a96e',
                borderRadius: '50%',
                border: '3px solid #8a6a30',
                margin: '0 auto',
                display: 'block',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            />
            <div
              style={{
                background: '#f0ece4',
                color: '#111',
                borderRadius: '12px',
                padding: '24px 22px 28px',
                clipPath:
                  'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(50% + 14px) 100%, 50% calc(100% - 9px), calc(50% - 14px) 100%, 0 calc(100% - 14px))',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginBottom: '8px',
                }}
              >
                {card.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#444', marginBottom: '14px', lineHeight: 1.5 }}>
                {card.desc}
              </p>
              <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '14px' }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {card.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      fontSize: '13px',
                      color: '#444',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      lineHeight: 1.4,
                    }}
                  >
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
        <a
          href="#apply"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#39FF14',
            color: '#000',
            fontWeight: 800,
            fontSize: '17px',
            padding: '18px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
            boxShadow: '0 0 40px rgba(57,255,20,0.28)',
            letterSpacing: '-0.3px',
            transition: 'box-shadow 0.2s, opacity 0.15s',
          }}
        >
          Apply For The Inner Circle ↗
        </a>
      </div>
    </section>
  );
}
