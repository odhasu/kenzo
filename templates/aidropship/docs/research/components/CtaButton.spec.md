# CTA Button Specification

## Overview
- **Target file:** `src/components/CtaButton.tsx`
- **Screenshot:** `docs/design-references/desktop-fullpage.png`
- **Interaction model:** Static with hover animation

## DOM Structure
```
<button>
  <span> (text wrapper)
  <span> (arrow icon wrapper, optional)
```

## Computed Styles

### Primary variant (main CTA)
- backgroundColor: #6366f1 (rgb(99, 102, 241))
- color: #ffffff
- borderRadius: 12px
- padding: 16px 32px
- fontSize: 16px
- fontWeight: 700
- fontFamily: "DM Sans", sans-serif
- border: none
- cursor: pointer
- transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)

### Nav variant (compact)
- backgroundColor: #6366f1
- color: #ffffff
- borderRadius: 8px
- padding: 10px 20px
- fontSize: 14px
- fontWeight: 600
- transition: color 0.2s, background-color 0.2s, border-color 0.2s

## States

### Hover
- transform: scale(1.02)
- boxShadow: 0 8px 30px rgba(99, 102, 241, 0.3)
- Transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)

## Props Interface
```ts
interface CtaButtonProps {
  variant?: "primary" | "nav";
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
}
```

## Assets
- ArrowRightIcon from icons.tsx (when showArrow)

## Responsive
- Mobile: full-width, same padding/colors
