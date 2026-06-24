# TestimonialsSection Specification

## Overview
- **Target file:** `src/components/TestimonialsSection.tsx`
- **Screenshot:** `docs/design-references/full-page-desktop-1440.png`
- **Interaction model:** Static with scroll-triggered entrance animations

## DOM Structure
```
section.px-4.py-10.md:py-16
└── div.mx-auto.max-w-4xl
    ├── h2: "See What Our Students Are Saying"
    ├── Featured Video (16:9 landscape)
    │   └── glow-border.overflow-hidden.rounded-xl.bg-card
    │       └── div.relative (paddingBottom: 56.25%)
    │           └── button (video wrapper)
    │               ├── img (student thumbnail)
    │               ├── div.bg-black/30 (overlay)
    │               └── div (play button: 56px circle, bg-primary/90)
    │       └── div.bg-card.px-3.py-2 (title bar)
    │           └── p: "How This 19 Year Old Makes " + span.text-primary "$17,000/Month"
    ├── div.mt-4.grid.grid-cols-2.gap-4 (2-column video grid)
    │   ├── Video Card 2: "$5K/Mo at 15 Years Old" (9:16 portrait)
    │   └── Video Card 3: "$2K/Week In Highschool" (9:16 portrait)
    ├── h2.mt-16: "A Few More Results"
    └── div.flex.gap-3 (2-column masonry grid)
        ├── div.flex.flex-1.flex-col.gap-3 (column 1: 8 result screenshots)
        └── div.flex.flex-1.flex-col.gap-3 (column 2: 8 result screenshots)
```

## Computed Styles

### Section
- padding: 40px 16px (mobile), 64px 16px (desktop md:py-16)

### Heading
- fontSize: 24px (text-2xl mobile), 30px (md:text-3xl desktop)
- fontWeight: 800 (font-extrabold)
- color: var(--foreground)
- textAlign: center
- "See What Our Students Are Saying": marginBottom: 32px (mb-8)
- "A Few More Results": marginTop: 64px (mt-16), marginBottom: 24px (mb-6)

### Featured Video Card (glow-border)
- borderRadius: 12px (rounded-xl)
- overflow: hidden
- boxShadow: 0 0 40px -10px hsl(110 100% 54% / 0.3)
- backgroundColor: var(--card)

### Video Aspect Ratio
- Featured: paddingBottom: 56.25% (16:9) with 1280x720 thumbnail
- Grid videos: paddingBottom: 177.78% (9:16) with 720x1280 thumbnails

### Video Overlay
- backgroundColor: rgba(0, 0, 0, 0.3)
- display: flex, alignItems: center, justifyContent: center

### Play Button (featured)
- width/height: 56px (h-14 w-14)
- borderRadius: 9999px
- backgroundColor: hsl(110 100% 54% / 0.9) (bg-primary/90)
- boxShadow: 0 10px 15px -3px rgba(0,0,0,0.1)

### Play Icon (featured: 24px, grid: same)
- lucide-react Play icon, h-6 w-6 (24px)
- color: black
- marginLeft: 2px (ml-0.5) — optical centering

### Video Title Bar
- backgroundColor: var(--card)
- padding: 8px 12px
- Featured title: fontSize: 14px (text-sm), fontWeight: 700
- Grid title: fontSize: 12px (text-xs), fontWeight: 700
- Color: var(--foreground), green highlights in text-primary

### Result Screenshot Container
- borderRadius: 12px (rounded-xl)
- overflow: hidden
- border: 1px solid var(--border)
- Background (placeholder): var(--muted)
- Each has unique aspect-ratio set via style prop

### Result Images
- width: 100%, height: auto, display: block
- object-fit: cover (effectively through width/height auto)

## States & Behaviors

### Entrance Animation
- **Trigger:** Scroll into viewport (IntersectionObserver)
- **State A:** opacity: 0, transform: translateY(15px)
- **State B:** opacity: 1, transform: none
- All video cards and result screenshots animate independently

### Video Play Button Hover
- Likely subtle scale or brightness change on play circle
- cursor: pointer on buttons

## Per-State Content

### Featured Video
- Title prefix: "How This 19 Year Old Makes "
- Title highlight: "$17,000/Month"
- Thumbnail: /images/student-thumb-1.webp
- Aspect: 16:9 (1280x720)

### Grid Video 1
- Title highlight: "$5K/Mo"
- Title suffix: " at 15 Years Old"
- Thumbnail: https://img.youtube.com/vi/YKagzvb3EJI/0.jpg
- Aspect: 9:16 (720x1280)

### Grid Video 2
- Title highlight: "$2K/Week"
- Title suffix: " In Highschool"
- Thumbnail: https://img.youtube.com/vi/lZXLYIhGhAY/0.jpg
- Aspect: 9:16 (720x1280)

### Result Screenshots (16 total, 8 per column)
Column 1:
- result-1.webp (1200x1169) — "Result screenshot 1"
- result-4.webp (1200x1192) — "Result screenshot 4"
- result-6.webp (1200x1509) — "Result screenshot 6"
- result-8.webp (1200x1431) — "Result screenshot 8"
- result-11.webp (1200x1256) — "Result screenshot 11"
- result-12.webp (1200x1853) — "Result screenshot 12"
- result-15.webp (1200x1380) — "Result screenshot 15"
- student-cash.webp (1200x1119) — "Student cash and products result"

Column 2:
- result-2.webp — "Result screenshot 2"
- result-3.webp — "Result screenshot 3"
- result-5.webp — "Result screenshot 5"
- result-7.webp — "Result screenshot 7"
- result-9.webp — "Result screenshot 9"
- result-10.webp — "Result screenshot 10"
- result-13.webp — "Result screenshot 13"
- result-14.webp — "Result screenshot 14"
- student-colognes.webp — "Student week 1 selling colognes result"
- student-5k-colognes.webp — "Student $5K cologne sales result"
- student-stan-store.webp — "Student Stan Store revenue screenshot"

(Some columns may differ slightly; exact grouping TBD from source)

## Assets
- `/images/student-thumb-1.webp` (featured video)
- `/images/results/result-*.webp` (16 files in public/images/results/)
- YouTube thumbnails: external URLs (img.youtube.com) — keep as remote URLs
- Icons: Play, ChevronRight from lucide-react

## Responsive Behavior
- **Desktop (1440px):** max-w-4xl (896px), 2-column grid for small videos, 2-column masonry for results
- **Tablet (768px):** Same layout, slightly narrower
- **Mobile (390px):** Single column, grid-cols-2 for small videos remains, masonry may stack to 1 column
- **Breakpoint:** md: 768px
