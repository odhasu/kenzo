# How It Works Step Specification

## Overview
- **Target file:** `src/components/HowItWorksStep.tsx`
- **Screenshot:** `docs/design-references/scroll-1500-howitworks.png`
- **Interaction model:** Scroll-driven reveal (IntersectionObserver)

## DOM Structure
```
<div class="ld-step reveal">
  <div class="ld-step-node"> (number badge "01")
  <div class="ld-step-copy"> (text side)
    <div class="ld-step-eyebrow"> "STEP ONE · 10 MINUTES"
    <h3 class="ld-step-title"> "Build your store with <em>AI.</em>"
    <p class="ld-step-desc"> (description)
    <div class="ld-chips"> (feature chips)
  <div class="ld-step-visual"> (image side)
    <img class="ld-step-img">
```

## Computed Styles

### Step wrapper (.ld-step)
- display: grid
- gridTemplateColumns: 1fr 1fr (desktop)
- gap: 80px (desktop)
- alignItems: center
- padding: 80px 0
- minHeight: 500px

### Reverse variant (.ld-step.reverse)
- grid direction: image first, then text
- (or change column order)

### Number badge (.ld-step-node)
- fontSize: 14px
- fontWeight: 600
- color: #6366f1
- width: 48px
- height: 48px
- borderRadius: 50%
- border: 1px solid rgba(99, 102, 241, 0.3)
- display: flex
- alignItems: center
- justifyContent: center
- marginBottom: 24px
- backgroundColor: rgba(99, 102, 241, 0.08)

### Eyebrow (.ld-step-eyebrow)
- fontSize: 11px
- fontWeight: 600
- letterSpacing: 2px
- color: #6366f1
- textTransform: uppercase
- marginBottom: 12px

### Title (.ld-step-title)
- fontSize: 32px
- fontWeight: 700
- color: #e8ecf1
- fontFamily: "DM Sans", sans-serif
- lineHeight: 1.15
- marginBottom: 16px

### Title emphasis (em or span)
- fontFamily: "Instrument Serif", serif
- fontStyle: italic
- color: #6366f1
- fontWeight: 400

### Description (.ld-step-desc)
- fontSize: 16px
- lineHeight: 1.6
- color: #7f84a0
- maxWidth: 480px
- marginBottom: 24px

### Feature chips (.ld-chips)
- display: flex
- flexDirection: column
- gap: 12px

### Chip (.ld-chip)
- display: flex
- alignItems: center
- gap: 10px
- fontSize: 14px
- color: #e8ecf1
- padding: 8px 0

### Chip check icon
- CheckIcon from icons.tsx
- color: #6366f1
- width: 13px, height: 13px

### Visual wrapper (.ld-step-visual)
- position: relative
- borderRadius: 16px
- overflow: hidden
- boxShadow: 0 0 60px rgba(99, 102, 241, 0.12)

### Image (.ld-step-img)
- width: 100%
- height: auto
- borderRadius: 12px

## States

### Hidden (before reveal)
- opacity: 0
- transform: scale(0.96) translateY(56px)

### Visible (after reveal)
- opacity: 1
- transform: none
- transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)

## Props
```ts
interface HowItWorksStepProps {
  number: string;        // "01", "02", "03"
  eyebrow: string;       // "STEP ONE · 10 MINUTES"
  title: string;         // "Build your store with "
  emphasis: string;      // "AI."
  description: string;
  chips: { label: string }[];
  image: { src: string; alt: string };
  visualType: "screenshot" | "mockup" | "zoom-call";
  reverse?: boolean;
  className?: string;
}
```

## Responsive
- Desktop: 2-column grid, 80px gap
- Tablet: 2-column, 40px gap, smaller title
- Mobile: single column, image first, 40px padding
