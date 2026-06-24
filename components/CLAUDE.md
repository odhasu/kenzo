# TERMINAL 3 — COMPONENTS

This terminal owns all UI components. No app routes, no DB, no server logic.

**Full spec → [../docs/](../docs/README.md)** — see [EDITOR.md](../docs/EDITOR.md) for editor architecture, [CREATE-FLOW.md](../docs/CREATE-FLOW.md) for the template-first create flow.

## Folder structure
```
components/
├── blocks/               ← Rendered block components (used by editor + /f/[slug])
│   └── BlockRenderer.tsx     maps block.type → component (supports editable + read-only)
├── editor/               ← Block + AI editor
│   ├── EditorLayout.tsx     3-panel editor (sidebar + canvas + properties/AI chat)
│   ├── BusinessSettingsPanel.tsx  business profile upsert
│   ├── AiBuilderPanel.tsx   AI chat sidebar (Kenzo AI thinking builder)
│   └── CanvasErrorBoundary.tsx  isolates canvas render errors
├── templates/            ← Template gallery + "Use template" (the create path)
├── funnel/               ← Funnel chrome (e.g. FunnelBackground)
├── pipeline/             ← Leads kanban
├── landing/              ← Marketing landing components
├── waitlist/             ← Waitlist components
├── innercircle/          ← OGs Inner Circle standalone funnel
├── refernces/            ← REFERENCE ONLY — clyro/opbot clones (never imported)
├── _ref-ogresell/        ← REFERENCE ONLY — original IC components
└── _ref-inspiration/     ← REFERENCE ONLY — screenshots
```

## Theming (CSS custom properties)
All section blocks read CSS vars injected at page root. Theme presets in `lib/themes.ts`. See [docs/EDITOR.md](../docs/EDITOR.md#themes) for full theme + background docs.

## Rules
- No imports from `_ref-*` or `refernces/` folders in production code
- `blocks/` components support both `editable` and read-only render modes
