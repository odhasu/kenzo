# TERMINAL 3 — COMPONENTS

This terminal owns all UI components. No app routes, no DB, no server logic.

## Folder structure

```
components/
├── innercircle/          ← OGs Inner Circle funnel (LIVE at /innercircle)
│   ├── Hero.tsx              hero section — badge, h1, CTA
│   ├── Ticker.tsx            scrolling features strip
│   ├── ApplySection.tsx      "Apply Now" heading + ApplyForm wrapper
│   ├── ApplyForm.tsx         7-step multi-step form (client)
│   ├── Community.tsx         Discord community section
│   ├── SystemCards.tsx       3-step tag cards
│   ├── ResultsSlider.tsx     auto-scrolling photo ticker
│   ├── FAQInnercircle.tsx    FAQ accordion
│   ├── BottomCTA.tsx         final CTA button
│   ├── InnercircleFooter.tsx footer
│   ├── Background.tsx        particle canvas + radial gradient
│   └── PageReveal.tsx        video BG + loading spinner + fade-in wrapper
│
├── blocks/               ← Rendered block components (used by editor + /f/[slug])
│   ├── BlockRenderer.tsx     maps block.type → component
│   ├── HeadingBlock.tsx
│   ├── TextBlock.tsx
│   ├── ButtonBlock.tsx
│   ├── ImageBlock.tsx
│   └── FormBlock.tsx
│
├── editor/               ← Block editor (current: basic list editor)
│   └── BlockEditor.tsx       add/edit/delete/reorder blocks, saves to Supabase
│
├── _ref-ogresell/        ← REFERENCE ONLY — original OGs Inner Circle components
│   └── *.tsx                 source truth for innercircle/ — do not import directly
│
├── _ref-inspiration/     ← REFERENCE ONLY — screenshots of inspiration sites
│   └── *.png
│
└── WaitlistForm.tsx      ← Waitlist email capture (used on landing page)
```

## Design tokens (innercircle components)

```
background:  #050505
green:       #39FF14
green-glow:  rgba(57,255,20,0.28)
green-dim:   rgba(57,255,20,0.1)
card:        rgba(15,15,15,0.8)
border:      rgba(255,255,255,0.06)
muted:       rgba(255,255,255,0.45)
font:        Inter, system-ui
```

## Block types

Defined in `types/blocks.ts`: `heading | text | button | image | form`
Each has typed `props`. See `types/blocks.ts`.

## Saves

Block editor saves via: `lib/funnels.ts → savePage(pageId, blocks)`
Auto-save on change (debounced). Supabase client: `lib/supabase/client.ts`

## Rules

- No imports from `_ref-*` folders in production code
- `innercircle/` components use inline styles (matches existing pattern)
- `blocks/` components support both `editable` and read-only render modes
