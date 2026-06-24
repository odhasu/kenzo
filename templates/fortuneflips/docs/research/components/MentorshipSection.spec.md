# MentorshipSection Specification

## Overview
- **Target file:** `src/components/MentorshipSection.tsx`
- **Screenshot:** `docs/design-references/full-page-desktop-1440.png`
- **Interaction model:** Scroll-driven (mobile swipe), static (desktop grid)

## DOM Structure
```
section.relative.py-12.md:py-20.overflow-hidden
├── div.pointer-events-none.absolute.inset-0 (radial gradient overlay)
├── div.relative.mx-auto.max-w-4xl.px-4
│   ├── h2.text-center: "What's Inside The Mentorship?"
│   └── p.mt-4 (mobile only "Swipe to explore" + chevron icon)
└── div.mt-5.md:px-4
    ├── div.flex.gap-3.overflow-x-auto.px-4.pb-4.snap-x.snap-mandatory.scrollbar-none.md:hidden (mobile)
    │   ├── Card 1: Direct Access / 1-on-1 Guidance
    │   ├── Card 2: Vendor Network / Verified Vendors
    │   ├── Card 3: Training Library / Training Vault
    │   ├── Card 4: Proven Systems / Scaling Blueprint
    │   └── Card 5: Join the Movement / Private Community
    └── div.mx-auto.hidden.max-w-4xl.md:block.md:px-0 (desktop grid)
        └── (3-column grid of same 5 cards)
```

## Computed Styles

### Section
- padding: 48px 0 (mobile), 80px 0 (desktop md:py-20)
- position: relative
- overflow: hidden

### Radial Gradient Overlay
- position: absolute, inset 0
- background: radial-gradient(at 50% 0%, rgba(60,255,20,0.08) 0%, transparent 60%)
- pointer-events: none

### Heading
- fontSize: 20px (text-xl mobile), 24px (md:text-2xl desktop)
- fontWeight: 800 (font-extrabold)
- color: rgb(250, 250, 250) (text-foreground)
- textAlign: center
- letterSpacing: -0.5px (tracking-tight)

### "Swipe to explore" (mobile only md:hidden)
- display: flex, alignItems: center, justifyContent: center
- gap: 6px
- fontSize: 12px (text-xs)
- color: hsl(220 10% 55%) (text-muted-foreground)
- marginTop: 16px

### Mobile Scroll Container (md:hidden)
- display: flex
- gap: 12px
- overflowX: auto
- padding: 0 16px 16px
- scrollSnapType: x mandatory
- scrollbar-width: none (hidden scrollbar)

### Mobile Card (w-[72vw] shrink-0 snap-center)
- width: 72vw (~280px at 390px viewport)
- flexShrink: 0
- scrollSnapAlign: center
- cursor: pointer
- display: flex, flexDirection: column
- borderRadius: 16px (rounded-2xl)
- border: 1px solid rgba(39,44,52,0.5) (border-border/50)
- padding: 16px
- backdropFilter: blur(8px)
- backgroundColor: rgba(21,24,30,0.7) (bg-card/70)
- transition: all 0.3s

### Card Gradient Overlay (absolute, inside card)
- borderRadius: 16px
- position: absolute, inset 0
- Card 1: linear-gradient(to right bottom, rgba(59,130,246,0.2), rgba(6,182,212,0.1))
- Card 2: linear-gradient(to right bottom, rgba(16,185,129,0.2), rgba(34,197,94,0.1))
- Card 3: linear-gradient(to right bottom, rgba(139,92,246,0.2), rgba(168,85,247,0.1))
- Card 4: linear-gradient(to right bottom, rgba(245,158,11,0.2), rgba(249,115,22,0.1))
- Card 5: linear-gradient(to right bottom, rgba(244,63,94,0.2), rgba(236,72,153,0.1))
- opacity: 0.4
- transition: opacity 0.3s

### Card Content (relative z-10)
- position: relative, z-index: 10

### Card Header Row (flex items-start justify-between)
- display: flex, justifyContent: space-between, alignItems: flex-start

### Card Icon Container
- width: 40px, height: 40px (h-10 w-10)
- borderRadius: 12px (rounded-xl)
- backgroundColor: rgba(60,255,20,0.1) (bg-primary/10)
- display: flex, alignItems: center, justifyContent: center

### Card Icon (lucide-react, h-5 w-5)
- Card 1: MessageCircle (lucide-message-circle)
- Card 2: CircleCheckBig (lucide-circle-check-big)
- Card 3: BookOpen (lucide-book-open)
- Card 4: TrendingUp (lucide-trending-up)
- Card 5: Users (lucide-users)
- color: var(--primary)
- strokeWidth: 1.8

### Card Tag (badge)
- fontSize: 10px
- fontWeight: 700 (font-bold)
- padding: 4px 10px
- borderRadius: 9999px (rounded-full)
- backgroundColor: rgba(60,255,20,0.1) (bg-primary/10)
- color: var(--primary)

### Card Title (h3)
- fontSize: 16px (text-base)
- fontWeight: 700 (font-bold)
- color: var(--foreground)
- marginTop: 12px

### Card Description (p)
- fontSize: 12px (text-xs)
- lineHeight: 1.625 (leading-relaxed)
- color: var(--muted-foreground)
- marginTop: 4px

### "Tap to learn more" (mobile only)
- display: flex, alignItems: center, gap: 4px
- fontSize: 10px
- fontWeight: 500
- color: rgba(60,255,20,0.7) (text-primary/70)
- marginTop: 12px

### Desktop Grid (hidden md:block)
- maxWidth: 896px (max-w-4xl)
- margin: 0 auto
- display: grid, gridTemplateColumns: repeat(3, 1fr)
- gap: 16px
- Cards same style but without w-[72vw], instead fill grid cells

## States & Behaviors

### Entrance Animation
- **Trigger:** Scroll into viewport
- **Heading initial:** opacity: 0, transform: translateY(10px)
- **Cards initial:** opacity: 0, transform: scale(0.95)
- **Heading animate:** opacity: 1, transform: none
- **Cards animate:** opacity: 1, transform: scale(1)
- **Implementation:** Framer Motion or IntersectionObserver

### Card Hover
- **Property changes:** gradient overlay opacity likely increases, subtle scale/shadow change
- **Transition:** all 0.3s

### Mobile Scroll Snap
- CSS scroll-snap-type: x mandatory on container
- CSS scroll-snap-align: center on cards
- No JS needed — pure CSS

## Per-State Content (5 cards)

### Card 1: Direct Access
- Tag: "Direct Access"
- Title: "1-on-1 Guidance"
- Description: "Get my personal phone number and calendar to book 1-on-1 calls and text me whenever — unlimited access"
- Icon: MessageCircle
- Gradient: from-blue-500/20 to-cyan-500/10

### Card 2: Vendor Network
- Tag: "Vendor Network"
- Title: "Verified Vendors"
- Description: "Get access to my full list of 50+ top-tier vendors from around the world — including StockX and Alias passing vendors"
- Icon: CircleCheckBig
- Gradient: from-emerald-500/20 to-green-500/10

### Card 3: Training Library
- Tag: "Training Library"
- Title: "Training Vault"
- Description: "Get 5+ hours of custom training modules covering every aspect of reselling — from your first listing to consistent sales"
- Icon: BookOpen
- Gradient: from-violet-500/20 to-purple-500/10

### Card 4: Proven Systems
- Tag: "Proven Systems"
- Title: "Scaling Blueprint"
- Description: "Get a custom scaling blueprint crafted around your situation to reach $5–10K+ per month in under 90 days"
- Icon: TrendingUp
- Gradient: from-amber-500/20 to-orange-500/10

### Card 5: Join the Movement
- Tag: "Join the Movement"
- Title: "Private Community"
- Description: "Join a community of 100+ like-minded elite resellers to connect, learn, and build with"
- Icon: Users
- Gradient: from-rose-500/20 to-pink-500/10

## Assets
- Icons: MessageCircle, CircleCheckBig, BookOpen, TrendingUp, Users from lucide-react
- ChevronRight from lucide-react
- No images needed

## Responsive Behavior
- **Desktop (1440px):** 3-column grid (max-w-4xl), no swipe text
- **Tablet (768px):** 3-column grid (max-w-4xl)
- **Mobile (390px):** Horizontal swipe cards w-[72vw], "Swipe to explore" hint text
- **Breakpoint:** md: 768px (swipe → grid)
