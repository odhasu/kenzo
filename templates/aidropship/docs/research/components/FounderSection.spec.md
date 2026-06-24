# Founder Section Specification

## Overview
- **Target file:** `src/components/FounderSection.tsx`
- **Screenshot:** `docs/design-references/desktop-fullpage.png`
- **Interaction model:** Static with scroll-triggered reveal

## DOM Structure
```
<section class="sec-std founder-sec" style="backgroundColor: #080911">
  <div> (2-column grid)
    <div> (left - photo)
      <img> founder photo
      <div> (badge overlay)
        "Nathan" / "FOUNDER"
      <div> (social handle)
        <img> small icon / "@nathan"
    <div> (right - text)
      <div> "A NOTE FROM THE FOUNDER" (kicker)
      <span> " (quote mark)
      <h2> "Wait - what's the catch? How is all of this free?"
      <p> x 8 paragraphs
      <ul> 6 benefits
      <div> (signature)
        "Nathan Nazareth" / "FOUNDER, AI DROPSHIPPING BUILDER"
  <button> (CTA)
  <p> "NO CARD · NO STRINGS · 100% FREE"
```

## Computed Styles

### Section bg
- backgroundColor: #080911

### 2-column grid
- display: grid
- gridTemplateColumns: 1fr 1fr (desktop)
- gap: 80px
- alignItems: center
- maxWidth: 1200px
- margin: 0 auto

### Photo container
- position: relative
- borderRadius: 20px
- overflow: hidden

### Photo
- width: 100%
- height: auto
- src: public/founder.avif

### Name badge (overlaid bottom-left of photo)
- position: absolute
- bottom: 24px
- left: 24px
- backgroundColor: rgba(0,0,0,0.6)
- backdropFilter: blur(12px)
- borderRadius: 12px
- padding: 12px 20px

### Badge name
- fontSize: 18px
- fontWeight: 600
- color: #e8ecf1

### Badge role
- fontSize: 11px
- color: #7f84a0
- letterSpacing: 2px
- textTransform: uppercase

### Social handle
- position: absolute
- top: 24px
- right: 24px
- display: flex, alignItems: center, gap: 6px
- backgroundColor: rgba(0,0,0,0.5)
- borderRadius: 20px
- padding: 6px 14px
- fontSize: 13px
- color: #e8ecf1

### Kicker
- color: #6366f1
- fontSize: 11px
- fontWeight: 600
- letterSpacing: 2px
- textTransform: uppercase
- marginBottom: 16px

### Quote mark
- fontSize: 72px
- color: #6366f1
- fontFamily: "Instrument Serif", serif
- lineHeight: 0.8
- display: block

### H2
- fontSize: 36px
- fontWeight: 700
- color: #e8ecf1
- lineHeight: 1.15
- marginBottom: 24px

### H2 emphasis
- fontFamily: "Instrument Serif", serif
- fontStyle: italic
- color: #6366f1

### Paragraphs
- fontSize: 16px
- lineHeight: 1.7
- color: #c0c4d4 (softer than main text)
- marginBottom: 20px

### Emphasis within paragraphs
- fontFamily: "Instrument Serif", serif
- fontStyle: italic
- color: #e8ecf1 (not indigo, just white)

### Benefits list
- listStyle: none
- padding: 0
- marginBottom: 32px

### Benefit item
- padding: 8px 0
- paddingLeft: 28px
- position: relative
- fontSize: 16px
- color: #e8ecf1
- "✓" pseudo-element, color #6366f1, position absolute left 0

### Signature
- borderTop: 1px solid rgba(255,255,255,0.08)
- paddingTop: 24px
- marginTop: 8px

### Signature name
- fontSize: 18px
- fontWeight: 600
- color: #e8ecf1

### Signature role
- fontSize: 12px
- color: #7f84a0
- letterSpacing: 1px
- textTransform: uppercase

## Text Content (verbatim)
- Kicker: "A NOTE FROM THE FOUNDER"
- H2: "Wait - what's the catch? How is all of this free?"
- P1: "Look. I know what you're thinking. There has to be a catch. Nobody gives away $4,500 of stuff for free."
- P2: "So let me spill it all here."
- P3: "You see, we're partnered with billion-dollar companies like Wix, TikTok, and Snapchat. They trust us enough to foot the bill. They pay us to bring people like you in and actually help you succeed, because when you win, you become a long-term user and everyone wins."
- P4: "That means the course, the coaching, the community, the store we build for you - none of that costs you anything."
- P5: "The only thing you do pay for is the Wix subscription to host your store online. And that's about the same as a Netflix account."
- P6: "That money doesn't even come to us - it goes straight to Wix, because you'd need hosting no matter where you built a store. It's not something we charge for."
- P7: "So for less than a Netflix subscription, you get:"
- Benefits: "A fully built store", "A $4,500 course", "5x weekly mentorship calls", "24/7 support", "The product research tool, business tools, exclusive ad credits", "And a community of 1,000 people all figuring this out together"
- P8: "That's it. No upsell, no pressure, no "oh by the way we also sell a $4k program" at the end. We get paid when you succeed, so we're genuinely going to do everything we can to make sure you do."
- Signature: "Nathan Nazareth" / "FOUNDER, AI DROPSHIPPING BUILDER"
- CTA: "Claim Your Free Store & Course"
- Fine print: "NO CARD · NO STRINGS · 100% FREE"

## Assets
- `public/founder.avif` — founder photo
- CtaButton component
- SparkIcon (for social badge)

## Props
```ts
interface FounderSectionProps {
  className?: string;
}
```

## Responsive
- Desktop: 2-column grid, photo left
- Tablet: 2-column, tighter gap
- Mobile: single column, photo first, text below
