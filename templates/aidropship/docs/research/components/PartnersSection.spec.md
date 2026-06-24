# Partners Section Specification

## Overview
- **Target file:** `src/components/PartnersSection.tsx`
- **Screenshot:** `docs/design-references/desktop-fullpage.png`
- **Interaction model:** Static

## DOM Structure
```
<section class="relative pt-4 pb-8 overflow-hidden">
  <p> "OUR PARTNERS" (label)
  <div> (logo row, flex wrap)
    <img> Wix logo
    <img> TikTok logo
    <img> AutoDS logo
    <img> Hostinger logo
```

## Computed Styles

### Section container
- paddingTop: 16px
- paddingBottom: 32px
- position: relative
- overflow: hidden

### Label
- textAlign: center
- fontSize: 11px
- fontWeight: 600
- letterSpacing: 2px (approx)
- color: #7f84a0 (muted-foreground)
- marginBottom: 24px
- textTransform: uppercase

### Logo row
- display: flex
- justifyContent: center
- alignItems: center
- gap: 48px (or more on desktop)
- flexWrap: wrap

### Logo images
- height: 32-40px (uniform)
- width: auto
- opacity: 0.7 (muted partner logos)
- filter: brightness(0) invert(1) opacity(0.7) — white version of logos on dark bg

## Text Content
Label: "OUR PARTNERS"

## Assets
- `public/partners/wix.avif` — Wix logo
- `public/partners/tiktok.avif` — TikTok logo
- `public/partners/autods.avif` — AutoDS logo
- `public/partners/hostinger.avif` — Hostinger logo

## Props
```ts
interface PartnersSectionProps {
  className?: string;
}
```

## Responsive
- Desktop: logos in a row, large gap
- Tablet: 2x2 grid or tight row
- Mobile: 2x2 grid, smaller logos
