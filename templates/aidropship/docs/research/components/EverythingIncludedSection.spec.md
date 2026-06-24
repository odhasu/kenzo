# Everything Included Section Specification

## Overview
- **Target file:** `src/components/EverythingIncludedSection.tsx`
- **Screenshot:** `docs/design-references/desktop-fullpage.png`
- **Interaction model:** Static

## DOM Structure
```
<section class="sec-std stack-sec">
  <header>
    <div> "EVERYTHING THAT'S INCLUDED" (kicker)
    <h2> "The full stack. <em>Zero to start.</em>"
    <p> (description)
  <div> (package card)
    <div> "YOUR PACKAGE · 4 ITEMS" (card header)
    <div> (4 item rows)
      each: icon | name + desc | value price
    <div> (totals)
      "TOTAL VALUE $4,500" | "YOUR PRICE TODAY Free"
  <p> (warning "This won't be free forever")
  <button> (CTA)
  <p> "NO CARD · NO STRINGS · 100% FREE"
```

## Computed Styles

### Section container
- padding: 120px 64px
- position: relative
- maxWidth: 1200px
- margin: 0 auto

### Kicker
- fontSize: 11px
- fontWeight: 600
- letterSpacing: 2px
- color: #6366f1
- textTransform: uppercase
- marginBottom: 16px

### H2
- fontSize: 42px
- fontWeight: 700
- color: #e8ecf1
- lineHeight: 1.1
- marginBottom: 16px

### H2 emphasis
- fontFamily: "Instrument Serif", serif
- fontStyle: italic
- color: #6366f1

### Description
- fontSize: 18px
- color: #7f84a0
- maxWidth: 600px
- marginBottom: 48px
- lineHeight: 1.6

### Package card
- backgroundColor: rgba(99, 102, 241, 0.04)
- borderRadius: 20px
- border: 1px solid rgba(255, 255, 255, 0.06)
- padding: 40px
- maxWidth: 600px

### Card header
- display: flex
- justifyContent: space-between
- marginBottom: 24px
- "YOUR PACKAGE": fontWeight 600, color #e8ecf1
- "4 ITEMS": fontSize 12px, color #7f84a0

### Item row
- display: flex
- alignItems: flex-start
- gap: 16px
- padding: 20px 0
- borderBottom: 1px solid rgba(255, 255, 255, 0.06)

### Item icon (zap/star)
- ZapIcon or SparkIcon
- color: #6366f1
- marginTop: 4px
- width: 20px

### Item name
- fontSize: 16px
- fontWeight: 600
- color: #e8ecf1
- marginBottom: 4px

### Item description
- fontSize: 14px
- color: #7f84a0
- lineHeight: 1.5

### Item value price
- fontSize: 16px
- fontWeight: 600
- color: #7f84a0
- textAlign: right
- whiteSpace: nowrap

### Totals row
- display: flex
- justifyContent: space-between
- paddingTop: 24px
- "TOTAL VALUE": color #7f84a0, fontSize 16px
- "$4,500": color #7f84a0, fontSize 20px, textDecoration: line-through
- "YOUR PRICE TODAY": color #e8ecf1, fontWeight 600
- "Free": fontSize 24px, fontWeight 700, color #22c55e (green) or gradient

### Warning text
- textAlign: center
- color: #7f84a0
- fontSize: 14px
- marginTop: 24px
- marginBottom: 16px

### Fine print
- textAlign: center
- fontSize: 11px
- color: #7f84a0
- letterSpacing: 1px

## States

### Item row hover
- backgroundColor: rgba(99, 102, 241, 0.04)
- transition: background-color 0.2s

### CTA hover
- Same as CtaButton spec

## Text Content (verbatim)
- Kicker: "EVERYTHING THAT'S INCLUDED"
- H2: "The full stack. Zero to start."
- Description: "Not a gated demo. Every tool, training, and support channel operators actually use to run stores that work."
- Items:
  1. "AI Store Builder" / "Fully built AI online store. Products, branding, suppliers, checkout - live in under 10 minutes." / "$500"
  2. "The AI Dropshipping Masterclass" / "The full A-Z program: winning products, ads, campaign set-up, LLC, lifetime access." / "$2,500"
  3. "Daily Live Coaching" / "5 calls a week, Mon–Fri. Live store reviews, ad teardowns, Q&A with 7-figure operators." / "$1,000"
  4. "Private Community" / "1,000+ operators posting wins, supplier leads, creative swaps - shared daily." / "$500"
- Total value: "$4,500"
- Your price: "Free"
- Warning: "⚡ This won't be free forever. Our partners currently cover the cost - but that could change at any time."
- CTA: "Claim Your Free Store & Course"
- Fine print: "NO CARD · NO STRINGS · 100% FREE"

## Assets
- ZapIcon, SparkIcon from icons.tsx
- ArrowRightIcon from icons.tsx (in CTA)
- CtaButton component

## Props
```ts
interface EverythingIncludedSectionProps {
  className?: string;
}
```

## Responsive
- Desktop: centered max-w-3xl, card max-w-xl
- Mobile: full-width, card padding 24px, single column item rows
