# Multi-Style Funnel Template System — Design Spec

**Date:** 2026-06-20
**Status:** Approved (architecture), pending implementation plan
**Owner:** Oscar

## Goal

Turn the builder from a single hardcoded funnel style (the dark/green "Inner Circle"
reselling page) into a multi-style system: a library of reusable, theme-aware
sections; four selectable funnel templates cloned from real reference sites; and a
Shopify-style section catalog in the editor.

## Why

Today every `ic-*` section in `components/blocks/` hardcodes a dark background and
`#39FF14` green. A light or blue funnel is impossible without rewriting each section.
The unlock is **theming**: once sections read tokens instead of literal colors, the
same section library serves every style, and templates become thin presets.

## Reference sites analyzed

| Site | Style | Sections (top → bottom) |
|---|---|---|
| mentorship.lucasresells.com/waitlist | dark, minimal | nav · hero("closed") · countdown · waitlist-form (1 question) · video-testimonials grid · proof-gallery · footer |
| apply.uncoveredecom.com/form | light, clean | logo · urgency-hero · case-studies (2-up) · proof-gallery · multi-step apply-form · disclaimer · footer |
| apply.uncoveredecom.com/ | light, premium | nav (sticky) · hero + stats · pillars (01–04) · proof-gallery · testimonial-cards · faq · closing-cta · footer |
| fullstackagency.info | light, blue/teal | nav · hero · two-step-cta (watch + book) · case-studies (video) · testimonials · booking · footer |

The section vocabulary overlaps heavily across all four — one library covers them all.

## Architecture

### 1. Theming

Each funnel carries a `theme`. A theme is a preset bundle of CSS-variable values.
Stored inside the existing `pages.settings` JSON column — **no DB migration required**.

Tokens (CSS custom properties applied at the funnel root):

```
--accent      --accent-glow
--bg          --surface (page vs card/section bg)
--text        --text-muted
--card        --border
--radius      --font
```

Theme presets (`lib/themes.ts`):

| id | bg | text | accent | radius | vibe |
|---|---|---|---|---|---|
| `dark-green` | #050505 | #ffffff | #39FF14 | 12px | current IC look |
| `dark-minimal` | #0a0a0a | #ffffff | #ffffff | 8px | Lucas waitlist |
| `light-clean` | #ffffff | #0a0a0a | #111111 | 14px | Uncovered |
| `light-blue` | #ffffff | #0f172a | #2563eb | 16px | Agency |

`FunnelSettings` gains `theme: ThemeId`. `DEFAULT_SETTINGS.theme = 'dark-green'`.
Existing per-funnel `accentColor/bgColor/textColor/font` remain as **overrides**: theme
sets the baseline, those fields override individual tokens when set. The editor's
canvas and `/f/[slug]` both inject the resolved tokens as inline CSS vars on the root.

### 2. Section library

Block types live in `types/blocks.ts`; renderers in `components/blocks/`; the
editor's properties panel edits their props. New names are **theme-neutral** (drop the
`ic-` prefix going forward; keep `ic-*` types as aliases so existing saved funnels keep
rendering).

Reuse (refactor to read tokens):

| existing | role going forward |
|---|---|
| `ic-hero` | `hero` (one variant) |
| `ic-ticker` | `ticker` |
| `ic-cards` | `pillars` |
| `ic-results` | `proof-gallery` |
| `ic-faq` | `faq` |
| `ic-apply` | `apply-form` (multi-step) |
| `ic-cta` | `closing-cta` |

New sections:

- `nav` — logo + links + CTA button; `sticky` boolean
- `hero` — headline, subtext, CTA; optional `stats[]` (value+label); `variant: 'center' | 'closed' | 'stats'`
- `countdown` — target datetime + label; live DD:HH:MM:SS
- `waitlist-form` — single multiple-choice question + submit (Lucas style)
- `apply-form` — generalized multi-step form (from existing `innercircle/ApplyForm`); editable steps/fields
- `video-testimonials` — grid of video thumbnails with result captions + member badges
- `testimonial-cards` — quote cards (name, result, quote)
- `case-studies` — 1–3 featured stories (name, metric, narrative, optional video)
- `two-step-cta` — numbered "watch video / book call" steps
- `booking` — calendar embed URL (Calendly/Cal.com iframe)
- `disclaimer` — collapsible legal text ("results not typical")
- `footer` — copyright + links

Each section component renders read-only on `/f/[slug]` and selectable in the editor
canvas (existing `CanvasBlock` wrapper). Each gets a properties-panel editor in
`EditorLayout.tsx`'s `PropertiesPanel` and a `DEFAULT_PROPS` entry.

### 3. Template registry

`lib/templates.ts` exports an array of templates:

```ts
type FunnelTemplate = {
  id: string
  name: string
  description: string
  theme: ThemeId
  blocks: Block[]          // pre-built, ordered, with default copy
}
```

Four templates, one per reference site:

1. **Waitlist** (`dark-minimal`): nav · hero(closed) · countdown · waitlist-form · video-testimonials · proof-gallery · footer
2. **Application** (`light-clean`): nav · hero(urgency+stats) · case-studies · proof-gallery · apply-form · disclaimer · footer
3. **VSL / Landing** (`light-clean`): nav · hero(stats) · pillars · proof-gallery · testimonial-cards · faq · closing-cta · footer
4. **Agency** (`light-blue`): nav · hero · two-step-cta · case-studies(video) · testimonial-cards · booking · footer

The existing IC blueprint stays as a 5th template (`dark-green`).

### 4. Editor — Shopify-style catalog UX

Rework the left sidebar in `EditorLayout.tsx`:

- **Ordered section list** of *this page's* blocks. Per row: drag-reorder, hide
  toggle, duplicate, delete, select. (Replaces today's flat add-list + Layers list.)
- **`+ Add section`** button → opens a **catalog modal**: categorized
  (Hero · Social proof · Forms · Content · CTA · Nav/Footer), searchable, each entry a
  mini thumbnail preview. Clicking inserts the section (with `DEFAULT_PROPS`) after the
  current selection.

The right panel (Settings / Properties / AI Builder tabs) is unchanged except Settings
gains a **theme picker** (the four presets).

### Creation flow

`/create` gains a **template picker** as the first step (or alongside the existing AI
wizard): choose a template → new funnel is seeded with that template's `blocks` +
`theme`. AI-generated funnels still work and now also pick a theme.

## Data flow

```
/create  → pick template (or AI) → insert funnel + page(content=blocks, settings={...,theme})
editor   → EditorLayout reads page.content + settings; resolves theme → CSS vars on canvas root
         → edits autosave (debounced 800ms) to pages.content / pages.settings
/f/[slug]→ ISR render: resolve theme → CSS vars on root → map blocks via BlockRenderer
```

No new tables. No new columns (theme lives in `settings` JSON). RLS unchanged. ISR on
`/f/[slug]` unchanged.

## Build order (independently shippable phases)

- **P0 — Theming foundation.** Add `lib/themes.ts`, `theme` to `FunnelSettings`, token
  resolution + injection in editor canvas and `/f/[slug]`. Refactor the 7 existing
  `Ic*Block` components to read tokens instead of literal colors. Add theme picker to
  Settings panel. _Existing funnels look identical (default `dark-green`)._
- **P1 — Section library.** Build the new section types: types, default props,
  renderers, properties-panel editors, BlockRenderer mappings. Generalize `ApplyForm`
  into the `apply-form` block.
- **P2 — Template registry.** `lib/templates.ts` with the 4 templates; `/create`
  template picker; seed funnel from template.
- **P3 — Editor catalog UX.** Ordered section list with reorder/hide/duplicate/delete;
  `+ Add section` categorized searchable catalog modal with thumbnails.

## Components / files touched

- `types/blocks.ts` — new block types, props, `theme` on settings
- `lib/themes.ts` (new) — theme presets + token resolver
- `lib/templates.ts` (new) — template registry
- `components/blocks/*` — refactor 7 existing; add ~12 new section renderers; update `BlockRenderer.tsx`
- `components/editor/EditorLayout.tsx` — theme picker, ordered section list, catalog modal, new property editors
- `components/editor/SectionCatalog.tsx` (new) — catalog modal
- `app/create/page.tsx` — template picker
- `app/f/[slug]/page.tsx` — theme token injection
- `app/api/ai/create-funnel/route.ts` — emit `theme` in generated funnels

## Testing

- Each new section renders read-only and editable without crashing (smoke render).
- Each theme preset resolves to valid CSS vars; existing `dark-green` funnels render
  byte-identical after the P0 refactor (visual check on `/f/[slug]` + `/innercircle`).
- Each template seeds a funnel whose `/f/[slug]` renders all its sections.
- Catalog insert/reorder/hide/duplicate/delete mutate the block array correctly and
  autosave.

## Out of scope (YAGNI)

- Drag-drop from catalog onto canvas (button-insert is enough for v1).
- Per-section custom CSS / arbitrary color overrides beyond theme + existing 3 fields.
- New DB tables or columns.
- A/B testing, analytics, multi-page funnels.

## Constraints (from CLAUDE.md / AGENTS.md)

- Read `node_modules/next/dist/docs/` before writing Next.js code — this Next version
  has breaking changes vs. training data.
- Event handlers only in `'use client'` components.
- `/f/[slug]` stays ISR (< 1s load).
- Never import from `components/_ref-*` (reference only).
- DB changes (none expected here) = new numbered SQL file in `supabase/migrations/`.
