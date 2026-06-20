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
│   ├── FormBlock.tsx
│   ├── IcHeroBlock.tsx       ic-hero → rendered section (reads CSS vars)
│   ├── IcTickerBlock.tsx     ic-ticker → scrolling strip (reads CSS vars)
│   ├── IcCardsBlock.tsx      ic-cards → 3-column card grid (reads CSS vars)
│   ├── IcFaqBlock.tsx        ic-faq → accordion FAQ (reads CSS vars)
│   ├── IcApplyBlock.tsx      ic-apply → wrappers ApplyForm (reads CSS vars)
│   ├── IcCtaBlock.tsx        ic-cta → full-width CTA button (reads CSS vars)
│   └── IcResultsBlock.tsx    ic-results → photo slider (reads CSS vars)
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

## Theming (CSS custom properties)

All section blocks read CSS vars injected at page root (editor canvas, /f/[slug], /innercircle). No hardcoded colors.

| CSS var | Description |
|---------|-------------|
| `--accent` | Primary accent color (buttons, highlights, checkmarks) |
| `--accent-glow` | Accent with ~0.28 alpha for box-shadows |
| `--accent-dim` | Accent with ~0.1 alpha for subtle backgrounds |
| `--bg` | Page background |
| `--surface` | Elevated surface bg (badges, cards) |
| `--text` | Primary text color |
| `--text-muted` | Muted text (~0.45 opacity equivalent) |
| `--text-dim` | Very dim text (~0.35 opacity equivalent) |
| `--card` | Card background |
| `--card-text` | Card text color |
| `--border` | Subtle border (~0.06 opacity) |
| `--border-strong` | Stronger border (~0.12 opacity) |
| `--radius` | Border radius for buttons, cards, accordions |
| `--font` | Font family |

Theme presets in `lib/themes.ts`: `dark-green` (default), `dark-minimal`, `light-clean`, `light-blue`.
`resolveTokens(settings)` merges theme preset with per-field overrides (accentColor, bgColor, textColor).

## Block types

Block type system in `types/blocks.ts`:
- **Simple elements:** `heading | text | button | image | form`
- **IC sections:** `ic-hero | ic-ticker | ic-cards | ic-faq | ic-apply | ic-cta | ic-results`

Each has typed `props`. `FunnelSettings` includes `theme`, colors, font, tickerSpeed, pageTitle, faviconUrl. See `types/blocks.ts`.

## Saves

Block editor saves via: `lib/funnels.ts → savePage(pageId, blocks)`
Auto-save on change (debounced). Supabase client: `lib/supabase/client.ts`

## Rules

- No imports from `_ref-*` folders in production code
- `innercircle/` components use inline styles (matches existing pattern)
- `blocks/` components support both `editable` and read-only render modes
