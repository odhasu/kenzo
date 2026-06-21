# Kenzo Docs Hub

**Kenzo is Clyro, for funnels.** A coach describes their offer in a left-rail AI chat; the funnel builds live in the center preview; they fine-tune via a right-rail Sections tree + Settings, then publish. Same builder model as [Clyro](REFERENCE-CLYRO.md) (AI theme builder for Shopify) — swapping "Shopify theme" for "high-ticket coaching funnel."

Target customer: coaches/creators selling $400–$1000+ offers who are non-technical but want a converting funnel live today.

## Status legend

Every doc tags features with where they stand:

- ✅ **built** — exists in code today
- 🔨 **partial** — partially built, needs work to reach the target
- 📋 **planned** — specced here, not yet built (the Clyro-aligned target)

## Reading order

| # | File | What |
|---|------|------|
| 0 | [REFERENCE-CLYRO.md](REFERENCE-CLYRO.md) | North-star reference: Clyro's builder, design tokens, feature map, Clyro→kenzo mapping |
| 1 | [PRODUCT.md](PRODUCT.md) | Vision, target user, user journey, glossary, north-star metrics |
| 2 | [ARCHITECTURE.md](ARCHITECTURE.md) | Route map, folder ownership, rendering, live-build + scoped-edit architecture, AI provider chain |
| 3 | [DATA-MODEL.md](DATA-MODEL.md) | All tables, columns, RLS, relationships, migration numbering |
| 4 | [CREATE-FLOW.md](CREATE-FLOW.md) | Live-chat split-screen: UX, question script, answer→business_profiles mapping, streaming, reliability |
| 5 | [EDITOR.md](EDITOR.md) | 3-panel builder: AI composer, Inspect/click-to-scope, Sections tree, Settings, Code view, Preview-data |
| 6 | [AI.md](AI.md) | Provider chain, prompts, JSON/ops contracts, model selection, scoped edits, retries/validation/streaming |
| 7 | [TEMPLATES.md](TEMPLATES.md) | Template gallery + Library: the 6 templates, gallery page, saved sections |
| 8 | [INSIGHTS.md](INSIGHTS.md) | 4 metric groups, event tracking, web-vitals beacon, aggregation SQL |
| 9 | [LEADS-CRM.md](LEADS-CRM.md) | Leads pipeline + how it feeds insights |
| 10 | [ROADMAP.md](ROADMAP.md) | Build phases, integrate-vs-scrap, per-phase acceptance criteria |

Also: [block-schema.md](block-schema.md) — block prop reference.

## Conventions

- **Stack**: Next.js App Router + TypeScript + Tailwind + Supabase + Vercel
- **DB**: All schema changes = new numbered SQL file in `supabase/migrations/`
- **RLS**: Every table, always — users see only `auth.uid() = user_id` rows
- **ISR**: Published funnel pages (`/f/[slug]`) must load <1s
- **Client/Server**: Event handlers always in `'use client'` components, never Server Components
- **AI doctrine**: Compose from existing block/section types first; only invent a new type when the user genuinely needs functionality the library lacks (Clyro's rule)
- **No credits**: kenzo does not meter or bill AI usage — no credit counters, no per-message cost
- **References**: Never import from `components/_ref-*` or `components/refernces/*`
- **Never touch**: `node_modules`, `.next`, `next-env.d.ts`, `tsconfig.tsbuildinfo`

## Terminal ownership zones

| Terminal | Scope | Pointer |
|----------|-------|---------|
| TERMINAL 1 — BASE | App routes, lib, types, docs | [../CLAUDE.md](../CLAUDE.md) |
| TERMINAL 2 — DATABASE | Supabase schema, migrations, RLS | [../supabase/CLAUDE.md](../supabase/CLAUDE.md) |
| TERMINAL 3 — COMPONENTS | All UI components | [../components/CLAUDE.md](../components/CLAUDE.md) |

## Quick start

```bash
npm run dev          # → localhost:3000
```
