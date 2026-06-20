export function Community() {
  return (
    <section style={{ maxWidth: '780px', margin: '0 auto', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#39FF14', marginBottom: '14px' }}>
        Community
      </div>
      <h2 style={{
        textAlign: 'center', marginBottom: '14px',
        fontSize: 'clamp(30px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-1.8px', lineHeight: 1.1,
        background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        Join The <span style={{ WebkitTextFillColor: '#39FF14' }}>Community</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '15px', lineHeight: 1.5, maxWidth: '480px', margin: '0 auto 32px' }}>
        Connect with members, share wins, and get help 24/7 in our Discord.
      </p>
      <div style={{ textAlign: 'center' }}>
        <a href="https://discord.gg/w73SU3TcMG" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: '#39FF14', color: '#000', fontWeight: 800, fontSize: '17px',
          padding: '18px 40px', borderRadius: '12px', textDecoration: 'none',
          boxShadow: '0 0 40px rgba(57,255,20,0.28)', letterSpacing: '-0.3px',
        }}>
          Join The Community ↗
        </a>
      </div>
    </section>
  )
}
