'use client'

import Link from 'next/link'

export function CreateFunnelButton() {
  return (
    <Link
      href="/create"
      style={{
        background: '#39FF14',
        color: '#000',
        fontWeight: 700,
        fontSize: '13px',
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        letterSpacing: '-0.2px',
        boxShadow: '0 0 20px rgba(57,255,20,0.2)',
        transition: 'all 0.15s',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 25px rgba(57,255,20,0.35)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 20px rgba(57,255,20,0.2)')}
    >
      + New funnel
    </Link>
  )
}
