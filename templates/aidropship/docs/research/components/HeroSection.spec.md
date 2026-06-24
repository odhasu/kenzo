# Hero Section Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Screenshot:** `docs/design-references/scroll-500.png`
- **Interaction model:** Static with scroll-triggered fade-up animation

## DOM Structure
```
<section class="flex flex-col items-center pt-24 md:pt-32 lg:pt-40 pb-8 px-6">
  <h1> (heading with Instrument Serif emphasis spans)
  <div class="hero-props"> (3 stat badges)
  <div> (video container)
  <p> (IMPORTANT notice)
  <button> (CTA)
  <p> (social proof)
```

## Computed Styles

### Section wrapper
- display: flex
- flexDirection: column
- alignItems: center
- paddingTop: 96px (or 128px lg)
- paddingBottom: 32px
- paddingLeft: 24px
- paddingRight: 24px
- maxWidth: 100%
- textAlign: center

### H1 Heading
- fontSize: 38px (clamp: 28px → 48px)
- fontWeight: 700
- lineHeight: 1.1 (36px at 38px)
- fontFamily: "DM Sans", sans-serif
- color: #e8ecf1
- textAlign: center
- maxWidth: 800px
- marginBottom: 32px

### H1 Emphasis spans ("$4,500...", "for free")
- fontFamily: "Instrument Serif", serif
- fontStyle: italic
- fontSize: inherit (38px)
- color: #6366f1
- fontWeight: 400

### Stats container (.hero-props)
- display: grid
- gridTemplateColumns: repeat(3, 1fr) on desktop
- gap: 10px
- maxWidth: 640px
- marginBottom: 24px

### Stat badge
- display: flex
- alignItems: center
- gap: 8px
- padding: 8px 16px
- borderRadius: 8px
- backgroundColor: rgba(99, 102, 241, 0.08) (subtle indigo bg)
- border: 1px solid rgba(99, 102, 241, 0.12)

### Stat value
- fontSize: 18px
- fontWeight: 700
- color: #e8ecf1

### Stat label
- fontSize: 12px
- color: #7f84a0
- textTransform: uppercase
- letterSpacing: 0.5px

### Video container
- maxWidth: 320px (portrait aspect ~9:16)
- borderRadius: 16px
- overflow: hidden
- position: relative
- boxShadow: 0 0 60px rgba(99, 102, 241, 0.15)
- marginBottom: 24px

### IMPORTANT notice
- color: rgba(232, 236, 241, 0.7)
- fontSize: 14px
- marginBottom: 12px
- "IMPORTANT:" prefix bold/white

### CTA button (uses CtaButton component, primary variant)
- bg: #6366f1, white text, 12px radius, 16px 32px padding

### Social proof
- fontSize: 13px
- color: #7f84a0
- marginTop: 8px

## States & Behaviors

### Scroll-triggered fade-up
- Each child has fade-up class
- Opacity: 0 → 1, transform: scale(0.96) translateY(56px) → none
- Delays: d2 (heading), d3 (stats+video), d6 (CTA)

### CTA hover
- transform: scale(1.02)
- boxShadow: 0 8px 30px rgba(99, 102, 241, 0.3)

### Video
- Auto-plays muted
- "Your Video Is Playing / Click To Unmute" overlay

## Text Content
- Heading: "Build your store with AI in 10 minutes + get access to my $4,500 AI dropshipping program for free."
- Emphasis 1: "$4,500 AI dropshipping program"
- Emphasis 2: "for free"
- Stats: "10 min store build" / "$4,500 course included" / "$0 upfront cost"
- Notice: "IMPORTANT: This may be your only chance to get a fully built online store & course for free. If you close this page you may never see this offer again."
- CTA: "Get Your Free Store & Course"
- Social: "Join 1,500+ happy customers"

## Assets
- ArrowRightIcon from icons.tsx (in CTA)
- Video player icons (PlayIcon)

## Props
```ts
interface HeroSectionProps {
  className?: string;
}
```

## Responsive
- Desktop: h1 48px, 3-column stats, video 320px
- Tablet: h1 36px, stats wrap
- Mobile: h1 28px, single-column stats, full-width video, CTA full-width
