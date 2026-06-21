# Roadmap

## Phase 0 — Hygiene ✅ (current)

- [ ] Author `docs/` hub (10 spec files)
- [ ] Delete empty root `clyroclone/`, `opbotclone/`
- [ ] Thin CLAUDE.md files to point into `docs/`
- [ ] Confirm `npm run dev` boots clean

**Acceptance**: All docs exist; root dirs cleaned; dev boots without errors.

---

## Phase 1 — Live-chat builder (CENTERPIECE)

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
- [ ] Unify `/api/ai`, `/api/ai/build-funnel`, `/api/ai/plan-funnel` to use one abstraction
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
| `OnboardingWizard` | Scrap | Replaced by LiveChatBuilder (Phase 1) |
| `create-funnel` endpoint | Fix | Make `plannedSections` optional, unify with `build-funnel` |
| `clyroclone/`, `opbotclone/` | Delete | Only `.next` cache, no source code |
| `components/refernces/` | Keep as ref | Reference only, never import |
| `_ref-*` directories | Keep as ref | Reference only, never import |
