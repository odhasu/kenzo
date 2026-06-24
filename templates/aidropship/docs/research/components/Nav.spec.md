# Nav Specification

## Overview
- **Target file:** `src/components/Nav.tsx`
- **Screenshot:** `docs/design-references/desktop-fullpage.png` (top section)
- **Interaction model:** Static (no scroll-triggered changes)

## DOM Structure
```
<nav class="fade-up w-full h-16 flex items-center">
  <div> (max-width container)
    <a> "AI Dropshipping Builder" (logo text only, no image)
```

## Computed Styles

### Nav container
- height: 64px (h-16)
- position: relative
- z-index: 10
- backgroundColor: transparent
- borderBottom: 1px solid rgba(255, 255, 255, 0.06)
- padding: 0px 64px (px-6 md:px-12 lg:px-16 on desktop)

### Logo link
- fontSize: 16px
- fontWeight: 400
- color: #e8ecf1 (foreground)
- textDecoration: none
- fontFamily: "DM Sans", sans-serif

### Content layout
- display: flex
- alignItems: center
- justifyContent: space-between
- maxWidth: 1280px (or full width with padding)

## States

### Hover (logo link)
- opacity: 0.8 or color shift
- transition: color 0.2s

## Text Content
"AI Dropshipping Builder"

## Assets
- SparkIcon from icons.tsx (small spark before "AI" text)

## Props
```ts
interface NavProps {
  className?: string;
}
```

## Responsive
- Desktop: px-16 (64px padding)
- Tablet: px-12 (48px)
- Mobile: px-6 (24px)
