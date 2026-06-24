# VSLSection Specification

## Overview
- **Target file:** `src/components/VSLSection.tsx`
- **Screenshot:** `docs/design-references/full-page-desktop-1440.png` (second section)
- **Interaction model:** Click-driven (video play button, CTA button)

## DOM Structure
```
section#vsl.px-4.pb-8.md:pb-12
└── div.mx-auto.max-w-3xl
    ├── div.glow-border.relative.overflow-hidden.rounded-2xl.bg-card (video container)
    │   └── div.relative.w-full (pb: 56.25% = 16:9)
    │       └── button.absolute.inset-0 (click target)
    │           ├── img.absolute.inset-0.object-cover (thumbnail)
    │           ├── div.absolute.inset-0.bg-black/30 (dark overlay)
    │           └── div.relative.z-10.rounded-full.bg-primary.shadow-lg (play button)
    │               └── PlayIcon (lucide-react)
    └── div.mt-6.text-center (CTA container)
        └── button.bg-primary.text-primary-foreground (CTA button)
            └── text: "Apply For The Inner Circle"
```

## Computed Styles

### Section
- padding: 0px 16px 32px (desktop: pb:48px)
- No special background (transparent)

### Content Wrapper
- maxWidth: 768px (max-w-3xl)

### Video Container (glow-border)
- borderRadius: 16px (rounded-2xl)
- overflow: hidden
- boxShadow: 0 0 40px -10px hsl(110 100% 54% / 0.3) (glow-border class)
- backgroundColor: hsl(220 18% 10%) (bg-card)

### Video Aspect Ratio Wrapper
- paddingBottom: 56.25% (16:9)
- position: relative
- width: 100%

### Thumbnail Image
- objectFit: cover
- position: absolute
- inset: 0
- width/height: 100%

### Dark Overlay
- backgroundColor: rgba(0, 0, 0, 0.3)
- position: absolute
- inset: 0

### Play Button Circle
- width/height: 64px mobile (h-16 w-16), 80px desktop (md:h-20 md:w-20)
- borderRadius: 9999px (rounded-full)
- backgroundColor: hsl(110 100% 54%) (bg-primary)
- boxShadow: 0 10px 15px -3px rgba(0,0,0,0.1)

### Play Icon
- lucide-react Play icon
- width/height: 28px mobile (h-7 w-7), 36px desktop (md:h-9 md:w-9)
- color: black (text-primary-foreground fill-primary-foreground)
- marginLeft: 4px (ml-1) — optical centering

### CTA Button
- display: inline-flex
- alignItems: center
- justifyContent: center
- gap: 8px
- backgroundColor: hsl(110 100% 54%) (bg-primary)
- color: black (text-primary-foreground)
- fontWeight: 900 (font-black)
- fontSize: 18px mobile, 20px desktop
- padding: 0 40px mobile, 0 56px desktop
- height: 56px mobile (h-14), 64px desktop (md:h-16)
- borderRadius: 12px (rounded-xl)
- boxShadow: 0 10px 15px -3px hsl(110 100% 54% / 0.25)
- transition: all 0.2s

## States & Behaviors

### CTA Button Hover
- **Property changes:** boxShadow becomes more intense (shadow-primary/40), filter: brightness(1.1)
- **Transition:** all 0.2s ease

### Video Play Button Hover
- **Property changes:** Play circle likely scales slightly or brightness changes
- **Transition:** all 0.2s

## Assets
- Thumbnail: `/images/vsl-thumbnail.webp` (downloaded from /assets/vsl-thumbnail-BA6OM7ay.webp)
- Icons: Play from lucide-react

## Text Content (verbatim)
- CTA button: "Apply For The Inner Circle"

## Responsive Behavior
- **Desktop (1440px):** max-w-3xl centered, play button 80px, CTA button h-16
- **Tablet (768px):** Same as desktop
- **Mobile (390px):** Full width px-4, play button 64px, CTA button h-14
- **Breakpoint:** md: 768px
