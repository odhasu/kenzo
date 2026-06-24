'use client'

import type { CodeProps } from '@/types/blocks'

/**
 * Renders a raw code block. Trust level set by render context:
 * - Editor preview: trusted=true — full render including inline JS
 * - Published page: trusted=false — sanitized (scripts stripped)
 */
export function CodeBlock({ props, trusted }: {
  props: CodeProps
  trusted?: boolean
}) {
  if (trusted) {
    return <div dangerouslySetInnerHTML={{ __html: props.html }} />
  }

  // For untrusted (published) context, sanitize inline.
  // The page-level sanitizer in app/f/[slug] also runs; this is defense in depth.
  let html = props.html

  // Strip script tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Strip inline event handlers
  html = html.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
  // Strip javascript: URLs
  html = html.replace(/(?:href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"')

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
