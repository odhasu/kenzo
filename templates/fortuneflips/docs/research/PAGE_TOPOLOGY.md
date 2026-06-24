# Page Topology — resellingautomation.com

## Overall Layout
- Single-page landing page, no navigation/header
- Main wrapper: `div.min-h-screen.pb-20.md:pb-0`
- No smooth scroll library (no Lenis, no Locomotive)
- `html { scroll-behavior: smooth }` CSS only
- No sticky/fixed elements except Sonner toast container

## Z-Index Layers
- Normal flow: auto
- Toast notifications: z-100

## Sections (Top to Bottom)

### 1. Hero Section
- **Selector:** `section.hero-gradient.relative.overflow-hidden.px-4.pt-8.pb-4`
- **Interaction model:** Static with scroll-triggered entrance animations (opacity/translateY)
- **Content:** Badge "Free Training Reveals:" + H1 heading with green highlight
- **Background:** Radial gradient + linear gradient

### 2. VSL Section (#vsl)
- **Selector:** `section#vsl.px-4.pb-8`
- **Interaction model:** Click-driven (play button on video thumbnail, CTA button)
- **Content:** Video thumbnail with play button overlay + "Apply For The Inner Circle" button

### 3. Application Section (#application)
- **Selector:** `section#application.px-4.py-10`
- **Interaction model:** Click-driven (multi-step form with Next button)
- **Content:** Form title, divider, description, textarea input, Next button, progress bar
- **States:** 8 questions with progress bar (0% → 100%)

### 4. Mentorship Section
- **Selector:** `section.relative.py-12.overflow-hidden`
- **Interaction model:** Scroll-driven on mobile (horizontal swipe with snap), static grid on desktop
- **Content:** Section heading + 5 mentorship cards (Direct Access, Vendor Network, Training Library, Proven Systems, Private Community)
- **Mobile:** Horizontal scroll with `snap-x snap-mandatory`, cards `w-[72vw]`
- **Desktop:** Hidden on mobile, shown on md+ (need to extract desktop layout)

### 5. Testimonials Section
- **Selector:** `section.px-4.py-10`
- **Interaction model:** Static with scroll-triggered entrance animations
- **Content:** 
  - "See What Our Students Are Saying" heading
  - Featured video (16:9, landscape)
  - 2x2 grid of smaller videos (9:16, portrait)
  - "A Few More Results" heading
  - 2-column masonry grid of 16+ result screenshots (varying aspect ratios)

### 6. Footer
- **Selector:** `footer.border-t.border-border.bg-background.px-4.py-6`
- **Interaction model:** Static
- **Content:** Copyright text "© 2026 Fortune Flips. All rights reserved."
