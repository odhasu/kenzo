# Reference — Clyro (app.clyro.com)

> Captured 2026-06-21 via authenticated walkthrough (logged-in builder + 12-step in-product tour). Clyro = "AI Theme Builder for Shopify."
> This is our **north-star reference**: kenzo copies Clyro's builder model 1:1, swapping "Shopify theme" for "coaching funnel." See the mapping table at the bottom for what each Clyro concept becomes in kenzo.
> Use for UX/visual/architecture reference. Not a kenzo feature spec — that lives in [EDITOR.md](EDITOR.md), [AI.md](AI.md), [TEMPLATES.md](TEMPLATES.md).

## Product in one line
Describe a change in a left-rail chat; the AI writes the underlying code (Liquid/JSON/CSS) and the center live preview updates in real time. Pick a model per message, click any element to scope the edit to it, then publish/export a validated bundle.

---

## Design tokens (pulled from computed CSS)

Dark-first, **warm-paper** neutral on near-black, single slate accent. Serif display + sans body. Borders are tinted ink at low alpha — never gray.

| Token | Value | Use |
|-------|-------|-----|
| `--paper` / body bg | `#1a1a1a` | app background |
| `--paper-panel` | `#222` | raised panels (rails, cards) |
| `--paper-input` | `#00000047` | input fills |
| `--paper-hover` | `#ffffee0f` | hover wash (~6% ink) |
| `--paper-active` | `#ffffee1f` | active/pressed wash |
| `--ink` | `#ffe` (255 255 238) | primary text — **warm white, not pure white** |
| `--ink-dim` | `#ffffeea6` | secondary text |
| `--ink-mute` | `#ffe6` | muted text |
| `--ink-faint` | `#ffffee2e` | placeholder / disabled |
| `--line` | `#ffffee14` | hairline borders (ink @ ~8%) |
| `--line-strong` | `#ffffee2e` | emphasized borders |
| `--accent-slate` / `--brand-ink` | `#283f4d` | accent / ink-on-light buttons |
| `--raw` | `#6ba0c0` | info blue |
| `--liquid` | `#6b9e7a` | success green |
| `--destructive` | `hsl(0 55% 52%)` | delete / danger |
| radius sm / md / lg | `.5rem` / `1rem` / `2.5rem` | section radius lg = `4rem` |
| body font | `Inter` | all UI |
| display font | `Lora` (serif) | h1 / headings |

shadcn-style HSL vars also present (`--background 0 0% 10%`, `--foreground 60 100% 97%`, `--card 202 31% 23%`, `--radius .5rem`) → they run shadcn/ui on a custom warm-paper palette.

**Steal:** warm-white ink `#ffe` on `#1a1a1a` (softer than `#fff`/`#000`), all borders = ink at low alpha, single slate accent, serif-display/sans-body split.

---

## Layout architecture — 3-panel builder

```
┌─ top bar ───────────────────────────────────────────────────────────────────┐
│ ⬡ [Aura ▾] │ 💬chat ✦inspect │ 👁Preview 🔒↶↷ │ ▣Theme▕Canvas │ 📱 │ 🏠Home ▾ + │ ▤Sections ⚙ ⬡code ?help ☀ │ ⚡Upgrade  🔒Export │
├──────────────────┬───────────────────────────────────┬────────────────────────┤
│ LEFT — AI chat    │ CENTER — live preview              │ RIGHT — Sections OR      │
│                   │                                    │ Theme settings           │
│ empty:            │ storefront rendered exactly as     │                          │
│ "Start editing    │ Shopify shows it; reloads on       │ ▤ Home page ▾            │
│  with AI…"        │ every AI edit                      │ ─ HEADER            +    │
│                   │                                    │   › Announcement bar     │
│ messages stack    │ promo/announcement bars at top     │     Header               │
│                   │                                    │ ─ TEMPLATE          +    │
│ ┌─ composer ────┐ │                                    │   Hero banner            │
│ │ Ask anything… │ │      [ live preview canvas ]       │   Featured collection    │
│ │ 📎  ✦Haiku4.5▾│ │                                    │   Text with Image        │
│ │            ↑ │ │                                    │   › Double Card          │
│ └───────────────┘ │                                    │   Image with text  👁    │
│ "X credits"       │                                    │   › Rhodeslides          │
│ "Report convo"    │                                    │   › Hover Benefits       │
│                   │                                    │ ─ FOOTER            +    │
│                   │                                    │   › Footer               │
│                   │                                    │ ─ OVERLAY                │
│                   │                                    │   Cart drawer            │
└──────────────────┴───────────────────────────────────┴────────────────────────┘
```

### Top bar (left→right)
Theme switcher (`Aura ▾`) · **Chat** toggle · **Inspect** (✦) · **Preview** (eye) · lock + undo/redo · **Theme / Canvas** mode toggle · device toggle (📱 desktop/mobile) · **Home ▾** page switcher + "+" add page · **Sections / Settings** tab toggle · settings (⚙) · **Code** (⬡ cube) · Help (?) · light/dark (☀) · **Upgrade** · **Export**.

### Left — AI chat
- Empty state: "Start editing with AI: describe what you want to change." / "Describe your changes and I'll handle the rest."
- Composer: `Ask anything…` input, **📎 attach/upload**, **model picker** inline (`✦ Haiku 4.5 ▾`; Opus 4.8 promoted as new), send (↑).
- Footer under each AI reply: small credit count (e.g. "6 credits") + "Spent too many credits? Report this conversation." *(kenzo drops credits — see mapping.)*
- **Chat vs Image mode** — same input field; Chat = code edits, Image = AI-generated visuals.

### Center — live preview
- Renders exactly as on Shopify; every AI edit reloads instantly.
- Device toggle (desktop/mobile), Preview button, lock + undo/redo.
- **Theme / Canvas** toggle (Canvas = free-form layout mode).
- Demo storefront shows a "Everything in this page was built by Clyro — Try for free →" promo bar (their viral loop on shared/preview pages).

### Right — two tabs
- **Sections** tree, grouped **HEADER / TEMPLATE / FOOTER / OVERLAY**. Per-group "+" to add; per-item disclosure arrow (nested blocks); per-item visibility eye (e.g. "Image with text" hidden). Click a section → its settings. Page switcher (`Home page ▾`) on top. "These are the same controls your merchants will use."
- **Theme settings** (global), ordered: Logo · Colors · Typography · Layout · Buttons · Inputs · Cards · Product cards · Cart · Announcement bar · Header · Footer. "Change them here instead of editing code."

---

## Feature map — the 12-step in-product tour (verbatim intent)

| # | Feature | What it does |
|---|---------|--------------|
| 1 | **AI assistant** | Chat describes build/change/fix; AI writes code, preview updates live. |
| 2 | **Chat or Image mode** | Code edits vs AI visual generation, one input. |
| 3 | **Choose AI model** | Per-task model pick. "Faster models cost fewer credits but capable ones handle complex edits better." |
| 4 | **Inspect tool** | *"The most powerful feature."* Click any element in the preview to capture it as context — the AI knows exactly what you point at. "Use it before every message for precise, targeted edits." |
| 5 | **Preview** | Live, Shopify-accurate; reloads per edit. |
| 6 | **Code** | Browse/read raw Liquid, JSON, CSS. "Useful for debugging or understanding what the AI changed." |
| 7 | **Changes** | Per-session diff of everything AI modified; click a change to jump to the section. |
| 8 | **Sections** | Tree to rearrange/add/remove; click to edit settings. "Same controls your merchants use." |
| 9 | **Theme Settings** | Global fonts/colors/layout instead of editing code. |
| 10 | **Preview data** | Configure mock products/collections/discounts so preview looks realistic. CSV import or manual. |
| 11 | **Export to Shopify** | Download `.zip`, validated against Shopify's rules before handoff so it uploads cleanly. |
| 12 | **You're ready** | "Start small." Replay tour from help menu. "Tip: use Inspect before every message." |

## Clyro's AI assistant — self-described capabilities (from a live reply)
> "I can edit everything — sections, blocks, templates, settings, styles, scripts. I work directly on the files in your uploaded theme."
- **Build/restructure pages** by composing existing sections — *won't create new ones unless you genuinely need functionality the theme doesn't have.*
- **Tweak visuals** (colors, spacing, fonts, animations) via scoped CSS overrides.
- **Add interactivity** (toggles, animations, show/hide) with inline scripts.
- **Debug** (diagnose errors, find broken references, verify rendering).
- **Configure settings** (add customizer controls, wire into markup, validate).
- **Transfer designs** — rebuild a reference site from the theme's own pieces.

→ kenzo's AI doctrine mirrors this: **compose from existing block/section types first; only invent when the user truly needs something the library lacks.**

---

## Clyro → kenzo mapping (the whole point)

| Clyro concept | kenzo equivalent | Status |
|---------------|------------------|--------|
| Shopify theme | **Funnel** (one or more pages) | ✅ |
| Theme sections (Hero banner, Featured collection…) | **IC sections / blocks** (`ic-hero`, `ic-ticker`, `ic-cards`, `ic-faq`, `ic-apply`, `ic-cta`, `ic-results`) | ✅ |
| Section groups HEADER / TEMPLATE / FOOTER / OVERLAY | Same group names; OVERLAY = exit-intent / lead-capture popups + announcement bar | 📋 |
| Left-rail AI chat | **AI Builder** panel (`AiBuilderPanel.tsx`) | ✅ |
| Model picker in composer | model override in AI panel | 🔨 |
| 📎 attach/upload | image/asset upload into composer | 📋 |
| Chat / Image mode | Chat only for now (no image-gen) | — |
| **Inspect** (click element → AI context) | **Click block in preview → scopes next AI edit to it** (maps to existing targeted `ops`) | 📋 |
| Live preview | `BlockRenderer` + `resolveTokens(settings)` | ✅ |
| Code view | read-only **block JSON** viewer | 📋 |
| Changes (session diff) | session diff of AI ops | 📋 (deferred) |
| Sections tree | left sidebar section/element/layers → regrouped tree | 🔨 |
| Theme settings | **FunnelSettings** Settings tab | ✅ |
| Preview data (mock products/CSV) | **Preview-data layer** — mock offer/leads/testimonials/pricing | 🔨 |
| Templates page | **/templates gallery** | 📋 |
| Library (Pro) | **Library** of saved sections | 📋 |
| Export `.zip` (validated) | **Publish** to ISR `/f/[slug]` + share link (validate before publish) | 🔨 |
| Credits per message | **none** — kenzo does not meter credits | — |
| "Built by Clyro" promo bar | optional "Built with kenzo" badge on free funnels | 📋 |

## Notes / gaps
- App gated behind Google OAuth (blocks automation browsers) + email/password. Marketing site: `clyro.com`.
- Not yet captured in depth: Code view internals, Changes diff UI, Preview-data editor, Export dialog, `/templates` + Library pages, Canvas mode, settings sub-panels. Capture on a later pass if a doc needs the detail.
