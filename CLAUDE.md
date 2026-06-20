@AGENTS.md

# TERMINAL 1 — BASE

Funnel builder SaaS for coaches selling $400–$1000+ offers. Cloning clyro.io.
Stack: Next.js App Router + TypeScript + Tailwind + Supabase + Vercel.

## Folder map
```
app/               → all pages and routes
components/        → UI components (see components/CLAUDE.md)
lib/               → server functions (funnels.ts, supabase/)
types/             → TypeScript types (blocks.ts)
supabase/          → SQL migrations (see supabase/CLAUDE.md)
public/innercircle/→ assets for innercircle funnel (photos + back.mp4)
docs/              → reference docs
```

## Run dev
```
npm run dev → localhost:3000
```

## Routes
| Route | Description |
|-------|-------------|
| `/` | Landing / waitlist page |
| `/login` | Auth login |
| `/signup` | Auth signup |
| `/dashboard` | Lists user funnels, dark theme |
| `/dashboard/funnels/[id]/edit` | 3-panel editor |
| `/f/[slug]` | Public funnel page (ISR) |
| `/innercircle` | OGs Inner Circle standalone funnel |
| `/admin` | Admin overview |
| `/api/applications` | POST — saves Inner Circle applications to Supabase |

## Editor architecture (3-panel, EditorLayout.tsx)
```
[Sidebar 220px] | [Canvas flex] | [Properties 260px]
```
- **Sidebar**: Section picker (ic-* types) + Element picker (basic types) + Layers list
- **Canvas**: Live render. Dark bg for ic-* funnels, white card for basic funnels. Click block = select. Green outline on selected/hover.
- **Properties**: Per-block settings panel. Text inputs, textareas, checkboxes. Auto-saves debounced 800ms.

## Block types
Two families coexist in `types/blocks.ts`:

**Basic** — simple elements:
`heading | text | button | image | form`

**IC sections** — full funnel sections (dark, green-accented):
`ic-hero | ic-ticker | ic-apply | ic-cards | ic-faq | ic-cta`

New funnel created via dashboard gets IC template pre-loaded.

## Rules
- Never touch node_modules, .next, next-env.d.ts, tsconfig.tsbuildinfo
- All DB changes = new numbered SQL file in supabase/migrations/
- Published funnel pages must be ISR (fast, <1s load)
- RLS on every Supabase table, always
- Event handlers → always in 'use client' components, never Server Components
- `_ref-*` folders in components/ are reference only — never import from them
