# Architecture

## Stack

```
Next.js App Router + TypeScript + Tailwind CSS + Supabase + Vercel
```

## Route map

### Current routes

| Route | Type | Auth | Description |
|-------|------|------|-------------|
| `/` | Page (dynamic) | Public | Landing / waitlist page |
| `/login` | Page | Public | Auth login (bypass: `og@gmail.com` any pw) |
| `/signup` | Page | Public | Auth signup |
| `/dashboard` | Page (dynamic) | Protected | User's funnel list (dark theme) |
| `/create` | Page (dynamic) | Protected | Funnel creation wizard → becoming live-chat split-screen |
| `/dashboard/funnels/[id]/edit` | Page | Protected | 3-panel editor with AI chat |
| `/dashboard/funnels/[id]` | Page | Protected | (Phase 2) Funnel detail — Edit/Insights split |
| `/dashboard/funnels/[id]/insights` | Page | Protected | (Phase 3) Analytics dashboard |
| `/f/[slug]` | Page (ISR) | Public | Published funnel page |
| `/innercircle` | Page | Public | OGs Inner Circle standalone funnel |
| `/admin` | Page | Protected + admin | Admin overview |
| `/api/ai` | API POST | Protected | AI edits existing funnel |
| `/api/ai/build-funnel` | API POST | Protected | (Phase 1) AI builds funnel from answers |
| `/api/ai/plan-funnel` | API POST | Protected | AI plans funnel structure |
| `/api/ai/create-funnel` | API POST | Protected | AI creates funnel (known bug: plannedSections required) |
| `/api/ai/onboarding-questions` | API POST | Protected | Generates onboarding questions |
| `/api/events` | API POST | Mixed | (Phase 3) Beacon for views + web-vitals |
| `/api/insights/[id]` | API GET | Protected | (Phase 3) Aggregated analytics |
| `/api/leads` | API | Protected | Lead CRUD |
| `/api/applications` | API POST | Public | Inner Circle form submissions |

### Route protection

- Next.js middleware protects `/dashboard/*` and `/admin/*`
- Unauthenticated users redirected to `/login`
- Admin routes additionally check `admins` table

## Folder ownership

```
app/               → TERMINAL 1 — pages, routes, API endpoints
components/        → TERMINAL 3 — all UI components
lib/               → TERMINAL 1 — business logic, server functions
  funnels.ts       → CRUD for funnels + pages
  templates.ts     → DEFAULT_PROPS, makeBaseFunnel(), template library
  themes.ts        → THEME_PRESETS, resolveTokens(), CSS var resolution
  ai-prompt.ts     → SYSTEM_PROMPT, extractJson()
  ai-provider.ts   → (Phase 5) Unified AI provider chain
  leads.ts         → Typed lead queries
  supabase/        → client.ts (browser), server.ts (server)
types/             → TERMINAL 1 — TypeScript types
  blocks.ts        → Block, BlockType, FunnelSettings, all props interfaces
supabase/          → TERMINAL 2 — migrations, RLS
docs/              → TERMINAL 1 — living spec
```

## Rendering strategy

| Page | Strategy | Reason |
|------|----------|--------|
| `/f/[slug]` | ISR (`revalidate = 3600`) | Public, must be fast, cacheable |
| `/dashboard/*` | `force-dynamic` | User-specific data, real-time |
| `/create` | `force-dynamic` | Interactive wizard, user state |
| `/innercircle` | Static | Standalone funnel, no dynamic data |

## Live-build architecture (Phase 1)

```
User answers in chat (LEFT) → POST /api/ai/build-funnel {blocks, settings, answers, message}
  → AI returns {blocks, settings, explanation}
  → Preview updates in real-time (RIGHT) via BlockRenderer + resolveTokens
  → On "done": persist funnel+page → redirect to editor
```

Flow:
1. Start with `makeBaseFunnel()` — guaranteed valid, always renders
2. Each AI response updates blocks + settings
3. Output validated against `DEFAULT_PROPS` before render
4. Error boundary wraps preview — never whitescreens
5. Chat history persisted to `chat_messages`

## AI provider chain

```
Request → DeepSeek (primary) → Vercel AI Gateway → Anthropic → OpenAI → Gemini (fallback)
```

Route: `/api/ai/build-funnel` and `/api/ai` both use `extractJson()` to sanitize AI output.
Phase 5 extracts the chain into `lib/ai-provider.ts` for unified use.

## Contracts

### AI edit/build
```
POST {blocks, settings, prompt|message, model?, funnelId?}
→ {blocks, settings, explanation}
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

### Events (Phase 3)
```
POST {funnel_id, event_type, path?, value?, metadata?}
```
