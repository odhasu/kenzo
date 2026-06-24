# Templates & Library

Kenzo copies [Clyro](REFERENCE-CLYRO.md)'s two-surface model:
- **Templates** — browsable, pre-built funnels you start from (Clyro's Templates page).
- **Library** — your saved, reusable sections (Clyro's Library, gated behind a paid tier there).

## Where templates live ✅

Code-defined in `lib/templates.ts` (not the DB) — single source of truth, guaranteed-valid by construction:

- `DEFAULT_PROPS` — default props per block type
- `TEMPLATES: Record<string, Template>` — the gallery set
- `makeBaseFunnel()` — 6-block guaranteed-valid starter (zero AI)
- `makeFunnelFromTemplate(template)` — blocks (DEFAULT_PROPS + `seedProps`) + settings (theme + background)
- `getTemplateByArchetype(archetype)` / `pickArchetype(answers)` — AI selection helpers

```typescript
interface Template {
  id: string
  name: string
  description: string
  archetype: 'application' | 'waitlist' | 'vsl' | 'agency'
  blockOrder: BlockType[]
  theme: ThemeId
  background: BackgroundId
  seedProps?: Partial<Record<BlockType, Partial<Block['props']>>>
}
```

## The 6 shipped templates ✅ (improve + gallery them)

| id | Name | Archetype | Theme | Block order |
|----|------|-----------|-------|-------------|
| `innercircle` | High-Ticket Application | application | dark-green | hero → ticker → cards → results → faq → cta |
| `waitlist` | Waitlist / Coming Soon | waitlist | dark-minimal | hero → ticker → cards → faq → cta |
| `light-waitlist` | Light Waitlist | waitlist | light-clean | hero → ticker → cards → faq → cta |
| `vsl` | Video Sales Letter | vsl | dark-green | hero(video) → cards → results → faq → cta |
| `agency` | Agency / Service | agency | light-blue | hero → cards → results → faq → cta |
| `bold-agency` | Bold Agency | agency | dark-minimal | hero → cards → results → faq → cta |

### Improvement backlog 📋 (polish the 6)
- Fill `seedProps` for the templates that have none (`innercircle`, `light-waitlist`, `bold-agency`, `vsl` results) so every template is fully fleshed, not just block order.
- Tighten hero/cards/FAQ copy per archetype (specific, human, no filler — match `SYSTEM_PROMPT` writing rules).
- Add a `thumbnail` (or live mini-render) per template for the gallery.
- Add `tags` (e.g. "coaching", "SaaS", "DFY") for gallery filtering.
- Consider 2–3 new archetypes later (webinar, book-a-call, tripwire) — not now.

## Gallery page `/templates` 🔨 — the only way to start

Template-first is now the **single** create path (no build-from-scratch). Clyro-style browsable grid, reusing the dashboard card pattern:
- Grid of template cards: live mini-preview (read-only `BlockRenderer` on `makeFunnelFromTemplate(t)`), name, description, archetype tag.
- Filter by archetype/tag; search (📋).
- "Use template" → server action: `makeFunnelFromTemplate(t)` → insert funnel + page (seeded `content`+`settings`) → redirect to editor.
- Entry point: dashboard "New funnel" → `/templates`. See [CREATE-FLOW.md](CREATE-FLOW.md).

## Clone clyro.com templates 📋 (next prompt)

The 6 current templates are functional but generic. The **next build prompt** replaces them with **1:1 clones of clyro.com's live templates**, then perfects them — real layouts, real copy quality, thumbnails, tags. The app shell ([the Part-5 prompt](prompts/part-5-template-editor.md)) ships first; template cloning is its own pass so the design work doesn't stall the editor pivot.

## Library 📋

User's saved reusable sections (premium tier, like Clyro's Library):
- Select one or more blocks in the editor → "Save to Library" → stored as a named section.
- New table `library_sections` (see [DATA-MODEL.md](DATA-MODEL.md)).
- Insert a saved section into any funnel from the Sections tree's "+".

## Templates and AI

The **user** picks the template from the gallery — the AI no longer selects one. (The old `pickArchetype()` / `getTemplateByArchetype()` heuristics were only used by the deleted live-chat planner and are removed.) After seeding, **Kenzo AI** edits the funnel from the chat like any other; it composes from the existing block/section types first. `makeFunnelFromTemplate(t)` remains the single seeding helper.

## References — your existing funnels

The `innercircle` template + `/innercircle` standalone page are the canonical reference build (real $10K/month reselling funnel copy in `DEFAULT_PROPS`). Treat these as the quality bar when polishing the other templates: specific numbers, concrete proof, punchy CTAs, no generic filler.
