# Footer Specification

## Overview
- **Target file:** `src/components/Footer.tsx`
- **Screenshot:** `docs/design-references/desktop-fullpage.png` (bottom)
- **Interaction model:** Static

## DOM Structure
```
<footer class="site-footer">
  <div> (flex container)
    <p> © 2026 AI Dropshipping Builder. All rights reserved.
    <div> (links)
      <a>Terms · Privacy · Contact
```

## Computed Styles

### Footer container
- padding: 32px 64px
- borderTop: 1px solid rgba(255, 255, 255, 0.06)
- backgroundColor: transparent (inherits body bg #0b0c1a)
- display: flex
- justifyContent: space-between
- alignItems: center
- flexWrap: wrap
- gap: 16px

### Text
- color: #7f84a0 (muted-foreground)
- fontSize: 14px
- fontFamily: "DM Sans", sans-serif

### Links
- color: #7f84a0
- fontSize: 14px
- textDecoration: none

## States

### Link hover
- color: #e8ecf1 (foreground)
- transition: color 0.2s

## Text Content
- Copyright: "© 2026 AI Dropshipping Builder. All rights reserved."
- Links: "Terms" · "Privacy" · "Contact"
- Terms URL: /terms
- Privacy URL: /privacy
- Contact: mailto:nathan@aiecominsiders.com

## Props
```ts
interface FooterProps {
  className?: string;
}
```

## Responsive
- Mobile: stacks vertically, centered text
