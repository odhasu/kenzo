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
| `/templates` | Page (dynamic) | Protected | Template **gallery** + Library (saved sections) | 📋 |
| `/create` | Page (dynamic) | Protected | Live-chat split-screen create | 🔨 |
| `/dashboard/funnels/[id]/edit` | Page | Protected | 3-panel AI builder | ✅ |
| `/dashboard/funnels/[id]` | Page | Protected | Funnel detail — Edit/Insights split | 🔨 |
| `/dashboard/funnels/[id]/insights` | Page | Protected | Analytics dashboard | ✅ |
| `/f/[slug]` | Page (ISR) | Public | Published funnel page | ✅ |
| `/innercircle` | Page | Public | OGs Inner Circle standalone funnel | ✅ |
| `/admin` | Page | Protected + admin | Admin overview | ✅ |
| `/api/ai` | API POST | Protected | AI edits funnel (whole or **scoped via `selectedId`**) | ✅ / 📋 scope |
| `/api/ai/build-funnel` | API POST | Protected | AI builds funnel from answers | ✅ |
| `/api/ai/plan-funnel` | API POST | Protected | AI plans funnel structure | ✅ |
| `/api/ai/create-funnel` | API POST | Protected | AI creates funnel (`plannedSections` now optional) | 🔨 |
| `/api/ai/onboarding-questions` | API POST | Protected | Generates onboarding questions | ✅ |
| `/api/library` | API | Protected | Saved-section CRUD (Library) | 📋 |
| `/api/events` | API POST | Mixed | Beacon for views + web-vitals | ✅ |
| `/api/insights/[id]` | API GET | Protected | Aggregated analytics | ✅ |
| `/api/leads` | API | Protected | Lead CRUD | ✅ |
| `/api/applications` | API POST | Public | Form submissions | ✅ |

### Route protection
- Next.js middleware protects `/dashboard/*`, `/templates`, `/admin/*`; unauthenticated → `/login`.
- Admin routes additionally check the `admins` table.

## Folder ownership

```
app/               → TERMINAL 1 — pages, routes, API endpoints
components/        → TERMINAL 3 — all UI components
  editor/          → EditorLayout, AiBuilderPanel, BusinessSettingsPanel, CanvasErrorBoundary
lib/               → TERMINAL 1 — business logic, server functions
  funnels.ts       → CRUD for funnels + pages, savePage()
  templates.ts     → DEFAULT_PROPS, makeBaseFunnel(), TEMPLATES, makeFunnelFromTemplate(), pickArchetype()
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
| `/create` | `force-dynamic` | Interactive, user state |
| `/innercircle` | Static | Standalone funnel |

## Live-build architecture

```
User answers in chat (LEFT) → POST /api/ai/build-funnel {blocks, settings, answers, message}
  → AI returns {blocks, settings, explanation}
  → Preview updates in real time (RIGHT) via BlockRenderer + resolveTokens
  → On "done": persist funnel+page → open editor
```

1. Start from `makeBaseFunnel()` — guaranteed valid, always renders
2. Each AI response updates blocks + settings
3. Output validated against `DEFAULT_PROPS` before render
4. Error boundary wraps preview — never whitescreens
5. Chat history persisted to `chat_messages`

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
