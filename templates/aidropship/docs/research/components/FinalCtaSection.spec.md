# Final CTA Section Specification

## Overview
- **Target file:** `src/components/FinalCtaSection.tsx`
- **Screenshot:** `docs/design-references/desktop-fullpage.png`
- **Interaction model:** Click-driven (form submission)

## DOM Structure
```
<section class="final-cta-sec">
  <div> (centered card)
    <button> (close X)
    <h2> "Get Your Free Store Built + $4,500 Course"
    <div> (countdown)
      <div> (digits: 8,7,6,5,4,3,2)
      <span> " free slots remaining"
    <form>
      <div> (field: Full name)
        <svg> (UserIcon)
        <input>
      <div> (field: Email address)
        <svg> (MailIcon)
        <input>
      <div> (field: Phone number)
        <svg> (PhoneIcon)
        <input>
      <button> (submit) "Claim My Free Store + Course →"
    <div> (trust)
      <LockIcon>
      <span> "Your information is 100% secure."
    <p> (legal) "By submitting, you agree to our Terms and Privacy Policy..."
```

## Computed Styles

### Section
- padding: 120px 64px
- display: flex
- justifyContent: center

### Card
- backgroundColor: rgba(99, 102, 241, 0.04)
- borderRadius: 24px
- border: 1px solid rgba(255, 255, 255, 0.08)
- padding: 48px
- maxWidth: 480px
- width: 100%
- position: relative

### Close button
- position: absolute
- top: 20px
- right: 20px
- CloseIcon
- color: #7f84a0
- width: 20px, height: 20px

### H2
- fontSize: 28px
- fontWeight: 700
- color: #e8ecf1
- textAlign: center
- lineHeight: 1.2
- marginBottom: 24px

### Countdown wrapper
- display: flex
- justifyContent: center
- alignItems: center
- gap: 4px
- marginBottom: 32px
- fontSize: 14px
- color: #7f84a0

### Countdown digits
- Each digit in a small box:
  backgroundColor: rgba(99, 102, 241, 0.12)
  borderRadius: 6px
  padding: 4px 8px
  fontSize: 14px
  fontWeight: 700
  color: #e8ecf1
  fontFamily: "JetBrains Mono", monospace

### Form field wrapper
- position: relative
- marginBottom: 16px

### Form icon
- position: absolute
- left: 16px
- top: 50%
- transform: translateY(-50%)
- color: #7f84a0
- width: 20px

### Input
- width: 100%
- padding: 14px 16px 14px 48px (left padding for icon)
- backgroundColor: rgba(255, 255, 255, 0.04)
- border: 1px solid rgba(255, 255, 255, 0.08)
- borderRadius: 12px
- color: #e8ecf1
- fontSize: 16px
- fontFamily: "DM Sans", sans-serif
- outline: none

### Input focus
- borderColor: #6366f1
- boxShadow: 0 0 0 3px rgba(99, 102, 241, 0.15)

### Input placeholder
- color: #7f84a0

### Submit button
- width: 100%
- backgroundColor: #6366f1
- color: white
- borderRadius: 12px
- padding: 16px 32px
- fontSize: 16px
- fontWeight: 700
- border: none
- cursor: pointer
- marginBottom: 16px
- transition: transform 0.3s, box-shadow 0.3s

### Submit hover
- transform: scale(1.02)
- boxShadow: 0 8px 30px rgba(99, 102, 241, 0.3)

### Trust row
- display: flex
- alignItems: center
- justifyContent: center
- gap: 8px
- marginBottom: 12px
- color: #7f84a0
- fontSize: 13px

### Legal text
- textAlign: center
- fontSize: 12px
- color: #7f84a0
- lineHeight: 1.5

### Legal links
- color: #6366f1
- textDecoration: underline

## Text Content
- H2: "Get Your Free Store Built + $4,500 Course"
- Countdown: digits 8,7,6,5,4,3,2 + " free slots remaining"
- Placeholders: "Full name", "Email address", "Phone number"
- Submit: "Claim My Free Store + Course →"
- Trust: "Your information is 100% secure."
- Legal: "By submitting, you agree to our Terms and Privacy Policy. NO-SPAM. Opt out anytime."

## Assets
- UserIcon, MailIcon, PhoneIcon, LockIcon, CloseIcon, ArrowRightIcon from icons.tsx

## Props
```ts
interface FinalCtaSectionProps {
  className?: string;
}
```

## Responsive
- Desktop: card max-w-md centered
- Mobile: full-width card, less padding
