# How It Works Section (Wrapper) Specification

## Overview
- **Target file:** `src/components/HowItWorksSection.tsx`
- **Screenshot:** `docs/design-references/scroll-1500-howitworks.png`
- **Interaction model:** Scroll-driven reveal (IntersectionObserver)

## DOM Structure
```
<section class="ld-wrap">
  <div class="ld-glow"> (decorative glow/gradient)
  <header class="ld-head reveal">
    <div class="ld-kicker"> "HOW IT WORKS"
    <h2 class="ld-title"> "Three steps to your first sale."
    <p class="ld-desc"> (description)
  <div class="ld-spine"> (vertical connector line)
    <div class="ld-spine-spark"> (animated glowing dot)
  <div class="ld-steps">
    <HowItWorksStep> x 3
  <button> (inline CTA)
```

## Computed Styles

### Section wrapper (.ld-wrap)
- position: relative
- padding: 120px 64px 160px
- overflow: hidden

### Glow (.ld-glow)
- position: absolute
- top: 0
- left: 50%
- transform: translateX(-50%)
- width: 800px
- height: 400px
- background: radial-gradient(ellipse at center, rgba(99,102,241,0.15), transparent 70%)
- pointer-events: none

### Header (.ld-head.reveal)
- textAlign: center
- marginBottom: 80px

### Kicker (.ld-kicker)
- Same kicker pattern: 11px, 600, #6366f1, letter-spacing 2px, uppercase, mb-4

### Title (.ld-title)
- fontSize: 42px
- fontWeight: 700
- color: #e8ecf1
- lineHeight: 1.1
- marginBottom: 16px

### Title emphasis (Instrument Serif italic #6366f1)

### Description (.ld-desc)
- fontSize: 18px
- color: #7f84a0
- maxWidth: 600px
- margin: 0 auto

### Spine (.ld-spine)
- position: absolute
- left: 50%
- transform: translateX(-50%)
- width: 1px
- height: calc(100% - 300px)
- top: 400px
- background: linear-gradient(to bottom, rgba(99,102,241,0.35), rgba(99,102,241,0.35) 94%, transparent)
- zIndex: 0

### Spine spark (.ld-spine-spark)
- position: absolute
- top: 0 (scroll-driven)
- left: 50%
- transform: translate(-50%, -50%)
- width: 28px, height: 28px
- SparkIcon with glow effect
- filter: drop-shadow(0 0 8px rgba(99,102,241,0.5))

### Steps container (.ld-steps)
- position: relative
- zIndex: 1 (above spine)
- display: flex
- flexDirection: column

### Inline CTA
- textAlign: center
- marginTop: 80px

## States

### Header reveal
- Hidden: opacity 0, transform: scale(0.96) translateY(24px)
- Visible: opacity 1, transform: none (.reveal.visible)

### Spine spark — scroll-driven position
- Position animates with scroll progress through the section
- Controlled by IntersectionObserver or scroll listener

## Text Content
- Kicker: "HOW IT WORKS"
- H2: "Three steps to your first sale."
- Description: "No coding, no design skills, no $4,500 tuition. Just the AI tools that already built 1,200+ stores - and the playbook to make them print."
- CTA: "Get Your Free Store & Course"

## Props
```ts
interface HowItWorksSectionProps {
  steps: HowItWorksStepProps[];
  className?: string;
}
```

## Responsive
- Desktop: spine centered, steps max-w-1200
- Tablet: spine hidden, left-aligned
- Mobile: spine hidden, full-width steps
