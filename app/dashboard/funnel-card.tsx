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
    <Link href={`/dashboard/funnels/${funnel.id}/edit`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: 'rgba(15,15,15,0.8)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          padding: '20px',
          transition: 'border-color 0.15s, transform 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(57,255,20,0.3)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>{funnel.name}</h3>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px',
            background: funnel.status === 'published' ? 'rgba(57,255,20,0.12)' : 'rgba(255,255,255,0.06)',
            color: funnel.status === 'published' ? '#39FF14' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${funnel.status === 'published' ? 'rgba(57,255,20,0.25)' : 'rgba(255,255,255,0.08)'}`,
          }}>
            {funnel.status}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>/f/{funnel.slug}</p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
          {new Date(funnel.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}
