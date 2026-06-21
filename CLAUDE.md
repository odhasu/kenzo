@AGENTS.md

# TERMINAL 1 — BASE

Funnel builder SaaS for coaches selling $400–$1000+ offers. Stack: Next.js App Router + TypeScript + Tailwind + Supabase + Vercel.

**Full spec → [docs/](docs/README.md)** — read docs/ for architecture, data model, create flow, editor, AI, insights, leads, roadmap.

## Run dev
```
npm run dev → localhost:3000
```

## Quick ref
| Area | Doc |
|------|-----|
| Product vision, user journey | [docs/PRODUCT.md](docs/PRODUCT.md) |
| Routes, rendering, contracts | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| DB tables, RLS, migrations | [docs/DATA-MODEL.md](docs/DATA-MODEL.md) |
| Live-chat create flow | [docs/CREATE-FLOW.md](docs/CREATE-FLOW.md) |
| 3-panel editor, blocks, settings | [docs/EDITOR.md](docs/EDITOR.md) |
| AI provider chain, prompts | [docs/AI.md](docs/AI.md) |
| Analytics, web-vitals | [docs/INSIGHTS.md](docs/INSIGHTS.md) |
| Leads CRM | [docs/LEADS-CRM.md](docs/LEADS-CRM.md) |
| Build phases | [docs/ROADMAP.md](docs/ROADMAP.md) |

## Rules
- Never touch node_modules, .next, next-env.d.ts, tsconfig.tsbuildinfo
- All DB changes = new numbered SQL file in supabase/migrations/
- Published funnel pages must be ISR (fast, <1s load)
- RLS on every Supabase table, always
- Event handlers → always in 'use client' components, never Server Components
- `_ref-*` folders in components/ are reference only — never import from them
