# Page Topology — go.aidropshippingbuilder.com/claim

## Overall Layout
- **Page height:** ~11,602px
- **Viewport:** 1440px desktop, 390px mobile
- **Scroll:** Lenis smooth scroll library active
- **Body:** `overflow-x: hidden`, `background-color: #0b0c1a`, `color: #e8ecf1`
- **Reveal system:** 25 `.reveal` elements driven by IntersectionObserver, adding `.visible` class
- **Reveal animation:** `opacity: 0, transform: scale(0.96) translateY(56px)` → `opacity: 1, transform: none`

## Section Map (top to bottom)

### 1. Nav (0–64px)
- **Position:** relative, z-10, transparent bg
- **Border:** `1px solid rgba(255,255,255,0.06)` bottom
- **Padding:** `0px 24px` (px-6), h-16 (64px)
- **Content:** Logo link "AI Dropshipping Builder" left-aligned
- **Classes:** `fade-up w-full px-6 md:px-12 lg:px-16 h-16`
- **Interaction model:** Static

### 2. Hero Section (64–968px)
- **Heading** (h1): "Build your store with AI in 10 minutes + get access to my $4,500 AI dropshipping program for free."
  - Classes: `fade-up fade-up-d2`, regular weight for text, emphasis on "$4,500" and "for free"
- **Stats row:** 3 stat badges (10 min store build, $4,500 course included, $0 upfront cost)
  - Classes: `fade-up fade-up-d3`
- **Video:** Auto-playing muted video, portrait aspect ratio, with playback controls
  - "Your Video Is Playing / Click To Unmute" overlay button
- **CTA section:** "IMPORTANT:" warning text + "Get Your Free Store & Course" button + "Join 1,500+ happy customers" social proof
  - Classes: `fade-up fade-up-d6`
  - Button: bg `#6366f1`, white text, 12px radius, 16px/32px padding
- **Interaction model:** Static, scroll-triggered fade-up animation

### 3. Partners Section (1008–1120px)
- **Label:** "OUR PARTNERS" small text
- **Logos:** Wix, TikTok, AutoDS, Hostinger in horizontal row
- **Classes:** `relative pt-4 pb-8 overflow-hidden`
- **Interaction model:** Static

### 4. How It Works Section (1120–3220px)
- **Container:** `.ld-wrap` (2100px tall!)
- **Header:** `.ld-head.reveal` — "HOW IT WORKS" + "Three steps to your first sale." + description
- **3 Steps** with alternating layout:
  - Step 01: Text left, image right (store builder screenshot)
  - Step 02 (reverse): Image left (course mockup with zoom UI), text right
  - Step 03: Text left, Zoom call mockup right (with fake titlebar/toolbar UI)
- **Spine:** `.ld-spine` vertical connector with `.ld-spine-spark` animated dot
- **Reveal:** Each step is `.ld-step.reveal` — fades up + scales in on scroll
- **Step structure:** Number badge → Eyebrow → Title (h3 with emphasis) → Description → Feature chips
- **Interaction model:** Scroll-driven reveal (IntersectionObserver)

### 5. Everything Included Section (3220–4279px)
- **Container:** `sec-std stack-sec`
- **Header:** "EVERYTHING THAT'S INCLUDED" + "The full stack. Zero to start." + description
- **Package card:** "YOUR PACKAGE · 4 ITEMS"
  - 4 item rows with name, description, value price
  - Totals: "TOTAL VALUE $4,500" → "YOUR PRICE TODAY Free"
- **Warning:** "⚡ This won't be free forever..."
- **CTA button:** "Claim Your Free Store & Course"
- **Fine print:** "NO CARD · NO STRINGS · 100% FREE"
- **Interaction model:** Static

### 6. Founder Note Section (4279–5867px)
- **Container:** `sec-std founder-sec`, bg `#080911`
- **Layout:** 2 columns — founder photo left, text content right
- **Photo:** Nathan in Times Square, with "Nathan / FOUNDER" badge + "@nathan" social
- **Content:** "A NOTE FROM THE FOUNDER" → "Wait - what's the catch? How is all of this free?" → multi-paragraph explanation
- **List:** Benefits checklist (store, course, coaching, support, tools, community)
- **Signature:** "Nathan Nazareth / FOUNDER, AI DROPSHIPPING BUILDER"
- **CTA:** Same button + "NO CARD · NO STRINGS · 100% FREE"
- **Interaction model:** Static, scroll-triggered reveal

### 7. Wins/Stores Section (5867–8719px)
- **Container:** `sec-std wins-sec` / `sec-std stores-sec`
- **Header:** "BUILT BY AI" + "E-com stores that our AI has built." + description
- **6 Store cards** in a grid, each with browser chrome (URL bar) + store screenshot
- **Interaction model:** Static, scroll-triggered reveal

### 8. Final CTA Section (8719–11455px)
- **Container:** `sec-std` / `final-cta-sec`
- **Countdown timer:** "8 7 6 5 4 3 2 free slots remaining"
- **Heading:** "Get Your Free Store Built + $4,500 Course"
- **Form:** Full name, Email address, Phone number fields with icons
- **Submit:** "Claim My Free Store + Course →" button
- **Trust:** Lock icon + "Your information is 100% secure." + Terms/Privacy links
- **Interaction model:** Click-driven (form submission)

### 9. Footer (11495–11602px)
- **Container:** `site-footer`
- **Content:** "© 2026 AI Dropshipping Builder. All rights reserved." + Terms · Privacy · Contact links
- **Interaction model:** Static

## Z-Index Layers
1. Nav: z-10
2. Content: auto/default
3. Modal: highest (overlay + form)
