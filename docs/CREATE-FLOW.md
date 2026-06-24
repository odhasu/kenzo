# Create Flow — Template-first (live-chat builder REMOVED)

> **Changed in Part 5.** Kenzo no longer builds funnels from scratch. The only way to create a funnel is to **pick a template** from the [gallery](TEMPLATES.md). The old live-chat split-screen and onboarding wizard are **deleted**.

## The flow

```
Dashboard ──"New funnel"──▶ /templates gallery ──"Use template"──▶ editor
                            (live mini-previews)   (seeds funnel+page)
```

1. **Dashboard → "New funnel"** links to `/templates`.
2. **`/templates`** shows a card per template in `TEMPLATES` (`lib/templates.ts`) with a live mini-preview (read-only `BlockRenderer` on `makeFunnelFromTemplate(t)`), name, description, archetype tag.
3. **"Use template"** calls a server action that:
   - reads the template from `TEMPLATES`,
   - `makeFunnelFromTemplate(template)` → `{ blocks, settings }`,
   - inserts a `funnels` row + a `pages` row (`content: blocks`, `settings`, `order: 0`),
   - redirects to `/dashboard/funnels/[id]/edit`.
4. **Editor** ([EDITOR.md](EDITOR.md)) opens on the seeded funnel: left **Kenzo AI** chat, center live preview, right section list → per-section settings.

## Removed (Part 5)

| Removed | Was |
|---------|-----|
| `app/create/` | live-chat split-screen page |
| `components/create/LiveChatBuilder.tsx` | the split-screen builder |
| `components/onboarding/*` | the form wizard (`OnboardingWizard`, all `Step*`, `FollowUpRound`, `OnboardingPreview`, `ProgressBar`) |
| `app/api/ai/build-funnel/` | progressive build endpoint |
| `app/api/ai/plan-funnel/` | structure planner |
| `app/api/ai/create-funnel/` | from-scratch creator |
| `app/api/ai/onboarding-questions/` | wizard question bank |

**Kept:** `app/api/ai/route.ts` (in-editor edits), `app/api/ai/export-dataset/`, `app/api/chat/*`.

> Build instructions for this change: [`docs/prompts/part-5-template-editor.md`](prompts/part-5-template-editor.md).
> Cloning clyro.com's real template designs onto the gallery is a separate later prompt — see [TEMPLATES.md](TEMPLATES.md).
