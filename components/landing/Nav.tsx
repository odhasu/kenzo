'use client'

import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Workforce', href: '#workforce' },
  { label: 'Packages', href: '#what-you-get' },
  { label: 'Agencies', href: '#agency' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? 'border-b border-gray-200/60 bg-white/80 backdrop-blur-xl shadow-sm'
          : 'border-b border-transparent bg-white/60 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-black">OpBot</span>
        </a>

        {/* Center links — desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="hidden text-sm font-medium text-gray-500 transition-colors hover:text-black sm:inline"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Sign up
          </a>
          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-gray-600 transition-colors hover:text-black"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block py-2 text-sm font-medium text-gray-600 transition-colors hover:text-black sm:hidden"
          >
            Log in
          </a>
        </div>
      )}
    </header>
  )
}
