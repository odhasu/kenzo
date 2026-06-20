export function InnercircleFooter() {
  return (
    <footer style={{ textAlign: 'center', padding: '32px 24px 28px', position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.18)', marginBottom: '14px' }}>
        © 2026 OGs Inner Circle. All Rights Reserved.
      </p>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.28)', fontSize: '12px', fontWeight: 600,
        padding: '8px 18px', borderRadius: '100px',
      }}>
        ⚡ Built with Kenzo
      </span>
    </footer>
  )
}
