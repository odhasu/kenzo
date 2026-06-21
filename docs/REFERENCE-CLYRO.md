# Reference — Clyro (app.clyro.com)

> Captured 2026-06-21 via authenticated walkthrough. Clyro = "AI Theme Builder for Shopify."
> Directly analogous to our editor (see [EDITOR.md](EDITOR.md)): chat-driven AI builder with live preview + section tree. Use as UX/visual reference, not a feature spec.

## Product in one line
Describe changes in a chat; AI writes the theme code (Liquid/JSON/CSS) and the live preview updates in real time. Credit-metered, model-pick per message, export to a Shopify-validated `.zip`.

## Design tokens (pulled from computed CSS)

Dark-first, warm-paper neutral on near-black, single slate accent. Serif display + sans body.

| Token | Value | Use |
|-------|-------|-----|
| `--paper` / bg | `#1a1a1a` | app background |
| `--paper-panel` | `#222` | raised panels |
| `--paper-input` | `#00000047` | input fills |
| `--ink` | `#ffe` (255 255 238) | primary text (warm white) |
| `--ink-dim` | `#ffffeea6` | secondary text |
| `--ink-mute` | `#ffe6` | muted text |
| `--line` | `#ffffee14` | hairline borders (warm white @ ~8%) |
| `--accent-slate` / `--brand-ink` | `#283f4d` | accent / button-on-light ink |
| `--raw` | `#6ba0c0` | info blue |
| `--liquid` | `#6b9e7a` | success green |
| `--destructive` | `hsl(0 55% 52%)` | delete/danger |
| radius sm/md/lg | `.5rem` / `1rem` / `2.5rem` | section radius lg = `4rem` |
| body font | `Inter` | UI |
| display font | `Lora` (serif) | h1/headings |

Pattern worth stealing: **warm-white ink (`#ffe`) on `#1a1a1a` instead of pure `#fff` on `#000`** — softer, less harsh. All borders are tinted ink at low alpha, not gray.

## Layout architecture — 3-panel builder

```
┌─ top bar ───────────────────────────────────────────────────────────┐
│ [Aura ▾] | chat  inspect | Preview 🔒↶↷ | Theme▕Canvas | 📱 Home | Sections▕Settings ⬡ ? ☀ | Upgrade  Export │
├──────────────┬───────────────────────────────┬──────────────────────┤
│ LEFT          │ CENTER                         │ RIGHT                 │
│ AI chat       │ live storefront preview        │ Sections tree   OR    │
│ - empty state │ (desktop / mobile toggle)      │ Theme settings        │
│ - "Ask        │ exact Shopify render,          │                       │
│   anything…"  │ reloads on every AI edit       │                       │
│ - 📎 attach   │                                │                       │
│ - model pick  │                                │                       │
│   (Haiku 4.5) │                                │                       │
└──────────────┴───────────────────────────────┴──────────────────────┘
```

### Left — AI chat
- Empty state: "Start editing with AI: describe what you want to change."
- Input "Ask anything…", attach (📎), send.
- **Chat vs Image mode** toggle — same input field; Chat = edit theme code, Image = AI-generate visuals.
- **Model selector** inline in the composer (Haiku 4.5 shown; Opus 4.8 promoted as new). Faster model = fewer credits; capable model = complex edits.

### Center — live preview
- Renders theme exactly as on Shopify; every AI edit reloads instantly.
- Device toggle (desktop/mobile), Preview button, lock + undo/redo.
- **Theme / Canvas** mode toggle in top bar.

### Right — two tabs
- **Sections**: tree grouped HEADER / TEMPLATE / FOOTER / OVERLAY. Items: Announcement bar, Header · Hero banner, Featured collection, Text with Image, Double Card, Image with text, Rhodeslides, Hover Benefits · Footer · Cart drawer. Reorder / add / remove; click section → its settings. Per-item visibility toggle (eye). "+" to add per group. Page switcher (Home page ▾) above.
- **Theme settings** (global): Logo, Colors, Typography, Layout, Buttons, Inputs, Cards, Product cards, Cart, Announcement bar, Header, Footer.

## Feature map (from the 12-step in-product tour)

1. **AI assistant** — chat describes build/change/fix; AI writes code, preview updates live.
2. **Chat or Image mode** — code edits vs AI visual generation, one input.
3. **Choose AI model** — per-task model pick, credit/quality tradeoff.
4. **Inspect tool** ("most powerful feature") — click any element in preview to capture it as context so the AI knows exactly what you point at. Pitched as "use before every message."
5. **Preview** — live, Shopify-accurate, reloads per edit.
6. **Code** — browse raw Liquid/JSON/CSS; debugging / see what AI changed.
7. **Changes** — session diff of everything AI modified; click a change to jump to the section.
8. **Sections** — tree to rearrange/add/remove; click to edit settings ("same controls merchants use").
9. **Theme settings** — global fonts/colors/layout instead of editing code.
10. **Preview data** — mock products/collections/discounts for realistic preview; CSV import or manual.
11. **Export to Shopify** — download `.zip`, validated against Shopify rules before handoff.
12. **Done** — "start small"; replay tour from help menu; tip: Inspect before every message.

## Worth borrowing for kenzo
- **Inspect-to-context**: click element in preview → feeds AI as the edit target. Strongest idea; maps cleanly onto our funnel-block editing.
- **Session diff ("Changes")** with click-to-jump to the affected block.
- **Model picker + credit metering in the composer** (we have provider chain already — surface model choice + credit cost per message).
- **Chat / Image dual-mode** in one input.
- **Preview-data layer** (mock leads/offer/testimonials) so funnel preview looks real before publish.
- **Warm-ink-on-near-black** token system + serif display / sans body split.
- **Export with pre-validation** before handoff (our analog: publish-time checks before ISR deploy).

## Notes / gaps
- App is gated behind Google OAuth (blocks automation browsers) + email/password. Marketing site: clyro.com.
- Did not exercise: Code view, Changes diff, Preview-data editor, Export flow internals, Templates/Library pages, billing. Add on a later pass if needed.
