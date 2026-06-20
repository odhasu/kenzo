export function Hero() {
  return (
    <section style={{ textAlign: 'center', padding: '60px 22px 0', position: 'relative', zIndex: 2, maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        background: 'rgba(15,15,15,0.8)', border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)', color: 'rgba(255,255,255,0.7)',
        fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase',
        padding: '9px 18px', borderRadius: '100px', marginBottom: '36px',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>🔒</span>
        MAKE <span style={{ color: '#39FF14' }}>2026</span> YOUR BIGGEST YEAR YET
      </div>

      <h1 style={{
        fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, lineHeight: 1.1,
        letterSpacing: '-2.5px', marginBottom: '22px',
        background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        See How Regular People Are<br />
        Building{' '}
        <span style={{ position: 'relative', display: 'inline-block', margin: '0 6px', WebkitTextFillColor: '#39FF14', whiteSpace: 'nowrap' }}>
          $5K-$30K/Month
          <span style={{
            position: 'absolute', inset: '-5px -8px', background: '#1a1a1a',
            transform: 'rotate(-1.5deg)', zIndex: -1,
            clipPath: 'polygon(0% 0%, 5% 5%, 10% 0%, 15% 4%, 20% 0%, 25% 2%, 30% 0%, 35% 6%, 40% 1%, 45% 4%, 50% 0%, 55% 3%, 60% 0%, 65% 5%, 70% 1%, 75% 4%, 80% 0%, 85% 2%, 90% 0%, 95% 4%, 100% 0%, 100% 10%, 98% 20%, 100% 30%, 97% 40%, 100% 50%, 99% 60%, 100% 70%, 96% 80%, 100% 90%, 98% 100%, 95% 96%, 90% 100%, 85% 95%, 80% 100%, 75% 96%, 70% 100%, 65% 97%, 60% 100%, 55% 95%, 50% 100%, 45% 96%, 40% 100%, 35% 94%, 30% 100%, 25% 97%, 20% 100%, 15% 95%, 10% 100%, 5% 96%, 0% 100%, 2% 90%, 0% 80%, 3% 70%, 0% 60%, 2% 50%, 0% 40%, 3% 30%, 0% 20%, 2% 10%, 0% 0%)',
            boxShadow: '2px 4px 14px rgba(0,0,0,0.7)',
          }} />
        </span>{' '}
        High-<br />Ticket Reselling Businesses
      </h1>

      <p style={{ fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.48)', marginBottom: '36px', lineHeight: 1.6, letterSpacing: '-0.1px' }}>
        The Exact System 200+ Members Use to Flip Authentic Products for Profit
      </p>

      <a href="#apply" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        background: '#39FF14', color: '#000', fontWeight: 800, fontSize: '17px',
        letterSpacing: '-0.3px', padding: '20px 32px', borderRadius: '12px',
        textDecoration: 'none', width: '100%',
        boxShadow: '0 0 40px rgba(57,255,20,0.28), 0 4px 20px rgba(0,0,0,0.4)',
        marginBottom: '60px', transition: 'box-shadow 0.2s, opacity 0.15s',
      }}>
        Apply For The Inner Circle ↗
      </a>
    </section>
  )
}
