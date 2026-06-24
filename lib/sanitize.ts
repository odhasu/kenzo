// HTML sanitizer for code blocks on the published funnel page.
// Editor preview renders raw HTML fully (scripts allowed).
// Published /f/[slug] uses DOMPurify (vetted) + iframe host whitelist.
// Works in both Node server (app/f/[slug]) and browser (CodeBlock client component).

import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_IFRAME_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com',
  'calendly.com',
  'typeform.com',
]

function hostAllowed(src: string): boolean {
  try {
    const host = new URL(src).hostname.toLowerCase()
    return ALLOWED_IFRAME_HOSTS.some(h => host === h || host.endsWith('.' + h))
  } catch {
    return false
  }
}

export function sanitizeHtml(html: string): string {
  // 1. Vetted sanitize. Allow iframes but never srcdoc; force https/src only.
  const clean = DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    FORBID_TAGS: ['script', 'object', 'embed', 'base', 'form'],
    FORBID_ATTR: ['srcdoc'],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
  })

  // 2. Post-pass: drop any iframe whose src host is not whitelisted.
  if (typeof window === 'undefined') {
    // Server: regex post-filter (no DOM)
    return clean.replace(/<iframe\b[^>]*>(?:[\s\S]*?<\/iframe>)?/gi, (m) => {
      const src = m.match(/\bsrc\s*=\s*"([^"]*)"/i)?.[1] ?? ''
      return hostAllowed(src) ? m : '<!-- iframe removed -->'
    })
  }

  // Client: DOM post-filter
  const doc = new DOMParser().parseFromString(clean, 'text/html')
  doc.querySelectorAll('iframe').forEach(f => {
    if (!hostAllowed(f.getAttribute('src') ?? '')) f.remove()
  })
  return doc.body.innerHTML
}
