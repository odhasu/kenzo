# Editor — the 3-panel AI funnel builder

Modeled 1:1 on [Clyro's builder](REFERENCE-CLYRO.md). Left AI chat composer, center live preview, right Sections tree / Settings — plus Code view and a Preview-data layer.

## 3-Panel layout

```
┌─ top bar ─────────────────────────────────────────────────────────────────┐
│ [Funnel ▾] │ 💬Chat ✦Inspect │ 👁Preview ↶↷ │ 📱desktop/mobile │ Sections▕Settings ⬡Code ? ☀ │ Publish │
├──────────────────┬───────────────────────────────────┬──────────────────────┤
│ LEFT — AI chat    │ CENTER — live preview              │ RIGHT — Sections OR   │
│ ~360px            │ flex                               │ Settings · ~300px     │
│                   │                                    │                       │
│ composer:         │ live render of funnel blocks,      │ ▤ Sections tree       │
│  Ask anything…    │ theme-driven, reloads on AI edit   │   HEADER / TEMPLATE /  │
│  📎  model ▾   ↑  │ click block → select + SCOPE       │   FOOTER / OVERLAY    │
│                   │ next AI edit to it (Inspect)       │ ⚙ Settings tabs       │
└──────────────────┴───────────────────────────────────┴──────────────────────┘
```

Component: `components/editor/EditorLayout.tsx` ✅. Error boundary: `components/editor/CanvasErrorBoundary.tsx` ✅.

> **Migration note:** today the left panel is a Sidebar (section/element/layers pickers) and the right panel holds Settings/Business/AI-Builder tabs. The Clyro-aligned target moves the **AI chat to the LEFT rail** and the **Sections tree to the RIGHT** alongside Settings. Track this re-layout in [ROADMAP.md](ROADMAP.md).

---

## Left — AI chat composer 🔨→📋

The primary way to build. Mirrors Clyro's composer.

- **Empty state**: "Start editing with AI: describe what you want to change. — Describe your changes and I'll handle the rest."
- **Composer**: `Ask anything…` textarea · **📎 attach/upload** (image/asset) 📋 · **model picker** inline (`✦ <model> ▾`) 🔨 · send (↑).
- **Messages** stack above the composer; chat history persisted to `chat_messages` (`console_type='editor'`) ✅.
- **Scoped edits** (Inspect): if a block is selected in the preview, the message edits **only that block**; otherwise it edits the whole funnel. See [AI.md](AI.md#scoped-edits--inspect).
- Component: `components/editor/AiBuilderPanel.tsx` ✅. Sends `{blocks, settings, prompt, model, funnelId, selectedId?}` → `POST /api/ai` → `{blocks|ops, settings, explanation}`.
- **No credits** — no credit counter, no "report conversation" footer (kenzo drops Clyro's metering).

---

## Center — live preview ✅

- Live render of all blocks in order via `BlockRenderer`.
- Theme-driven: reads CSS custom properties from `resolveTokens(settings)` injected at root.
- **Click a block → selects it** (accent outline) AND arms scoping for the next AI message (Inspect). Hover → subtle outline.
- **Device toggle**: desktop / mobile 📋.
- Read-only mode reused by live preview and `/f/[slug]`.
- Error boundary wraps the entire render tree — never whitescreens, even on malformed AI output.

---

## Right — Sections tree 🔨→📋

Replaces the old left Sidebar's section/element/layers pickers. Grouped exactly like Clyro:

| Group | Holds | Status |
|-------|-------|--------|
| **HEADER** | Announcement bar, Header/nav | 📋 (new block types) |
| **TEMPLATE** | The funnel body: `ic-hero`, `ic-ticker`, `ic-cards`, `ic-results`, `ic-faq`, `ic-apply`, `ic-cta` + basic elements | ✅ blocks exist |
| **FOOTER** | Footer | 📋 (new block type) |
| **OVERLAY** | Exit-intent popup, lead-capture modal | 📋 (new block types) |

Per-group **"+"** to add a section · per-item **disclosure arrow** for nested blocks · per-item **visibility eye** (hide without deleting) 📋 · click a section → opens its settings · drag to reorder 📋. Page switcher on top (single-page funnels for now; multi-page 📋).

Adding a section inserts it with `DEFAULT_PROPS[type]`.

---

## Right — Settings tabs ✅

### Settings tab (theme/global)
Maps to Clyro's Theme settings. Structured into groups:

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

Two families in `types/blocks.ts`:

### Basic elements
| Type | Props |
|------|-------|
| `heading` | `text`, `level?` (h1/h2/h3), `align?` |
| `text` | `text`, `align?` |
| `button` | `label`, `href`, `style?`, `size?` |
| `image` | `src`, `alt`, `fit?`, `width?`, `height?` |
| `form` | `fields` (email/name/phone) |

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
- Every setting exposed; AI can modify everything (blocks + settings + customCss)
- No locked sections, no "pro only" blocks
- **AI composes from existing block/section types first** — only invents when the user genuinely needs something the library lacks (Clyro's rule)
