# Behaviors — resellingautomation.com

## Scroll Behavior
- **Smooth scroll:** `html { scroll-behavior: smooth }` (CSS only, no JS library)
- **No Lenis, Locomotive Scroll, or other smooth scroll libraries**

## Entrance Animations (Scroll-Triggered)
Multiple elements have inline styles suggesting scroll-triggered entrance:
- **Initial state:** `opacity: 0; transform: translateY(10px)` or `translateY(15px)` or `scale(0.95)`
- **Final state:** `opacity: 1; transform: none`
- **Mechanism:** Likely IntersectionObserver or React animation library (Framer Motion not detected, no AOS)
- **Implementation:** CSS transitions + IntersectionObserver or JS scroll listener

### Elements with entrance animations:
- Hero section badge and heading (opacity: 1, transform: none — already visible on load)
- Mentorship section heading: `opacity: 0; transform: translateY(10px)`
- Mentorship cards: `opacity: 0; transform: scale(0.95)`
- Testimonial featured video: `opacity: 0; transform: translateY(15px)`
- Testimonial grid videos: `opacity: 0; transform: translateY(15px)`
- Result screenshots: `opacity: 0; transform: translateY(15px)`

## Mentorship Section — Scroll Snap (Mobile)
- **Mobile only** (`md:hidden`)
- **Container:** `flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-none`
- **Cards:** `w-[72vw] shrink-0 snap-center`
- **Hidden scrollbar:** `scrollbar-width: none`
- **Desktop:** Grid layout (hidden on mobile, visible md+)

## Video Thumbnails — Click to Play
All video thumbnails have:
- `<button>` wrapping the image
- Dark overlay: `bg-black/30` (or full `bg-black` for VSL)
- Play button circle: `bg-primary` (or `bg-primary/90`) with Play icon
- VSL play button: 64x64 (mobile) / 80x80 (desktop) circle
- Testimonial play button: 56x56 circle

## Application Form — Multi-Step
- 8 questions total
- Progress bar: `h-1.5 rounded-full bg-muted` with green fill
- Question counter: "Question 1 of 8"
- Percentage: "0%"
- "Next" button with chevron-right icon
- Textarea input for answers
- States: each question has different label text

## Hover States
- **CTA buttons:** `hover:shadow-primary/40 hover:brightness-110`
- **Mentorship cards:** `cursor-pointer`, likely have hover scale/shadow transitions (`transition-all duration-300`)
- **Video play buttons:** `cursor-pointer`

## Responsive Breakpoints
- **md:** 768px — main breakpoint
- Desktop: 1440px — max-w containers
- Mobile: 390px — single column, smaller text
- VSL button: `h-14` mobile, `md:h-16` desktop
- Hero heading: `text-2xl` mobile, `md:text-5xl lg:text-6xl` desktop
- Mentorship: horizontal swipe mobile, grid desktop
- Application form padding: `p-5` mobile, `md:p-8` desktop

## Interaction Model Summary
| Section | Model | Mechanism |
|---------|-------|-----------|
| Hero | Static + entrance animation | IntersectionObserver |
| VSL | Click-driven | Button clicks (play, CTA) |
| Application | Click-driven | Multi-step form navigation |
| Mentorship | Scroll-driven (mobile) / Static (desktop) | CSS scroll-snap |
| Testimonials | Static + entrance animation | IntersectionObserver |
| Footer | Static | N/A |
