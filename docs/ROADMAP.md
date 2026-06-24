# Roadmap

## Phase 0 — Hygiene ✅ (current)

- [ ] Author `docs/` hub (10 spec files)
- [ ] Delete empty root `clyroclone/`, `opbotclone/`
- [ ] Thin CLAUDE.md files to point into `docs/`
- [ ] Confirm `npm run dev` boots clean

**Acceptance**: All docs exist; root dirs cleaned; dev boots without errors.

---

## Phase 1 — Live-chat builder ⚰️ REMOVED (Part 5)

> Was built, now deleted. Kenzo is template-first — there is no `/create`, no live-chat split-screen, no onboarding wizard. Kept below for history only; see **Part 5** and [CREATE-FLOW.md](CREATE-FLOW.md).

Replace the form wizard with a single split-screen at `/create`.

### Tasks
- [ ] Create `components/create/LiveChatBuilder.tsx` — split layout: LEFT chat, RIGHT live preview
- [ ] Chat: conversational flow, asks questions, persists answers to `business_profiles`
- [ ] Preview: `BlockRenderer` + `resolveTokens(settings)` in read-only mode, starts from `makeBaseFunnel()`
- [ ] AI selects template skeleton (Waitlist / Application / VSL / Agency) based on answers
- [ ] "Done building" → persist funnel+page → redirect to editor
- [ ] New/modify endpoint: `app/api/ai/build-funnel/route.ts`
- [ ] Reconcile `plannedSections` bug in `create-funnel`
- [ ] Replace `OnboardingWizard` form usage
- [ ] Reliability: retry on bad JSON, sanitize blocks, error boundary on preview

**Acceptance**: Create funnel end-to-end via chat; preview updates live; no crash on malformed AI output; lands in editor with funnel saved.

---

## Phase 2 — Funnel detail + Edit/Insights split

### Tasks
- [ ] Create `app/dashboard/funnels/[id]/page.tsx` — detail screen
  - Funnel name, status, created date
  - Quick stats (views, conversion %, pipeline $)
  - Two buttons: **Edit funnel** → `.../edit`, **View Insights** → `.../insights`
- [ ] Re-point dashboard cards (`app/dashboard/page.tsx`) to detail screen instead of straight to `/edit`

**Acceptance**: Clicking a card shows detail; both buttons route correctly.

---

## Phase 3 — Insights / Analytics

### Tasks
- [ ] Migration `010_funnel_events.sql` — append-only events table with RLS
- [ ] `app/api/events/route.ts` — POST beacon endpoint
- [ ] Client beacon on `/f/[slug]` — view event + Core Web Vitals (LCP/CLS/INP)
- [ ] `app/dashboard/funnels/[id]/insights/page.tsx` — dashboard with 4 metric groups
- [ ] `app/api/insights/[id]/route.ts` — aggregation queries
- [ ] Traffic/conversion: views, unique visitors, submissions, view→apply %
- [ ] Speed: time-to-first-application, avg time-in-stage, time-to-close
- [ ] Pipeline value: leads by stage, pipeline $, closed-won $/week, close rate
- [ ] Page load: p50/p75 web-vitals from funnel_events

**Acceptance**: Visiting published funnel records events; insights page shows real numbers for all four groups.

---

## Phase 4 — Template library

### Tasks
- [ ] Promote `innercircle` + `waitlist` + 4 archetypes into typed template set in `lib/templates.ts`
- [ ] Each template = ordered `BlockType[]` + seed props
- [ ] Live-chat AI picks from these templates based on answers
- [ ] Template preview/thumbnail for selection UI

**Acceptance**: AI selects appropriate skeleton per niche. Each template is a valid, renderable funnel.

---

## Phase 5 — AI / Reliability hardening

### Tasks
- [ ] Extract provider chain into `lib/ai-provider.ts`
- [x] Provider abstraction in `lib/ai-provider.ts` (the build/plan routes that also used it were removed in Part 5)
- [ ] Add retries with exponential backoff
- [ ] JSON schema validation on all AI outputs
- [ ] Optional SSE streaming for live-chat build
- [ ] Enforce "edit everything" — AI can modify any block, setting, or customCss

**Acceptance**: Every AI route uses one provider abstraction; bad output never reaches client.

---

## Phase 6 — Leads CRM polish + insights tie-in

### Tasks
- [ ] Link `leads.funnel_id` into insights queries
- [ ] Polish kanban UX (drag-and-drop, inline edit)
- [ ] Pipeline value chart per funnel
- [ ] Lead source attribution (which funnel, which traffic source)

**Acceptance**: Pipeline value shows per-funnel in insights. Kanban is smooth and functional.

---

## Part 5 — Template-first editor + Kenzo AI (CURRENT FOCUS)

The pivot: **no build-from-scratch.** Start from a template, edit per-section on the right, talk to **Kenzo AI** (one model, no picker) on the left. Build prompt: [`docs/prompts/part-5-template-editor.md`](prompts/part-5-template-editor.md).

### Tasks
- [ ] **Delete scratch flow**: `app/create/`, `components/create/LiveChatBuilder.tsx`, `components/onboarding/*`, and AI routes `build-funnel` / `plan-funnel` / `create-funnel` / `onboarding-questions`. Dashboard "New funnel" → `/templates`.
- [ ] **`/templates` gallery**: cards with live mini-preview; "Use template" server action seeds funnel+page → editor.
- [ ] **Left rail = Kenzo AI**: single chat, no model picker, no upload, no sessions sidebar, send→Stop (abort), chat memory per funnel.
- [ ] **`/api/ai` simplify**: default `prefer: 'deepseek'`, drop `model` field, keep ops + SSE + safety.
- [ ] **Right panel**: section list → click (list or preview) opens per-section settings (text + colors + fonts + spacing + more, no raw CSS); Theme tab for global; "Browse templates".
- [ ] **Per-section style**: add `block.style` (`BlockStyle`) in `types/blocks.ts`; `BlockRenderer` applies it over theme tokens; no migration.
- [ ] **App look**: Clyro dark palette on app chrome (not funnel preview). Keep desktop/mobile toggle + undo/redo + Publish.

**Acceptance**: see the prompt's acceptance criteria. Out of scope: cloning clyro.com templates (next prompt), Opbot/DM/SMS, billing.

---

## Clyro-alignment phases (superseded where they overlap Part 5)

Bring the builder to full 1:1 parity with [Clyro](REFERENCE-CLYRO.md). Part 5 above supersedes the AI-left re-layout (Phase 7), Inspect (Phase 8), the sections tree (Phase 9), and the gallery half of Phase 10. See the mapping table in REFERENCE-CLYRO for what's built vs planned.

### Phase 7 — Editor re-layout (AI-left, Sections-right) → folded into Part 5
- [ ] Move AI composer to the LEFT rail; move section list to the RIGHT alongside Theme
- [ ] Composer: Clyro chat styling, send→Stop — **no model picker, no upload, no sessions sidebar, no credits**
**Acceptance**: 3-panel layout matches Clyro (left Kenzo AI / center preview / right section list·Theme).

### Phase 8 — Inspect / scoped edits
- [ ] Clicking a block in the preview sets `selectedId` and arms scoping
- [ ] `/api/ai` accepts `selectedId` → AI returns `ops` touching only that block
- [ ] `applyOps()` leaves all other blocks unchanged; whole-funnel edit when no selection
**Acceptance**: Selecting a block + editing changes only that block; nothing else moves.

### Phase 9 — Sections tree + new section types
- [ ] Regroup tree as **HEADER / TEMPLATE / FOOTER / OVERLAY**
- [ ] Add block types: `ic-announcement`, `ic-header`, `ic-footer`, `ic-popup` (exit-intent/lead-capture)
- [ ] Per-item visibility toggle; drag-to-reorder
**Acceptance**: All 4 groups populated; can add/hide/reorder; OVERLAY popups render.

### Phase 10 — Templates gallery + Library
- [ ] `/templates` gallery page: cards with live mini-preview, filter/search, "Use template"
- [ ] Polish the 6 templates (fill `seedProps`, tighten copy, add thumbnails/tags) — see [TEMPLATES.md](TEMPLATES.md)
- [ ] Library: `011_library_sections.sql`, `/api/library`, "Save to Library" + insert from Sections "+"
**Acceptance**: Browse/use templates from gallery; save + reuse a section via Library.

### Phase 11 — Code view + Preview-data
- [ ] Read-only Code view: `Block[]` JSON + `FunnelSettings` + resolved CSS vars
- [ ] Preview-data layer: mock offer/testimonials/pricing seeded from `business_profiles`
**Acceptance**: Code view shows current funnel; preview looks realistic pre-publish.

### Phase 12 — Publish = validated export
- [ ] Validate funnel (valid blocks, required fields, no broken refs) before publish
- [ ] Publish → ISR `/f/[slug]` + copyable share link; optional "Built with kenzo" badge on free tier
**Acceptance**: Publish blocks on invalid funnel with clear errors; valid funnel goes live <1s.

---

## Future (post-phase)

- Public template marketplace
- A/B testing for funnel variants
- Email/SMS automation from leads
- Custom domain support
- Team accounts / agency mode
- White-label funnels
- API for third-party integrations
- Mobile app for lead management

---

## Integrate vs. Scrap decisions

| Item | Decision | Reason |
|------|----------|--------|
| `OnboardingWizard` + `components/onboarding/*` | **Delete (Part 5)** | No scratch flow — template-first only |
| `LiveChatBuilder` + `app/create/` | **Delete (Part 5)** | No scratch flow — template-first only |
| `build-funnel` / `plan-funnel` / `create-funnel` / `onboarding-questions` routes | **Delete (Part 5)** | Belonged to the scratch/live-chat flow |
| Model picker + 📎 upload + chat sessions sidebar | **Delete (Part 5)** | One model (Kenzo AI), no upload, single chat |
| `components/refernces/` | Keep as ref | Reference only, never import |
| `_ref-*` directories | Keep as ref | Reference only, never import |
