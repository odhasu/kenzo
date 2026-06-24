'use client'

import Link from 'next/link'

type Funnel = {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
}

export function FunnelCard({ funnel }: { funnel: Funnel }) {
  return (
    <Link
      href={`/dashboard/funnels/${funnel.id}/edit`}
      style={{
        display: 'block',
        borderRadius: '1rem',
        border: '1px solid #ffffee14',
        background: '#222',
        padding: '20px',
        textDecoration: 'none',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffee2e' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffee14' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 style={{
          fontSize: '14px', fontWeight: 600, color: '#ffe',
          margin: 0, fontFamily: 'inherit',
        }}>
          {funnel.name}
        </h3>
        <span style={{
          borderRadius: '100px', padding: '2px 10px', fontSize: '10px',
          fontWeight: 600,
          background: funnel.status === 'published' ? '#ffffee0f' : '#ffffee08',
          color: funnel.status === 'published' ? '#6ba0c0' : '#ffffeea6',
          border: `1px solid ${funnel.status === 'published' ? '#ffffee2e' : '#ffffee14'}`,
        }}>
          {funnel.status}
        </span>
      </div>
      <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#ffffee2e', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
        /f/{funnel.slug}
      </p>
      <p style={{ margin: 0, fontSize: '11px', color: '#ffffee2e' }}>
        {new Date(funnel.created_at).toLocaleDateString()}
      </p>
    </Link>
  )
}
