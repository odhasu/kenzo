'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const QUICK_LINKS = [
  { label: 'Docs', href: '#' },
  { label: 'Discord', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Affiliates', href: '#' },
  { label: 'Terms', href: '#' },
]

export function DashboardSidebar({ firstName }: { firstName: string }) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '260px',
        background: '#0d0d0d',
        borderRight: '1px solid #ffffee14',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 20px 0' }}>
        <Link
          href="/dashboard"
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#ffe',
            textDecoration: 'none',
            fontFamily: "'Lora', Georgia, serif",
          }}
        >
          Kenzo
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#ffe',
            textDecoration: 'none',
            background: isActive('/dashboard') ? '#ffffee1f' : 'transparent',
            transition: 'background 0.15s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l6-4 6 4v8H2V6z" />
            <path d="M6 14V9h4v5" />
          </svg>
          Home
        </Link>
      </nav>

      {/* Quick links */}
      <div style={{ padding: '20px 20px', flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#ffffee2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Quick links
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {QUICK_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                display: 'block',
                padding: '4px 0',
                fontSize: '13px',
                color: '#ffffeea6',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffe' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#ffffeea6' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* User row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid #ffffee14',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#ffffee1f',
              color: '#ffe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {firstName.charAt(0)}
          </div>
          <span style={{ fontSize: '13px', color: '#ffe', fontWeight: 500 }}>
            {firstName}
          </span>
        </div>
        <button
          type="button"
          aria-label="Toggle theme"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffeea6',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => {
            // Theme toggle placeholder
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1v1M8 14v1M3.05 3.05l.7.7M12.25 12.25l.7.7M1 8h1M14 8h1M3.05 12.95l.7-.7M12.25 3.75l.7-.7" />
          </svg>
        </button>
      </div>
    </aside>
  )
}
