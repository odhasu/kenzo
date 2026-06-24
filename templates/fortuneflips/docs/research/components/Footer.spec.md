# Footer Specification

## Overview
- **Target file:** `src/components/Footer.tsx`
- **Screenshot:** `docs/design-references/full-page-desktop-1440.png` (bottom section)
- **Interaction model:** Static

## DOM Structure
```
footer.border-t.border-border.bg-background.px-4.py-6
└── p.text-sm.text-muted-foreground
    └── "© 2026 Fortune Flips. All rights reserved."
```

## Computed Styles

### Footer
- backgroundColor: rgb(12, 14, 18) (--background)
- borderTop: 1px solid rgb(39, 44, 52) (--border)
- padding: 24px 16px
- textAlign: center

### Copyright Text
- fontSize: 14px (text-sm)
- color: hsl(220 10% 55%) (text-muted-foreground)
- lineHeight: 20px

## States & Behaviors
- N/A (pure static text)

## Assets
- None

## Text Content (verbatim)
- "© 2026 Fortune Flips. All rights reserved."

## Responsive Behavior
- Same at all breakpoints (simple centered text)
