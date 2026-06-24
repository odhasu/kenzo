# DeepSeek build prompt — Part 5: Template-first editor + Kenzo AI chat

> Paste everything below the line into DeepSeek as a single build task. It is self-contained.
> Scope = the app **shell pivot** only. Cloning clyro.com's actual templates is a **separate later prompt** (see "Out of scope").

---

## Role

You are a senior Next.js engineer working in the `kenzo` repo — a funnel-builder SaaS for coaches selling $400–$1000+ offers. Stack: **Next.js App Router + TypeScript + Tailwind + Supabase + Vercel**. You make precise, working edits and never break the build.

## Hard rules (read first)

- This is a **modified Next.js** — APIs/conventions may differ from your training data. Before writing routing/rendering/server-action code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.
- Never touch `node_modules`, `.next`, `next-env.d.ts`, `tsconfig.tsbuildinfo`.
- Never import from any `components/_ref-*` or `components/refernces/*` folder — reference only.
- All DB changes = a **new numbered SQL file** in `supabase/migrations/`. Last one is `011_chat_sessions.sql`.
- Every Supabase table has RLS — keep it.
- Published funnel pages (`/f/[slug]`) stay **ISR** and fast (<1s).
- Event handlers only in `'use client'` components, never Server Components.
- TypeScript must compile clean. Run a typecheck/build before declaring done.

## The product change (what we're building)

We are dropping "build a funnel from scratch." The new model is **template-first**, copying Clyro's builder 1:1:

1. User opens the **Templates gallery**, picks a template.
2. That creates a funnel + page seeded from the template and opens the **3-panel editor**.
3. In the editor: **left** = a single Kenzo AI chat; **center** = live preview; **right** = section list → click a section → edit that section (text + colors + fonts + more).

There is **one AI builder, branded "Kenzo AI"** — no model picker, no provider names shown to the user. No file upload. No billing/paywall logic.

---

## Current state (already built — reuse, don't rebuild)

- `types/blocks.ts` — `Block`, `BlockType` (12 types: `heading text button image form` + `ic-hero ic-ticker ic-cards ic-faq ic-apply ic-cta ic-results`), `FunnelSettings` (25 fields), `DEFAULT_SETTINGS`. `Block = BlockProps & { id; hidden? }`.
- `lib/templates.ts` — `DEFAULT_PROPS`, `TEMPLATES` (6 templates), `makeFunnelFromTemplate(template)` → `{ blocks, settings }`. **This is how the gallery seeds a funnel.**
- `lib/themes.ts` — `resolveTokens(settings)` → CSS custom props; `THEME_PRESETS`.
- `components/blocks/BlockRenderer.tsx` + one component per block type — the live renderer (read-only mode reused by `/f/[slug]`).
- `components/editor/EditorLayout.tsx` — the 3-panel editor (currently: left = block/element/layers sidebar, right = Settings/Business/AI tabs). Has desktop/mobile toggle, undo/redo, save, publish.
- `components/editor/AiBuilderPanel.tsx` — the AI chat (currently includes a **chat sessions sidebar** + a model picker — both to be removed).
- `app/api/ai/route.ts` — the edit endpoint. Takes `{ blocks, settings, prompt, model?, funnelId, sessionId? }`, returns `ops`-based or full-rebuild changes, SSE-streams the explanation, persists messages to `chat_messages`. **Keep this; simplify per below.**
- `lib/ai-provider.ts` — `callAI()` with a provider fallback chain + `resolvePrefer()`.
- `lib/funnels.ts` — `createFunnel(name)`, `savePage(pageId, content, settings?)`, etc.
- `app/dashboard/funnels/[id]/edit/page.tsx` — loads page → renders `<EditorLayout>`.

---

## TASK 1 — Delete the scratch / onboarding / live-chat create flow

Delete these files/dirs entirely and remove every import, link, and dashboard button that points at them:

- `app/create/` (the whole route: `app/create/page.tsx`)
- `components/create/LiveChatBuilder.tsx`
- `components/onboarding/` (all of it: `OnboardingWizard.tsx`, `FollowUpRound.tsx`, `OnboardingPreview.tsx`, `ProgressBar.tsx`, `StepShell.tsx`, `StepClient.tsx`, `StepNiche.tsx`, `StepOffer.tsx`, `StepPainPoints.tsx`, `StepPricing.tsx`)
- API routes: `app/api/ai/build-funnel/`, `app/api/ai/plan-funnel/`, `app/api/ai/create-funnel/`, `app/api/ai/onboarding-questions/`

**Keep:** `app/api/ai/route.ts` (edit), `app/api/ai/export-dataset/` (training export), `app/api/chat/*`.

After deleting, grep the repo for any remaining references to the removed paths/components and fix them. In `lib/templates.ts`, `pickArchetype()` / `getTemplateByArchetype()` were only used by the deleted planner — remove them if now unused (keep `TEMPLATES`, `DEFAULT_PROPS`, `makeFunnelFromTemplate`, `makeBaseFunnel`).

The dashboard "New funnel" entry point must now link to `/templates` (Task 2), not `/create`.

## TASK 2 — Templates gallery (`/templates`)

Create `app/templates/page.tsx` — a Clyro-style browsable grid, the only way to start a funnel.

- For each template in `TEMPLATES`: render a card with a **live mini-preview** (read-only `BlockRenderer` on `makeFunnelFromTemplate(t)`, scaled down / non-interactive), the template `name`, `description`, and `archetype` tag.
- Each card has a **"Use template"** action.
- Page uses the Clyro dark app look (Task 6).

Add a server action `createFunnelFromTemplate(templateId: string)` (in `lib/funnels.ts` or `lib/actions.ts`):
1. Look up the template in `TEMPLATES`; if missing, 404 / redirect back.
2. `const { blocks, settings } = makeFunnelFromTemplate(template)`.
3. Insert a `funnels` row (name from template, unique slug) and a `pages` row with `content: blocks`, `settings`, `order: 0`. (Generalize the existing `createFunnel` so it can accept seed `content` + `settings` instead of empty — don't break existing callers.)
4. `redirect('/dashboard/funnels/' + funnel.id + '/edit')`.

RLS: funnel/page rows belong to the authed user, same as today.

## TASK 3 — Left rail = single "Kenzo AI" chat (copy Clyro)

Rework `components/editor/AiBuilderPanel.tsx` (and its use in `EditorLayout.tsx`) into one Clyro-style chat rail:

- **Remove the chat sessions sidebar** (the black rail from part-2). One chat per funnel.
- **Remove the model picker** entirely. No provider names anywhere in the UI.
- **Remove file upload / attach** (no 📎, no upload handling).
- Header/brand: **"Kenzo AI"**.
- Empty state: *"Start editing with AI: describe what you want to change."* / *"Describe your changes and I'll handle the rest."*
- Messages stack above the composer.
- Composer: a `Ask anything…` textarea + a **send** button (up arrow). While a reply is streaming, the send button becomes a **Stop** square that **aborts the request** (use an `AbortController`; on abort, stop the stream, keep whatever text arrived, re-enable input).
- **Chat memory:** on editor open, load this funnel's prior editor messages (`chat_messages` where `funnel_id = <id>` and `console_type = 'editor'`, ordered by `created_at`) and render them. Reopening a funnel shows the old conversation.
- Keep scoped edits ("Inspect"): if a section is selected in the preview, the next message edits **only that section** (pass its block id to `/api/ai`; the AI returns targeted `ops`). If nothing is selected, it edits the whole funnel.

## TASK 4 — `/api/ai` simplification + DeepSeek as the one model

In `app/api/ai/route.ts` and `lib/ai-provider.ts`:

- The editor always uses **one model**. Make `callAI` default to **`prefer: 'deepseek'`** for this route (DeepSeek is "Kenzo AI"). Keep the provider fallback chain for reliability, but **do not** read a `model` field from the request or surface any model choice.
- Simplify session handling: messages are keyed by `funnel_id` + `console_type='editor'`. You may keep the `chat_sessions` table and use one implicit session per funnel, or stop using it — either way the editor loads/saves by `funnel_id`. Do not surface sessions in the UI.
- Keep: ops engine, block/settings validation, SSE streaming of the explanation, the "never crash / funnel never breaks" guarantees.
- Make sure the route handles client aborts cleanly (request cancelled mid-stream).

## TASK 5 — Right panel = section list → per-section settings + Theme tab

Rework the right panel in `EditorLayout.tsx`:

**5a. Section list (default view).** A list of the funnel's sections in order (you may group by HEADER / TEMPLATE / FOOTER / OVERLAY, but all current block types live under TEMPLATE — keep it simple if groups are empty). Each row: section name + icon, a **visibility eye** (toggles `block.hidden`), and it's selectable. Reorder (drag) and add/remove can reuse existing EditorLayout logic. A **"Browse templates"** button links back to `/templates`. A **"Theme"** tab switches to global settings.

**5b. Click-to-edit.** Clicking a section in the **center live preview** selects it AND opens its settings in the right panel automatically (and arms scoping for the next AI message). Clicking a row in the list does the same.

**5c. Per-section settings editor.** When a section is selected, the right panel shows **as many settings as possible** for it (no raw custom-CSS box):
- **Content controls** driven by the block's props — e.g. `ic-hero`: badge, headline, subtext, ctaLabel, ctaHref; `ic-cards`: headline + editable card list (title/desc/bullets) + cta; `ic-faq`: editable Q/A list; `ic-ticker`: editable items; `heading/text/button/image/form`: their props. Add/remove/reorder list items where the prop is an array.
- **Style overrides for this section** (new — see Task 5d): background color, text color, accent color, heading font, body font, font scale, text alignment, vertical padding/spacing, button style, border radius. Provide a **"Reset to theme"** that clears the section's overrides.

**5d. Data model for per-section style (no DB migration).** Per-section style lives **inside the block**, in `page.content` JSON — no schema change needed.
- In `types/blocks.ts`, add an optional `style?: BlockStyle` to `Block`. Define:
  ```ts
  export interface BlockStyle {
    bgColor?: string; textColor?: string; accentColor?: string;
    headingFont?: string; bodyFont?: string; fontScale?: number;
    align?: 'left' | 'center' | 'right';
    paddingY?: number; borderRadius?: number;
    buttonStyle?: ButtonStyle;
  }
  ```
- In `BlockRenderer.tsx`, wrap each block in a section element that applies `block.style` as **inline CSS custom properties / styles that override the theme tokens for that section only** (theme tokens stay the global default; section style wins where set). Empty/undefined fields fall back to theme.
- The AI edit `ops` engine should also be able to set `block.style` via `update_block` (style is just part of the block) — make sure validation/merge keeps `style` intact.

## TASK 6 — App look: copy Clyro dark (editor chrome + gallery + dashboard)

Apply Clyro's warm-paper dark palette to the **app UI** (top bar, rails, panels, gallery, dashboard) — **not** to the funnel preview content, which keeps its own theme via `resolveTokens`. Tokens (from `docs/REFERENCE-CLYRO.md`):

- App bg `#1a1a1a`; raised panels `#222`; input fill `#00000047`; hover `#ffffee0f`; active `#ffffee1f`.
- Ink (text) **warm white `#ffe`**, not pure white; dim `#ffffeea6`; muted `#ffe6`; faint `#ffffee2e`.
- Borders = ink at low alpha: hairline `#ffffee14`, strong `#ffffee2e` (never gray).
- Accent slate `#283f4d`; info `#6ba0c0`; success `#6b9e7a`; danger `hsl(0 55% 52%)`.
- Radius sm/md/lg = `.5rem / 1rem / 2.5rem`.
- Body font `Inter`; display/headings serif `Lora`.

Keep the top bar tools: **desktop/mobile preview toggle** and **undo/redo** (already in `EditorLayout`), plus **Publish**.

---

## Out of scope (do NOT do in this prompt)

- Cloning clyro.com's actual template designs — that is the **next** prompt. For now the 6 existing `TEMPLATES` are fine as-is.
- Opbot / AI DM setter / SMS.
- Any billing, paywall, plan/tier system, or locked "Opus" model.
- File upload / image vision.

## Acceptance criteria

1. App builds and typechecks clean; no references to deleted files remain.
2. `/create`, onboarding wizard, live-chat builder, and the 3 deleted AI routes are gone. Dashboard "New funnel" → `/templates`.
3. `/templates` shows live mini-previews of all 6 templates; "Use template" creates a seeded funnel + opens the editor on it.
4. Editor left rail = one "Kenzo AI" chat: no model picker, no upload, no sessions sidebar; send turns into a working Stop button mid-stream; reopening a funnel shows past messages.
5. Editor right panel = section list; clicking a section (list or preview) opens its settings; you can edit that section's text AND its colors/fonts/sizes/spacing; "Reset to theme" works; visibility eye works.
6. Per-section style persists in `page.content` and renders correctly on the editor preview (global theme still applies where a section has no override). No new migration was needed for it.
7. The app chrome uses the Clyro dark palette; the funnel preview still renders with its own theme.
8. Published `/f/[slug]` pages still render (with per-section styles applied) and stay ISR.
