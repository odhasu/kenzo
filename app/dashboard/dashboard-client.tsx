'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Funnel = {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
}

export function DashboardClient({ firstName, funnels }: { firstName: string; funnels: Funnel[] }) {
  const router = useRouter()
  const [aiPrompt, setAiPrompt] = useState('')

  const activeCount = funnels.filter(f => f.status !== 'paused').length

  function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!aiPrompt.trim()) return
    router.push(`/dashboard?ai=${encodeURIComponent(aiPrompt.trim())}`)
    setAiPrompt('')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111',
        color: '#ffe',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Top section: greeting + stats */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffe',
                margin: '0 0 6px',
                fontFamily: "'Lora', Georgia, serif",
                lineHeight: 1.3,
              }}
            >
              Hi, {firstName} — Let&apos;s build.
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#ffffeea6' }}>
              You don&apos;t have time to chase leads.
            </p>
          </div>

          {/* Stats badge */}
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: '0.75rem',
              border: '1px solid #ffffff14',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffe', lineHeight: 1.2 }}>
                {activeCount}
              </div>
              <div style={{ fontSize: '12px', color: '#ffffeea6' }}>
                Active Funnels
              </div>
            </div>
            <select
              style={{
                background: '#ffffff0a',
                border: '1px solid #ffffff14',
                borderRadius: '0.5rem',
                color: '#ffffeea6',
                fontSize: '11px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <option>All funnels</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Paused</option>
            </select>
          </div>
        </div>

        {/* AI — New funnel card */}
        <Link
          href="/dashboard/templates"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px 24px',
            borderRadius: '1rem',
            border: '1px solid #ffffff14',
            background: '#1a1a1a',
            textDecoration: 'none',
            marginBottom: '28px',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff2e' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff14' }}
        >
          {/* Quote icon */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.75rem',
              background: '#ffffff0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffeea6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#ffe', marginBottom: '2px' }}>
              AI — New funnel
            </div>
            <div style={{ fontSize: '13px', color: '#ffffeea6' }}>
              Choose a template or describe your funnel
            </div>
          </div>

          {/* Chat bubble */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#ffffff0f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffeea6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </Link>

        {/* Funnel list */}
        {funnels.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#ffffeea6',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Your funnels
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {funnels.map(funnel => (
                <Link
                  key={funnel.id}
                  href={`/dashboard/funnels/${funnel.id}/edit`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    borderRadius: '0.75rem',
                    border: '1px solid #ffffff14',
                    background: '#1a1a1a',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff2e' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff14' }}
                >
                  {/* Page icon */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '0.5rem',
                      background: '#ffffff0a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#ffffeea6',
                    }}
                  >
                    1
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#ffe' }}>
                      {funnel.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#ffffee2e', fontFamily: "'SF Mono', 'Fira Code', monospace", marginTop: '2px' }}>
                      /f/{funnel.slug}
                    </div>
                  </div>

                  {funnel.status === 'paused' && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#ffffeea6',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: '#ffffff0a',
                        border: '1px solid #ffffff14',
                      }}
                    >
                      ⏸ PAUSED
                    </span>
                  )}
                  {funnel.status === 'published' && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#4ade80',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: '#4ade8010',
                      }}
                    >
                      LIVE
                    </span>
                  )}
                  {funnel.status === 'draft' && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#ffffeea6',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: '#ffffff0a',
                        border: '1px solid #ffffff14',
                      }}
                    >
                      DRAFT
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {funnels.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '1rem',
              border: '1px dashed #ffffff14',
              background: '#1a1a1a',
              padding: '48px 24px',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
            <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#ffe' }}>
              No funnels yet
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#ffffeea6' }}>
              Pick a template to create your first funnel
            </p>
            <Link
              href="/dashboard/templates"
              style={{
                padding: '10px 24px',
                borderRadius: '0.5rem',
                background: '#ffe',
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'inherit',
              }}
            >
              + New funnel
            </Link>
          </div>
        )}

        {/* Build with AI bar */}
        <form
          onSubmit={handleAiSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: '0.75rem',
            border: '1px solid #ffffff14',
            background: '#1a1a1a',
          }}
        >
          <input
            type="text"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Build with AI — describe your funnel..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#ffe',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!aiPrompt.trim()}
            style={{
              padding: '6px 16px',
              borderRadius: '0.5rem',
              border: 'none',
              background: aiPrompt.trim() ? '#ffe' : '#ffffff14',
              color: aiPrompt.trim() ? '#1a1a1a' : '#ffffee2e',
              fontSize: '12px',
              fontWeight: 600,
              cursor: aiPrompt.trim() ? 'pointer' : 'default',
              fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  )
}
