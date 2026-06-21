@AGENTS.md

# TERMINAL 1 — BASE

Funnel builder SaaS for coaches selling $400–$1000+ offers. Cloning clyro.io.
Stack: Next.js App Router + TypeScript + Tailwind + Supabase + Vercel.

## Folder map
```
app/               → all pages and routes
components/        → UI components (see components/CLAUDE.md)
lib/               → server functions (funnels.ts, templates.ts, supabase/, themes.ts, ai-prompt.ts)
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
| `/login` | Auth login (supports passwordless bypass for `og@gmail.com` with password `og` or empty) |
| `/signup` | Auth signup |
| `/dashboard` | Protected (requires login) — lists user funnels, dark theme |
| `/create` | Protected (requires login) — 3-step funnel creation wizard: base template → theme picker → color overrides, live preview. "Open in Editor" persists funnel + redirects to editor with AI chat open |
| `/dashboard/funnels/[id]/edit` | Protected (requires login) — 3-panel editor with AI chat sidebar |
| `/f/[slug]` | Public funnel page (ISR) |
| `/innercircle` | OGs Inner Circle standalone funnel |
| `/admin` | Protected (requires login & admin role) — Admin overview |
| `/api/ai` | POST — AI edits existing funnel (blocks + settings + prompt → updated funnel) |
| `/api/applications` | POST — saves Inner Circle applications to Supabase |

## Editor architecture (3-panel, EditorLayout.tsx)
```
[Sidebar 220px] | [Canvas flex] | [Properties 260px] (Includes Settings & AI Builder tabs)
```
- **Sidebar**: Section picker (ic-* types) + Element picker (basic types) + Layers list.
- **Canvas**: Live render. Theme-driven (dark/light based on `settings.theme`). Click block = select. Accent-colored outline on selected/hover.
- **Properties / Right Panel**: Per-block settings panel (auto-saves debounced 800ms) or **✦ AI Builder** chat sidebar.
  - **Settings tab**: Theme picker (4 presets), color overrides (accent/bg/text), font, ticker speed, page title, favicon.
  - **AI Builder tab**: Chat that sends current blocks + settings + user prompt to `/api/ai`. AI returns modified funnel. Chat history saved to `chat_messages` table.
  - *Funnel Creation*: `/create` is a 3-step deterministic wizard (base template → theme → colors) with zero AI calls. "Open in Editor" persists the funnel and redirects to the editor with `?tab=ai`.

## Authentication & Security
- **Bypass Login**: Entering `og@gmail.com` on the login page bypasses standard password constraints (you can type `og` or leave it blank). Behind the scenes, it signs in using `og_bypass_secure_password` to comply with Supabase's 6-character limit.
- **Route Protection**: Next.js middleware protects all `/dashboard/...` and `/admin/...` paths, redirecting unauthenticated sessions to `/login`.

## Theming

Sections read CSS custom properties injected at page root — no hardcoded colors. Defined in `lib/themes.ts`.

| Preset | Vibe |
|--------|------|
| `dark-green` | Dark bg, neon green accent (current IC look, default) |
| `dark-minimal` | Dark bg, white accent (Lucas waitlist) |
| `light-clean` | White bg, black accent (Uncovered) |
| `light-blue` | White bg, blue accent (Agency) |

`FunnelSettings.theme` picks the preset. `accentColor`/`bgColor`/`textColor` fields override individual tokens when set. `resolveTokens(settings)` returns resolved CSS vars. Editor and `/f/[slug]` both inject tokens via inline `style` on root div. Theme picker in editor Settings panel.

## Block types
Two families coexist in `types/blocks.ts`:

**Basic** — simple elements:
`heading | text | button | image | form`

**IC sections** — full funnel sections (theme-aware, read CSS vars):
`ic-hero | ic-ticker | ic-apply | ic-cards | ic-faq | ic-cta | ic-results`

New funnel created via `/create` uses a deterministic base template (`lib/templates.ts` → `makeBaseFunnel()`) with 6 valid blocks. `DEFAULT_PROPS` (shared by editor) guarantees every array prop is valid by construction. AI only modifies existing funnels via the editor's `/api/ai` endpoint — never creates from scratch.

## Rules
- Never touch node_modules, .next, next-env.d.ts, tsconfig.tsbuildinfo
- All DB changes = new numbered SQL file in supabase/migrations/
- Published funnel pages must be ISR (fast, <1s load)
- RLS on every Supabase table, always
- Event handlers → always in 'use client' components, never Server Components
- `_ref-*` folders in components/ are reference only — never import from them
