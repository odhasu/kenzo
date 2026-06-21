# Product

## Vision

**Kenzo is Clyro, for funnels.**

[Clyro](REFERENCE-CLYRO.md) is an AI theme builder for Shopify: describe a change in a chat, the AI writes the code, a live preview updates instantly, and you ship a validated theme. Kenzo takes that exact builder model and points it at **high-ticket coaching funnels** instead of Shopify themes.

Two modes, one product:
- **Conversational build** — AI interviews the coach (niche, offer, audience) and emits a complete funnel live, the way Clyro's chat composes a theme.
- **Template-driven editing** — start from a gallery template, then refine every block, setting, and word in the 3-panel builder.

## Target user

Coaches and course creators who:
- Sell high-ticket offers ($400–$1000+)
- Are NOT technical — they can't/won't build pages from scratch
- Want speed: "I need a funnel live today"
- Want quality: "I need it to convert, not just exist"
- Want control: "I need to tweak every word, every color"

## User journey (north star)

1. **Log in** → Dashboard → see your funnels (cards with status + live preview thumbnail), à la Clyro's "Your themes" grid.
2. **Create** → either **pick a template** from the [gallery](TEMPLATES.md) or land in the **live-chat split-screen**: AI chat on LEFT asks questions; funnel builds **live** on RIGHT. When the build is done, the full 3-panel builder opens for fine edits.
3. **Edit** in the 3-panel builder ([EDITOR.md](EDITOR.md)): left AI composer, center live preview (click any block to **scope** the next edit to it — Clyro's Inspect), right Sections tree + Settings.
4. **Click existing funnel** → funnel detail → **Edit funnel** or **View Insights**.
5. **Insights** = traffic/conversion + speed + lead-pipeline value + page load speed.
6. **Publish** → validated, then live at `/f/[slug]` with a share link.
7. **Owner can edit everything** — every block, setting, theme, AI value. No locked sections.

## Glossary

| Term | Definition |
|------|------------|
| **Funnel** | One or more published pages that convert visitors into leads/applications (Clyro's "theme") |
| **Block** | A single element on a page (heading, text, button, image, form) |
| **IC Section** | "Inner Circle" section — a full-width theme-aware funnel section (`ic-hero`, `ic-ticker`, …) |
| **Section group** | Tree grouping in the builder: **HEADER / TEMPLATE / FOOTER / OVERLAY** (copied from Clyro) |
| **OVERLAY** | Exit-intent / lead-capture popups + announcement bar |
| **Business Profile** | User's business context in `business_profiles` — niche, offer, audience, pricing, tone |
| **Template** | A pre-built funnel (block order + seed props + theme) in the [gallery](TEMPLATES.md) |
| **Library** | User's saved reusable sections (Clyro's Library) |
| **Inspect / scope** | Click a block in the preview → next AI message edits only that block |
| **Preview-data** | Mock offer/leads/testimonials/pricing so the preview looks real before publish |
| **Live Build** | AI builds the funnel in real-time as the user answers questions in chat |

## North-star metrics

- **Time-to-funnel**: From "create" click to published funnel < 5 minutes
- **Zero-crash**: Preview never whitescreens, even on malformed AI output
- **Conversion rate**: Published funnels convert at industry benchmark or better
- **Edit rate**: Users who enter the builder actually publish (not abandon)

## Funnel archetypes / templates

The 6 shipped templates (see [TEMPLATES.md](TEMPLATES.md) for full detail):

| Template | Archetype | Use case | Block order |
|----------|-----------|----------|-------------|
| **High-Ticket Application** (innercircle) | application | $500+ coaching/courses | hero → ticker → cards → results → faq → cta |
| **Waitlist / Coming Soon** | waitlist | Pre-launch email capture | hero → ticker → cards → faq → cta |
| **Light Waitlist** | waitlist | SaaS/tech, light theme | hero → ticker → cards → faq → cta |
| **Video Sales Letter** | vsl | Long-form info products | hero(video) → cards → results → faq → cta |
| **Agency / Service** | agency | Done-for-you services | hero → cards → results → faq → cta |
| **Bold Agency** | agency | High-end consulting, dark | hero → cards → results → faq → cta |

## Monetization strategy

Users pay for:
- Funnel hosting + publishing
- Analytics/insights (premium tier)
- Lead pipeline CRM (premium tier)
- Library / advanced templates (premium tier — Clyro gates Library behind Pro)

> **AI is not credit-metered.** Kenzo deliberately omits per-message credits (unlike Clyro). AI access is part of the plan, not a meter.
