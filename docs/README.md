# Kenzo Docs Hub

Funnel builder SaaS for coaches selling $400–$1000+ offers. Blends **Clyro** (template-driven funnel editor) with **OpBot** (conversational AI that builds the funnel for you).

## Reading order

| # | File | What |
|---|------|------|
| 1 | [PRODUCT.md](PRODUCT.md) | Vision, target user, user journey, glossary, north-star metrics |
| 2 | [ARCHITECTURE.md](ARCHITECTURE.md) | Route map, folder ownership, rendering strategy, live-build architecture, AI provider chain |
| 3 | [DATA-MODEL.md](DATA-MODEL.md) | All tables, columns, RLS, relationships, migration numbering |
| 4 | [CREATE-FLOW.md](CREATE-FLOW.md) | Live-chat split-screen spec: UX, question script, answer→business_profiles mapping, streaming, reliability |
| 5 | [EDITOR.md](EDITOR.md) | 3-panel editor, block types+props, FunnelSettings, themes/backgrounds, autosave |
| 6 | [AI.md](AI.md) | Provider chain, prompts, JSON contracts, model selection, retries/validation/streaming |
| 7 | [INSIGHTS.md](INSIGHTS.md) | 4 metric groups, event tracking, web-vitals beacon, aggregation SQL |
| 8 | [LEADS-CRM.md](LEADS-CRM.md) | Leads pipeline + how it feeds insights |
| 9 | [ROADMAP.md](ROADMAP.md) | Build phases, integrate-vs-scrap, per-phase acceptance criteria |

## Conventions

- **Stack**: Next.js App Router + TypeScript + Tailwind + Supabase + Vercel
- **DB**: All schema changes = new numbered SQL file in `supabase/migrations/`
- **RLS**: Every table, always — users see only `auth.uid() = user_id` rows
- **ISR**: Published funnel pages (`/f/[slug]`) must load <1s
- **Client/Server**: Event handlers always in `'use client'` components, never Server Components
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
