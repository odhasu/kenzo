# Editor — the 3-panel AI funnel builder

Modeled 1:1 on [Clyro's builder](REFERENCE-CLYRO.md). Left **Kenzo AI** chat, center live preview, right section list → per-section Settings + Theme. The whole app chrome uses Clyro's dark warm-paper look (see [App look](#app-look--clyro-dark)).

## 3-Panel layout

```
┌─ top bar ─────────────────────────────────────────────────────────────────┐
│ [Funnel ▾] │ ✦Inspect │ 👁Preview ↶↷ │ 📱desktop/mobile │ Sections▕Theme ? │ Publish │
├──────────────────┬───────────────────────────────────┬──────────────────────┤
│ LEFT — Kenzo AI   │ CENTER — live preview              │ RIGHT — Sections list │
│ ~360px            │ flex                               │ → per-section settings│
│                   │                                    │   + Theme · ~300px    │
│ composer:         │ live render of funnel blocks,      │ ▤ Section list        │
│  Ask anything…    │ theme-driven, reloads on AI edit   │   click → its settings│
│            ↑/■    │ click section → select + open its  │   (text/colors/fonts) │
│                   │ settings + SCOPE next AI edit      │ ⚙ Theme tab (global)  │
└──────────────────┴───────────────────────────────────┴──────────────────────┘
```

Component: `components/editor/EditorLayout.tsx` ✅. Error boundary: `components/editor/CanvasErrorBoundary.tsx` ✅.

> **Entry:** the editor is only reached by picking a template in the [gallery](TEMPLATES.md) → "Use template" seeds the funnel. There is no build-from-scratch path. See [CREATE-FLOW.md](CREATE-FLOW.md).

---

## Left — Kenzo AI chat 🔨

One chat per funnel, branded **Kenzo AI**. Mirrors Clyro's composer, minus the extras we don't ship.

- **Empty state**: "Start editing with AI: describe what you want to change. — Describe your changes and I'll handle the rest."
- **Composer**: `Ask anything…` textarea + **send** (↑). While a reply streams, send becomes a **Stop** (■) that aborts the request (`AbortController`) and keeps the partial text.
- **Thinking → reply → edit.** Kenzo AI is a thinking partner, not an auto-editor. Each turn streams its **full reasoning** (collapsible block above the reply), then a conversational **reply**, then applies an edit **only if the request was a clear change**. Questions, advice, and vague asks get a reply or one clarifying question — the page is left untouched. Full doctrine in [AI.md](AI.md#core-doctrine--think-first-edit-only-when-clear).
- **Edits apply straight to the canvas** the moment they arrive (no confirm step); **Undo** (↶) reverts the last AI edit.
- **No model picker** — one model, no provider names in the UI. **No file upload** (no 📎). **No sessions sidebar** (single chat, like Clyro).
- **Messages** stack above the composer; persisted to `chat_messages` (`console_type='editor'`, keyed by `funnel_id`). On reopen, the funnel's prior messages load — the chat remembers.
- **Scoped edits** (Inspect): if a section is selected in the preview, the message edits **only that section**; otherwise it edits the whole funnel. See [AI.md](AI.md#scoped-edits--inspect).
- Component: `components/editor/AiBuilderPanel.tsx`. Sends `{blocks, settings, prompt, funnelId, selectedId?}` → `POST /api/ai` → SSE: `thinking` deltas, then `{ action, reply, question?, ops|blocks, settings }`.
- **No credits** — no credit counter, no "report conversation" footer.

---

## Center — live preview ✅

- Live render of all blocks in order via `BlockRenderer`.
- Theme-driven: reads CSS custom properties from `resolveTokens(settings)` injected at root.
- **Click a section → selects it** (accent outline), **opens its settings on the right**, AND arms scoping for the next AI message (Inspect). Hover → subtle outline.
- **Device toggle**: desktop / mobile 📋.
- Read-only mode reused by live preview and `/f/[slug]`.
- Error boundary wraps the entire render tree — never whitescreens, even on malformed AI output.

---

## Right — Section list → per-section settings 🔨

The default right-panel view. A list of the funnel's sections in order. Optionally grouped like Clyro (all current block types fall under TEMPLATE):

| Group | Holds | Status |
|-------|-------|--------|
| **HEADER** | Announcement bar, Header/nav | 📋 (new block types) |
| **TEMPLATE** | The funnel body: `ic-hero`, `ic-ticker`, `ic-cards`, `ic-results`, `ic-faq`, `ic-apply`, `ic-cta` + basic elements | ✅ blocks exist |
| **FOOTER** | Footer | 📋 (new block type) |
| **OVERLAY** | Exit-intent popup, lead-capture modal | 📋 (new block types) |

Per-item **visibility eye** (`block.hidden`, hide without deleting) · **click a section → opens its settings** (or click it in the preview) · drag to reorder · add/remove. A **"Browse templates"** button links to `/templates`. Adding a section inserts it with `DEFAULT_PROPS[type]`.

### Per-section settings (when a section is selected)

Shows **as many controls as possible** for that one section — no raw custom-CSS box:

- **Content** — driven by the block's props. E.g. `ic-hero`: badge/headline/subtext/ctaLabel/ctaHref; `ic-cards`: headline + editable card list (title/desc/bullets) + cta; `ic-faq`: editable Q/A list; `ic-ticker`: editable items; basic blocks: their props. Array props get add/remove/reorder.
- **Style overrides for this section** — background color, text color, accent color, heading font, body font, font scale, alignment, vertical padding/spacing, button style, border radius. A **"Reset to theme"** clears the section's overrides.

Per-section style is stored on the block itself in `page.content` (`block.style`) — see [Per-section style](#per-section-style-). No DB migration.

---

## Right — Theme tab (global) ✅

Maps to Clyro's Theme settings — the global defaults every section inherits unless overridden. Structured into groups:

- **Theme picker**: 4 presets (`dark-green`, `dark-minimal`, `light-clean`, `light-blue`)
- **Colors**: Accent, Background, Text (hex inputs)
- **Typography**: Font family, heading font, font scale (0.8–1.2), letter spacing, font weight
- **Layout**: Max width (600–1400px), section spacing, border radius
- **Buttons**: Style (filled/outline/ghost), size (sm/md/lg), border radius
- **Effects**: Glow, gradient headlines, glassmorphism
- **Ticker speed**: 8–80 seconds
- **Background**: 10 options (none, gradient, particles, grid, glow, aurora, dots, noise, waves, stars)
- **Page**: Title, favicon URL, OG image URL, Facebook Pixel ID
- **Advanced**: Custom CSS (injected at page root)

### Business tab ✅
- Loads/upserts `business_profiles` by `user_id`
- Fields: niche, offer type, price, audience, pain points, transformation, tone, social proof
- Component: `components/editor/BusinessSettingsPanel.tsx`
- Doubles as the **Preview-data** source (below).

---

## Code view 📋

Read-only browse of the funnel's underlying structure — Clyro's Code tab, scoped to what we have:
- The `Block[]` JSON (content) + the `FunnelSettings` object + resolved CSS vars.
- "Useful for debugging or understanding what the AI changed."
- Read-only; edits happen via chat or Settings.

---

## Preview-data layer 🔨→📋

Clyro's "Preview data" (mock products/collections/discounts). kenzo's analog makes the funnel preview look real before publish:
- Mock **offer** (name, price, payment terms), **testimonials/results**, **social-proof numbers**, **lead/booking samples**.
- Seeded from `business_profiles` ✅; extendable with a dedicated mock set 📋.
- Used only in the builder preview — never on the published page.

---

## Autosave ✅

- All changes auto-saved via `lib/funnels.ts → savePage(pageId, blocks)`
- Debounced 800ms
- Settings changes also trigger save

---

## Block types

Every block also carries optional `hidden?: boolean` (visibility eye) and `style?: BlockStyle` (per-section overrides — see [Per-section style](#per-section-style-)). Two families in `types/blocks.ts`:

### Basic elements
| Type | Props |
|------|-------|
| `heading` | `text`, `level?` (h1/h2/h3), `align?` |
| `text` | `text`, `align?` |
| `button` | `label`, `href`, `style?`, `size?` |
| `image` | `src`, `alt`, `fit?`, `width?`, `height?` |
| `form` | `fields` (email/name/phone) |
| `code` 🔨 | `html` (raw HTML/CSS/JS string) — the AI's "full power" escape hatch for interactivity (countdowns, toggles, embeds) the typed blocks can't express. **Editor preview renders it fully; the published `/f/[slug]` page sanitizes it** (whitelisted embeds kept, arbitrary inline JS stripped) to block XSS against visitors. See [AI.md](AI.md#raw-code-is-sanitized-on-publish). |

### IC sections (theme-aware) ✅
| Type | Props |
|------|-------|
| `ic-hero` | `badge`, `headline`, `subtext`, `ctaLabel`, `ctaHref` |
| `ic-ticker` | `items` (string[]) |
| `ic-cards` | `headline`, `cards[]` ({title, desc, bullets[]}), `ctaLabel`, `ctaHref` |
| `ic-faq` | `headline`, `items[]` ({q, a}) |
| `ic-apply` | `headline`, `subtext` |
| `ic-cta` | `label`, `href`, `subtext` |
| `ic-results` | `headline`, `photos[]` |

### Planned section types 📋 (to fill HEADER / FOOTER / OVERLAY)
| Type | Group | Props (proposed) |
|------|-------|------------------|
| `ic-announcement` | HEADER | `text`, `href?` |
| `ic-header` | HEADER | `logo?`, `links[]`, `ctaLabel?` |
| `ic-footer` | FOOTER | `columns[]`, `legal?` |
| `ic-popup` | OVERLAY | `trigger` (exit/timed/scroll), `headline`, `fields[]`, `ctaLabel` |

---

## Per-section style 🔨

Per-section colors/fonts/spacing live **inside the block**, in `page.content` JSON — no schema change. `types/blocks.ts` adds:

```typescript
export interface BlockStyle {
  bgColor?: string; textColor?: string; accentColor?: string
  headingFont?: string; bodyFont?: string; fontScale?: number
  align?: 'left' | 'center' | 'right'
  paddingY?: number; borderRadius?: number
  buttonStyle?: ButtonStyle
}
// Block = BlockProps & { id: string; hidden?: boolean; style?: BlockStyle }
```

`BlockRenderer` wraps each block in a section element and applies `block.style` as inline CSS custom properties that **override the global theme tokens for that section only**. Unset fields fall back to the theme. The AI ops engine can set `block.style` via `update_block` (style is just part of the block). Applies on the published page too.

## App look — Clyro dark

The **app chrome** (top bar, rails, panels, gallery, dashboard) uses Clyro's warm-paper dark palette — **not** the funnel preview content, which keeps its own theme via `resolveTokens`. Tokens in [REFERENCE-CLYRO.md](REFERENCE-CLYRO.md): app bg `#1a1a1a`, panels `#222`, warm-white ink `#ffe`, borders = ink at low alpha (never gray), slate accent `#283f4d`, Inter body + Lora serif headings.

## FunnelSettings ✅

Full settings object in `types/blocks.ts` → `DEFAULT_SETTINGS`:

```typescript
interface FunnelSettings {
  theme: ThemeId                    // 'dark-green' | 'dark-minimal' | 'light-clean' | 'light-blue'
  accentColor: string; bgColor: string; textColor: string   // hex override or ""
  font: string; headingFont: string
  fontScale: number                 // 0.8–1.2
  letterSpacing: LetterSpacing; fontWeight: FontWeight
  maxWidth: number                  // 600–1400
  sectionSpacing: SectionSpacing; borderRadius: number
  buttonStyle: ButtonStyle; buttonSize: ButtonSize; buttonRadius: number
  glowEnabled: boolean; gradientHeadlines: boolean; glassmorphism: boolean
  tickerSpeed: number               // 8–80
  background: BackgroundId          // 10 options
  pageTitle: string; faviconUrl: string; ogImage: string; pixelId: string
  customCss: string
}
```

## Themes ✅

4 presets in `lib/themes.ts`:

| Preset | BG | Accent | Vibe |
|--------|-----|--------|------|
| `dark-green` | `#050505` | `#39FF14` neon green | Default, IC look |
| `dark-minimal` | `#0a0a0a` | `#ffffff` white | Lucas waitlist |
| `light-clean` | `#ffffff` | `#111111` black | Uncovered |
| `light-blue` | `#ffffff` | `#2563eb` blue | Agency |

`resolveTokens(settings)` merges preset CSS vars with per-field overrides.

## "Edit everything" doctrine ✅

- Every block can be added, removed, reordered, duplicated
- Every prop editable (inline or via Settings)
- Every setting exposed; AI can modify everything (blocks + settings + customCss + raw `code` block)
- No locked sections, no "pro only" blocks
- **AI composes from existing block/section types first** — only invents new structure (or drops to a raw `code` block) when the user genuinely needs something the library lacks (Clyro's rule)
- **But it edits only when the request is clear.** Full power is the *ceiling*, not the default reflex — the AI thinks first and won't touch the funnel on a question or a vague ask. See [AI.md](AI.md#core-doctrine--think-first-edit-only-when-clear).
