export function BottomCTA() {
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '20px 20px 24px', position: 'relative', zIndex: 2 }}>
      <a href="#apply" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        background: '#39FF14', color: '#000', fontWeight: 800, fontSize: '17px',
        padding: '20px 28px', borderRadius: '12px', textDecoration: 'none', width: '100%',
        boxShadow: '0 0 40px rgba(57,255,20,0.28)', letterSpacing: '-0.3px', marginBottom: '10px',
      }}>
        Join The Inner Circle ↗
      </a>
      <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
        Start your journey to $10K/month
      </p>
    </div>
  )
}
