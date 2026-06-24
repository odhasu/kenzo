# Architecture

## Stack

```
Next.js App Router + TypeScript + Tailwind CSS + Supabase + Vercel
```

Builder model mirrors [Clyro](REFERENCE-CLYRO.md): 3-panel AI editor → live preview → publish.

## Route map

### Current + planned routes

| Route | Type | Auth | Description | Status |
|-------|------|------|-------------|--------|
| `/` | Page (dynamic) | Public | Landing / waitlist page | ✅ |
| `/login` | Page | Public | Auth login | ✅ |
| `/signup` | Page | Public | Auth signup | ✅ |
| `/dashboard` | Page (dynamic) | Protected | Funnel grid (cards + preview thumbnail) | ✅ |
| `/templates` | Page (dynamic) | Public | Template **gallery** — the only create path; "Use template" (auth-gated) seeds funnel + opens editor | ✅ |
| `/dashboard/funnels/[id]/edit` | Page | Protected | 3-panel AI builder | ✅ |
| `/dashboard/funnels/[id]` | Page | Protected | Funnel detail — Edit/Insights split | 🔨 |
| `/dashboard/funnels/[id]/insights` | Page | Protected | Analytics dashboard | ✅ |
| `/f/[slug]` | Page (ISR) | Public | Published funnel page | ✅ |
| `/innercircle` | Page | Public | OGs Inner Circle standalone funnel | ✅ |
| `/admin` | Page | Protected + admin | Admin overview | ✅ |
| `/api/ai` | API POST | Protected | **Kenzo AI** edits funnel (whole or **scoped via `selectedId`**), SSE | ✅ / 🔨 scope |
| `/api/ai/export-dataset` | API POST | Protected | Internal training-data export | ✅ |
| `/api/templates/use` | API POST | Protected | "Use template" — seeds funnel + page, returns editor redirect | ✅ |
| `/api/library` | API | Protected | Saved-section CRUD (Library) | 📋 |
| `/api/events` | API POST | Mixed | Beacon for views + web-vitals | ✅ |
| `/api/insights/[id]` | API GET | Protected | Aggregated analytics | ✅ |
| `/api/leads` | API | Protected | Lead CRUD | ✅ |
| `/api/applications` | API POST | Public | Form submissions | ✅ |

> **Removed in Part 5:** `/create`, `/api/ai/build-funnel`, `/api/ai/plan-funnel`, `/api/ai/create-funnel`, `/api/ai/onboarding-questions` (the scratch/live-chat flow). See [CREATE-FLOW.md](CREATE-FLOW.md).

### Route protection
- Proxy (`proxy.ts`, formerly Next.js middleware) protects `/dashboard/*` and `/admin/*`; unauthenticated → `/login`.
- `/templates` is publicly browseable; "Use template" is auth-gated by `/api/templates/use` (401 if signed out).
- Admin routes additionally check the `admins` table.

## Folder ownership

```
app/               → TERMINAL 1 — pages, routes, API endpoints
components/        → TERMINAL 3 — all UI components
  editor/          → EditorLayout, AiBuilderPanel, BusinessSettingsPanel, CanvasErrorBoundary
lib/               → TERMINAL 1 — business logic, server functions
  funnels.ts       → CRUD for funnels + pages, savePage()
  templates.ts     → DEFAULT_PROPS, makeBaseFunnel(), TEMPLATES, makeFunnelFromTemplate()
  themes.ts        → THEME_PRESETS, resolveTokens()
  ai-prompt.ts     → SYSTEM_PROMPT, extractJson(), op-vs-rebuild rules
  ai-provider.ts   → unified provider chain + retries + simulated streaming
  actions.ts       → server actions
  leads.ts         → typed lead queries
  supabase/        → client.ts (browser), server.ts (server)
types/blocks.ts    → Block, BlockType, FunnelSettings, all props + DEFAULT_SETTINGS
supabase/          → TERMINAL 2 — migrations, RLS
docs/              → TERMINAL 1 — living spec
```

## Rendering strategy

| Page | Strategy | Reason |
|------|----------|--------|
| `/f/[slug]` | ISR (`revalidate = 3600`) | Public, fast, cacheable |
| `/dashboard/*`, `/templates` | `force-dynamic` | User-specific data |
| `/innercircle` | Static | Standalone funnel |

## Create architecture (template-first)

```
Dashboard "New funnel" → /templates gallery → "Use template"
  → server action: makeFunnelFromTemplate(t) → insert funnel + page(content=blocks, settings)
  → redirect to /dashboard/funnels/[id]/edit
```

No AI runs on creation — the template seeds guaranteed-valid blocks + settings. The user then edits via the right panel or **Kenzo AI** (`POST /api/ai`). The old live-build (`/api/ai/build-funnel`) was removed in Part 5 — see [CREATE-FLOW.md](CREATE-FLOW.md).

## Scoped-edit architecture (Inspect) 📋

```
Click block in preview → selectedId set
  → POST /api/ai {blocks, settings, prompt, selectedId}
  → AI returns { ops: [...] } touching only selectedId
  → applyOps(blocks, ops) → re-render; everything else unchanged
No selection → whole-funnel edit (ops or rebuild).
```

## AI provider chain

```
Request → DeepSeek (primary) → Vercel AI Gateway → Anthropic → OpenAI → Gemini (fallback)
```
All routes use `lib/ai-provider.ts`. `extractJson()` sanitizes output. **No credit metering.**

## Contracts

### AI edit/build
```
POST {blocks, settings, prompt|message, model?, funnelId?, selectedId?}
→ {ops | blocks, settings, explanation}
```
Always validate output against `DEFAULT_PROPS`. Never return invalid blocks.

### Page row
```
{ funnel_id, slug, title, content: Block[], settings: FunnelSettings, order }
```

### Block
```
{ id: uuid, type: BlockType, props } — props must match DEFAULT_PROPS[type] shape
```

### Events
```
POST {funnel_id, event_type, path?, value?, metadata?}
```

### Library section 📋
```
{ id, user_id, name, blocks: Block[], thumbnail?, created_at }
```
