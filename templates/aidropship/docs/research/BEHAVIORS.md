# Behaviors — go.aidropshippingbuilder.com/claim

## Global

### Lenis Smooth Scroll
- **Library:** Lenis (confirmed via `window.Lenis`)
- **Effect:** Smooth, momentum-based scrolling across entire page
- **Implementation:** Install `@studio-freight/lenis` and initialize in layout

### Scroll-Triggered Fade-Up Reveal System
- **Mechanism:** IntersectionObserver
- **Elements:** 25 `.reveal` elements on page
- **Hidden state:** `opacity: 0; transform: scale(0.96) translateY(56px)`
- **Visible state:** `opacity: 1; transform: none` (`.visible` class added)
- **Transition:** CSS transition (likely `opacity 0.6s, transform 0.6s`)
- **Stagger:** `.fade-up-d2` through `.fade-up-d6` delay classes
- **Implementation:** Custom React hook or `framer-motion` `useInView`

### Auto-Playing Video
- **Type:** `<video>` element, muted, auto-playing, blob URL source
- **Controls:** Custom play/pause button, unmute overlay
- **"Your Video Is Playing / Click To Unmute"** overlay with animated icon
- **Behavior:** Plays automatically, muted. Click toggles mute.

## Nav
- **Scroll behavior:** Does NOT change on scroll (remains transparent, no shadow change)
- **No sticky positioning** — nav scrolls with page
- **Hover:** Logo link hover (likely opacity or color change)

## Hero CTA Button
- **Default:** `background-color: #6366f1`, `color: #fff`, `border-radius: 12px`
- **Transition:** `transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)`
- **Hover:** Likely scale up slightly + box shadow (btn hover pattern)

## How It Works — Scroll-Driven Reveal
- **Header:** `.ld-head.reveal` — hidden until scrolled into view
- **Steps:** Each `.ld-step.reveal` scales up + fades in when approaching viewport
- **Spine:** `.ld-spine` vertical line connector, position moves with scroll
- **Spark:** `.ld-spine-spark` glowing dot on spine, animates position with scroll
- **Step 3 at scroll 1500:** `opacity: 0, transform: matrix(0.96, 0, 0, 0.96, 0, 56)` (still hidden)
- **Interaction model:** Pure scroll-driven (IntersectionObserver), NO click interaction

## Course Mockup (Step 02 Visual)
- **Zoom UI overlay** on course image — magnifying glass/circle elements
- **Appears as layered composition** over the course screenshot

## Zoom Call Mockup (Step 03 Visual)
- **Fake titlebar:** `zcall-titlebar` with window controls (red/yellow/green dots)
- **"Original Sound: On"** indicator with dropdown arrow
- **"Recording · 42:18"** recording indicator
- **Main content:** "Live now · Daily coaching" label + coach photo + "YOU" self-view badge
- **Toolbar:** `zcall-toolbar` with mic indicator (red dot) and other controls
- **Interaction model:** Static decorative element

## Everything Included — Pricing Table
- **Item rows:** Likely hover highlight (subtle bg change)
- **CTA Button:** Same hover behavior as hero CTA
- **"Free" badge:** Green/gradient accent

## Founder Section
- **Background:** `#080911` (slightly different from main `#0b0c1a`)
- **Photo:** Portrait of founder with name badge overlay
- **Social handle:** "@nathan" with small icon
- **Text:** Multi-paragraph with emphasis spans (italic Instrument Serif for key phrases)

## Store Cards Grid
- **6 cards** in a responsive grid
- **Each card:** Browser chrome (fake URL bar with `https://your-store.ai`) + store screenshot
- **Hover:** Likely scale/border highlight

## Final CTA Form
- **Countdown digits:** 8-2 displayed, showing decreasing "free slots"
- **Form fields:** Full name, Email, Phone — each with an icon, border, focus state
- **Submit button:** "Claim My Free Store + Course →" with arrow
- **Trust line:** Lock icon + "Your information is 100% secure."
- **Legal:** Terms and Privacy Policy links
- **Form validation:** Required fields, likely client-side validation

## Responsive Behaviors
- **Desktop (1440px):** Full multi-column layouts, nav padding px-6 md:px-12 lg:px-16
- **Tablet (768px):** md: breakpoint — nav padding increases, columns may reduce
- **Mobile (390px):** Stacks to single column, images full-width, form simplified
