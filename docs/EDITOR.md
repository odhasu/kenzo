# Editor

## 3-Panel layout

```
┌──────────┬────────────────────┬─────────────┐
│ Sidebar  │                    │ Properties  │
│ 220px    │    Canvas (flex)   │ 260px       │
│          │                    │             │
│ Sections │  Live render of    │ Settings    │
│ Elements │  funnel blocks     │ Business    │
│ Layers   │  Theme-driven      │ AI Builder  │
│          │  Click = select    │             │
└──────────┴────────────────────┴─────────────┘
```

Component: `components/editor/EditorLayout.tsx`

## Left Panel — Sidebar (220px)

Three sections:
1. **Section picker**: IC section types (`ic-hero`, `ic-ticker`, `ic-cards`, `ic-faq`, `ic-apply`, `ic-cta`, `ic-results`)
2. **Element picker**: Basic types (`heading`, `text`, `button`, `image`, `form`)
3. **Layers list**: Ordered list of all blocks on the page — click to select, drag to reorder (future)

Clicking a section/element adds it to the canvas with `DEFAULT_PROPS[type]`.

## Center — Canvas (flex)

- Live render of all blocks in order
- Theme-driven: reads CSS custom properties from `resolveTokens(settings)` injected at root
- Click a block → selects it (accent-colored outline)
- Hover → subtle outline
- Read-only mode available (used by live preview and `/f/[slug]`)
- Error boundary wraps entire render tree

## Right Panel — Properties (260px)

Three tabs:

### Settings tab
- **Theme picker**: 4 presets (`dark-green`, `dark-minimal`, `light-clean`, `light-blue`)
- **Color overrides**: Accent, Background, Text (hex inputs)
- **Typography**: Font family, heading font, font scale (0.8–1.2), letter spacing, font weight
- **Layout**: Max width (600–1400px), section spacing, border radius
- **Buttons**: Style (filled/outline/ghost), size (sm/md/lg), border radius
- **Effects**: Glow enabled, gradient headlines, glassmorphism
- **Ticker speed**: 8–80 seconds
- **Background**: 10 options (none, gradient, particles, grid, glow, aurora, dots, noise, waves, stars)
- **Page**: Title, favicon URL, OG image URL, Facebook Pixel ID
- **Advanced**: Custom CSS (injected at page root)

### Business tab
- Loads/upserts `business_profiles` by `user_id`
- Fields: niche, offer type, price, audience, pain points, transformation, tone, social proof
- Component: `components/editor/BusinessSettingsPanel.tsx`

### AI Builder tab
- Chat interface (`components/editor/AiBuilderPanel.tsx`)
- Sends `{blocks, settings, prompt, model, funnelId}` → POST `/api/ai`
- Returns `{blocks, settings, explanation}`
- Chat history persisted to `chat_messages` table
- User can specify model override

## Autosave

- All changes auto-saved via `lib/funnels.ts → savePage(pageId, blocks)`
- Debounced 800ms
- Settings changes also trigger save

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

### IC sections (theme-aware)
| Type | Props |
|------|-------|
| `ic-hero` | `badge`, `headline`, `subtext`, `ctaLabel`, `ctaHref` |
| `ic-ticker` | `items` (string[]) |
| `ic-cards` | `headline`, `cards[]` ({title, desc, bullets[]}), `ctaLabel`, `ctaHref` |
| `ic-faq` | `headline`, `items[]` ({q, a}) |
| `ic-apply` | `headline`, `subtext` |
| `ic-cta` | `label`, `href`, `subtext` |
| `ic-results` | `headline`, `photos[]` |

## FunnelSettings

Full settings object in `types/blocks.ts` → `DEFAULT_SETTINGS`. Every field can be overridden:

```typescript
interface FunnelSettings {
  theme: ThemeId                    // 'dark-green' | 'dark-minimal' | 'light-clean' | 'light-blue'
  accentColor: string               // hex override or "" for theme default
  bgColor: string                   // hex override or ""
  textColor: string                 // hex override or ""
  font: string                      // 'Inter' | 'Satoshi' | 'DM Sans' | ...
  headingFont: string               // same options, or "" to match body
  fontScale: number                 // 0.8–1.2
  letterSpacing: LetterSpacing      // 'tight' | 'normal' | 'wide'
  fontWeight: FontWeight            // 'regular' | 'medium' | 'bold'
  maxWidth: number                  // 600–1400
  sectionSpacing: SectionSpacing    // 'compact' | 'normal' | 'spacious'
  borderRadius: number              // 0–24
  buttonStyle: ButtonStyle          // 'filled' | 'outline' | 'ghost'
  buttonSize: ButtonSize            // 'sm' | 'md' | 'lg'
  buttonRadius: number              // 0–50
  glowEnabled: boolean
  gradientHeadlines: boolean
  glassmorphism: boolean
  tickerSpeed: number               // 8–80
  background: BackgroundId          // 10 options
  pageTitle: string
  faviconUrl: string
  ogImage: string
  pixelId: string                   // Facebook Pixel
  customCss: string                 // raw CSS
}
```

## Themes

4 presets in `lib/themes.ts`:

| Preset | BG | Accent | Vibe |
|--------|-----|--------|------|
| `dark-green` | `#050505` | `#39FF14` neon green | Default, IC look |
| `dark-minimal` | `#0a0a0a` | `#ffffff` white | Lucas waitlist |
| `light-clean` | `#ffffff` | `#111111` black | Uncovered |
| `light-blue` | `#ffffff` | `#2563eb` blue | Agency |

`resolveTokens(settings)` merges preset CSS vars with per-field overrides.

## Backgrounds

10 options in `types/blocks.ts` → `BackgroundId`:
`none | gradient | particles | grid | glow | aurora | dots | noise | waves | stars`

## "Edit everything" doctrine

- Every block can be added, removed, reordered, duplicated
- Every prop editable (inline or via properties panel)
- Every setting exposed
- AI can modify everything (blocks + settings + customCss)
- No locked sections, no "pro only" blocks
