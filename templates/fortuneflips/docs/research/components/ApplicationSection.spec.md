# ApplicationSection Specification

## Overview
- **Target file:** `src/components/ApplicationSection.tsx`
- **Screenshot:** `docs/design-references/full-page-desktop-1440.png`
- **Interaction model:** Click-driven (multi-step form with Next button)

## DOM Structure
```
section#application.px-4.py-10.md:py-16
└── div.mx-auto.max-w-lg (512px)
    ├── div.mb-2.text-center
    │   ├── h2: "Apply for 1-1 Coaching" (with span.text-primary "Apply")
    │   ├── div.h-[2px].w-1/2.bg-primary.rounded-full (divider line)
    │   └── p.text-xs.text-muted-foreground: "Complete the application below to see if you qualify."
    └── div.rounded-2xl.border-2.border-primary/40.bg-card.p-5.md:p-8 (form card, min-h-[420px])
        ├── div.mb-4
        │   └── span (question number badge: "1")
        ├── div.flex-1.flex.flex-col (question area)
        │   └── div.flex-1.flex.flex-col (question content, animated)
        │       ├── label.mb-1.block.text-base.font-bold: question text
        │       ├── p.mb-4.text-sm.text-muted-foreground: subtitle/helper
        │       └── textarea.w-full.resize-none.rounded-xl.border... (answer input)
        ├── div.mt-6.flex.items-center.justify-between
        │   ├── div (empty spacer)
        │   └── button.bg-primary: "Next" + ChevronRightIcon
        └── div.mt-4 (progress bar)
            ├── div.flex.justify-between.text-xs.text-muted-foreground
            │   ├── "Question 1 of 8"
            │   └── "0%"
            └── div.h-1.5.rounded-full.bg-muted (progress track)
                └── div.h-full.rounded-full.bg-primary (progress fill, width: 0%)
```

## Computed Styles

### Section
- padding: 40px 16px (mobile), 64px 16px (desktop md:py-16)

### Content Wrapper
- maxWidth: 512px (max-w-lg)
- margin: 0 auto

### Heading
- fontSize: 24px (text-2xl mobile), 30px (md:text-3xl desktop)
- fontWeight: 800 (font-extrabold)
- color: var(--foreground)
- textAlign: center

### Green "Apply" span
- color: var(--primary)

### Divider Line
- height: 2px
- width: 50%
- backgroundColor: var(--primary)
- borderRadius: 9999px
- margin: 8px auto 0

### Help Text
- fontSize: 12px (text-xs)
- color: var(--muted-foreground)
- marginTop: 12px

### Form Card
- borderRadius: 16px (rounded-2xl)
- border: 2px solid hsl(110 100% 54% / 0.4) (border-primary/40)
- backgroundColor: var(--card)
- padding: 20px (mobile), 32px (desktop)
- minHeight: 420px
- display: flex, flexDirection: column

### Question Number Badge
- width/height: 28px (h-7 w-7)
- borderRadius: 6px (rounded-md)
- backgroundColor: var(--primary)
- color: var(--primary-foreground)
- fontSize: 12px (text-xs)
- fontWeight: 700
- display: flex, alignItems: center, justifyContent: center

### Question Label
- display: block
- fontSize: 16px (text-base mobile), 18px (md:text-lg desktop)
- fontWeight: 700
- color: var(--foreground)
- marginBottom: 4px

### Question Subtitle
- fontSize: 14px (text-sm)
- color: var(--muted-foreground)
- marginBottom: 16px

### Textarea Input
- width: 100%
- resize: none
- borderRadius: 12px (rounded-xl)
- border: 1px solid var(--border)
- backgroundColor: var(--background)
- padding: 12px 16px
- fontSize: 16px (text-base)
- color: var(--foreground)
- placeholder color: var(--muted-foreground)
- focus: border-color: var(--primary), outline: none, ring: 1px var(--primary)

### Next Button
- display: inline-flex
- alignItems: center
- justifyContent: center
- gap: 8px
- backgroundColor: var(--primary)
- color: var(--primary-foreground)
- fontWeight: 700
- height: 40px (h-10)
- padding: 8px 24px
- borderRadius: 12px (rounded-xl)
- fontSize: 14px (text-sm)
- boxShadow: 0 10px 15px -3px hsl(110 100% 54% / 0.25)
- transition: all 0.2s

### Progress Bar Container
- marginTop: 16px

### Progress Labels
- display: flex, justifyContent: space-between
- fontSize: 12px (text-xs)
- color: var(--muted-foreground)
- marginBottom: 4px

### Progress Track
- height: 6px (h-1.5)
- borderRadius: 9999px
- backgroundColor: var(--muted)
- overflow: hidden

### Progress Fill
- height: 100%
- borderRadius: 9999px
- backgroundColor: var(--primary)
- width: dynamic (0% → 100%)

## States & Behaviors

### Form Navigation (Click-driven)
- **Current state:** Question N displayed with its label, subtitle, and textarea
- **Next click:** Fade/transition to Question N+1
- **Progress:** width changes from (N-1)/8 * 100% to N/8 * 100%
- **Counter:** "Question N of 8"
- **Implementation:** React state `useState(currentQuestion)`

### Question Data (8 questions)
1. Label: "Have you already been reselling? If so, how long? And tell me about it."
   Subtitle: "If not, type \"I'm just starting.\""
2-8: (need to click through on live site to extract)

### Next Button Hover
- boxShadow intensifies (shadow-primary/40)
- filter: brightness(1.1)
- transition: all 0.2s

### Question Transition
- Fade animation between questions
- Inline styles: opacity: 1, transform: none (already visible state)

## Text Content (verbatim)
- Heading: "Apply for 1-1 Coaching" (with "Apply" in green)
- Help: "Complete the application below to see if you qualify."
- Question 1 label: "Have you already been reselling? If so, how long? And tell me about it."
- Question 1 subtitle: "If not, type \"I'm just starting.\""
- Placeholder: "Type your answer here..."
- Button: "Next"
- Progress: "Question 1 of 8" / "0%"

## Assets
- Icons: ChevronRight from lucide-react
- No images

## Responsive Behavior
- **Desktop (1440px):** max-w-lg (512px) centered, md:p-8
- **Tablet (768px):** Same as desktop
- **Mobile (390px):** Full width with px-4, p-5 on form card
- **Breakpoint:** md: 768px
