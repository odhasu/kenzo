# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Screenshot:** `docs/design-references/full-page-desktop-1440.png` (top section)
- **Interaction model:** Static with scroll-triggered entrance animation

## DOM Structure
```
section.hero-gradient.relative.overflow-hidden.px-4.pt-8.pb-4.md:pt-16.md:pb-8
└── div.mx-auto.max-w-3xl.text-center
    ├── div.inline-flex.items-center.gap-2.rounded-full.border (badge)
    │   └── span.h-2.w-2.rounded-full.bg-primary.animate-pulse (pulsing dot)
    │   └── text: "Free Training Reveals:"
    └── h1
        └── text: "See How Regular People Are Making "
        └── span.text-primary: "$5K-$20K/Month"
        └── text: " With Reselling Automation"
```

## Computed Styles

### Section Container
- background: radial-gradient(80% 50% at 50% -20%, rgba(60,255,20,0.08) 0%, rgba(0,0,0,0) 60%), linear-gradient(rgb(16,19,24), rgb(8,10,12))
- padding: 64px 16px 32px (desktop: pt:64px, pb:32px, px:16px)
- position: relative
- overflow: hidden

### Content Wrapper (div.mx-auto.max-w-3xl.text-center)
- maxWidth: 768px
- margin: 0 auto (centered)

### Badge (inline-flex.items-center.gap-2.rounded-full.border)
- display: inline-flex
- alignItems: center
- gap: 8px
- padding: 6px 16px
- borderRadius: 9999px
- border: 1px solid rgba(60, 255, 20, 0.3)
- backgroundColor: rgba(60, 255, 20, 0.1)
- color: rgb(60, 255, 20) (--primary)
- fontSize: 14px
- fontWeight: 500
- lineHeight: 20px
- marginBottom: 20px

### Pulsing Dot (span.h-2.w-2.rounded-full.bg-primary.animate-pulse)
- width: 8px
- height: 8px
- borderRadius: 9999px
- backgroundColor: rgb(60, 255, 20) (--primary)
- animation: pulse (Tailwind animate-pulse)

### H1
- fontSize: 60px (desktop md:text-5xl lg:text-6xl → 60px), 24px (mobile text-2xl → 24px)
- fontWeight: 800 (extrabold)
- lineHeight: 60px (1.2 ratio at 60px)
- letterSpacing: -1.5px (tracking-tight)
- color: rgb(250, 250, 250) (--foreground)
- marginBottom: 24px

### H1 Green Span (.text-primary)
- color: rgb(60, 255, 20) (--primary)
- All other properties inherit from h1

## States & Behaviors

### Entrance Animation
- **Trigger:** Scroll into viewport (IntersectionObserver)
- **State A (before):** opacity: 0, transform: translateY(10px) for badge and heading
- **State B (after):** opacity: 1, transform: none (observed on live site: elements have inline style `opacity: 1; transform: none;`)
- **Implementation:** Framer Motion `motion.div` with `initial`, `whileInView` props, or simple CSS transition + IntersectionObserver

## Assets
- No images in this section
- Icons: None (badge uses CSS dot with animate-pulse)

## Text Content (verbatim)
- Badge: "Free Training Reveals:"
- H1 part 1: "See How Regular People Are Making "
- H1 green span: "$5K-$20K/Month"
- H1 part 2: " With Reselling Automation"

## Responsive Behavior
- **Desktop (1440px):** max-w-3xl centered, heading text-5xl/lg:text-6xl (60px), pt-16 pb-8
- **Tablet (768px):** max-w-3xl, heading md:text-5xl
- **Mobile (390px):** full width padding px-4, heading text-2xl (24px), pt-8 pb-4
- **Breakpoint:** md: 768px
