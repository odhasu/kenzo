# Store Card + Stores Section Specification

## Overview
- **Target files:** `src/components/StoreCard.tsx`, `src/components/StoresSection.tsx`
- **Screenshot:** `docs/design-references/desktop-fullpage.png`
- **Interaction model:** Static with scroll-triggered reveal, hover on cards

## StoresSection DOM
```
<section class="sec-std stores-sec">
  <header>
    <div> "BUILT BY AI" (kicker)
    <h2> "E-com stores that our AI has built."
    <p> (description)
  <div> (3x2 grid of StoreCard)
```

## StoreCard DOM
```
<article>
  <div> (browser chrome)
    <div> (dots: red, yellow, green)
    <div> "https://your-store.ai" (fake URL bar)
  <div> (screenshot)
    <img>
```

## Computed Styles

### StoresSection
- padding: 120px 64px
- maxWidth: 1200px
- margin: 0 auto

### Section header (same pattern as other sections)
- Kicker: 11px, 600, #6366f1, letter-spacing 2px, uppercase
- H2: 42px, 700, #e8ecf1, line-height 1.1, margin-bottom 16px
- H2 emphasis: Instrument Serif italic, #6366f1
- Description: 18px, #7f84a0, max-width 600px, margin-bottom 64px

### Grid
- display: grid
- gridTemplateColumns: repeat(3, 1fr) desktop
- gap: 24px

### StoreCard
- borderRadius: 16px
- overflow: hidden
- backgroundColor: rgba(99, 102, 241, 0.04)
- border: 1px solid rgba(255, 255, 255, 0.06)
- transition: transform 0.3s, border-color 0.3s

### Browser chrome
- backgroundColor: #1a1a1e
- padding: 12px 16px
- display: flex
- alignItems: center
- gap: 12px

### Chrome dots
- 3 circles: red (#ef4444), yellow (#eab308), green (#22c55e)
- width: 10px, height: 10px, borderRadius: 50%
- display: inline-block, gap: 6px

### URL bar
- backgroundColor: rgba(255,255,255,0.06)
- borderRadius: 6px
- padding: 4px 12px
- fontSize: 11px
- color: #7f84a0
- fontFamily: "JetBrains Mono", monospace

### Screenshot img
- width: 100%
- height: auto
- aspectRatio: ~4:3 or 16:10
- objectFit: cover

## States

### Card hover
- transform: translateY(-4px)
- borderColor: rgba(99, 102, 241, 0.3)
- boxShadow: 0 12px 40px rgba(99, 102, 241, 0.1)

### Scroll reveal
- opacity: 0 → 1, transform: scale(0.96) translateY(56px) → none

## Text Content
- Kicker: "BUILT BY AI"
- H2: "E-com stores that our AI has built."
- Description: "Six real student stores, designed and deployed by our AI. Product research, copy, design, supplier setup - all handled. You sign off in minutes, not weeks."

## Assets
- `public/stores/01.avif` through `06.avif`

## Props
```ts
interface StoreCardProps {
  image: string;
  url?: string;
  className?: string;
}

interface StoresSectionProps {
  className?: string;
}
```

## Responsive
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column
