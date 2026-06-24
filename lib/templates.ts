// Shared default block props and base funnel template.
// Imported by: components/editor/EditorLayout.tsx, app/templates/page.tsx

import type { Block, BlockType, FunnelSettings } from '@/types/blocks'
import { DEFAULT_SETTINGS } from '@/types/blocks'
import type { ThemeId, BackgroundId } from '@/types/blocks'

// ─── Default props per block type ────────────────────────────────────────────
// Single source of truth — every array prop guaranteed valid by construction.

export const DEFAULT_PROPS: Record<BlockType, Block['props']> = {
  heading: { text: 'Your Headline Here', level: 'h1', align: 'center' },
  text:    { text: 'Add your message here.', align: 'left' },
  button:  { label: 'Get Started', href: '#', style: 'filled', size: 'lg' },
  image:   { src: '', alt: '', fit: 'cover', width: '', height: '' },
  form:    { fields: ['email'] },
  code:    { html: '<!-- your html/css/js -->' },
  'ic-hero': {
    badge: 'MAKE 2026 YOUR BIGGEST YEAR YET',
    headline: 'See How Regular People Are Building $5K-$30K/Month High-Ticket Reselling Businesses',
    subtext: 'The Exact System 200+ Members Use to Flip Authentic Products for Profit',
    ctaLabel: 'Apply For The Inner Circle ↗',
    ctaHref: '#apply',
  },
  'ic-ticker': {
    items: [
      '10+ Hours of Reselling Training',
      '200+ Inner Circle Members',
      'High Ticket Vendor Access',
      'OEM StockX Passing Vendors',
      '1-on-1 Onboarding Call',
      'Weekly Group Meetings',
      'Custom $10K/Month Action Plan',
    ],
  },
  'ic-cards': {
    headline: 'My Exact 3-Step System to $10K/Month',
    cards: [
      {
        title: 'Source The Deals',
        desc: 'Access my private vendors for untapped products at wholesale prices.',
        bullets: [
          'OEM vendors that pass StockX authentication.',
          'High-ticket items with guaranteed margins.',
          'Skip the middlemen & source direct.',
        ],
      },
      {
        title: 'Sell With Confidence',
        desc: '100% authentic OEM products — no replicas, no legal trouble, no bans.',
        bullets: [
          'Pass authentication on StockX & GOAT every time.',
          'Zero customer complaints — happy buyers, easy sales.',
          'Never worry about account bans or legal issues.',
        ],
      },
      {
        title: 'Scale To $10K+/Month',
        desc: 'Get a custom action plan built for your situation.',
        bullets: [
          '1-on-1 onboarding call to map your path.',
          'Weekly group calls — get your questions answered live.',
          'Discord community with 200+ active members.',
        ],
      },
    ],
    ctaLabel: 'Apply For The Inner Circle ↗',
    ctaHref: '#apply',
  },
  'ic-faq': {
    headline: 'Frequently Asked Questions',
    items: [
      {
        q: 'Are these vendors legit?',
        a: 'Yes. These are the same OEM vendors our Inner Circle members use to pass StockX and GOAT authentication every single time. 100% authentic products.',
      },
      {
        q: 'How fast can I start making money?',
        a: 'You can place your first order and list products the same day you get access. Many members make their first sale within the first week.',
      },
      {
        q: 'Do I need experience to start?',
        a: 'No experience needed. Our vendors and resources are beginner-friendly. Everything is explained step-by-step inside the community.',
      },
    ],
  },
  'ic-apply': {
    headline: 'Apply Now',
    subtext: 'Complete the application below to see if you qualify.',
  },
  'ic-cta': {
    label: 'Join The Inner Circle ↗',
    href: '#apply',
    subtext: 'Start your journey to $10K/month',
  },
  'ic-results': {
    headline: 'Real Results From Real Members',
    photos: [],
  },
}

// ─── makeBaseFunnel ──────────────────────────────────────────────────────────
// Returns a guaranteed-valid starting funnel (6 blocks + default settings).
// Zero AI — always renders.

const BASE_ORDER: BlockType[] = [
  'ic-hero',
  'ic-ticker',
  'ic-cards',
  'ic-results',
  'ic-faq',
  'ic-cta',
]

export function makeBaseFunnel(): { blocks: Block[]; settings: FunnelSettings } {
  const blocks: Block[] = BASE_ORDER.map(type => ({
    id: crypto.randomUUID(),
    type,
    props: DEFAULT_PROPS[type],
  })) as Block[]

  const settings: FunnelSettings = { ...DEFAULT_SETTINGS }

  return { blocks, settings }
}

// ─── Template library ──────────────────────────────────────────────────────────
// Typed template set: each archetype defines block order + seed settings.
// AI picks from these based on onboarding answers.

export type TemplateArchetype = 'application' | 'waitlist' | 'vsl' | 'agency'

export interface Template {
  id: string
  name: string
  description: string
  archetype: TemplateArchetype
  blockOrder: BlockType[]
  theme: ThemeId
  background: BackgroundId
  /** Optional props overrides for specific block types (seed copy) */
  seedProps?: Partial<Record<BlockType, Partial<Block['props']>>>
}

export const TEMPLATES: Record<string, Template> = {
  // ── Application (Inner Circle — the default high-ticket funnel) ──────
  'innercircle': {
    id: 'innercircle',
    name: 'High-Ticket Application',
    description: 'Application funnel — hero, ticker, 3-step cards, results, FAQ, CTA. Best for coaching/courses at $500+.',
    archetype: 'application',
    blockOrder: ['ic-hero', 'ic-ticker', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta'],
    theme: 'dark-green',
    background: 'none',
  },

  // ── Waitlist ─────────────────────────────────────────────────────────
  'waitlist': {
    id: 'waitlist',
    name: 'Waitlist / Coming Soon',
    description: 'Pre-launch email capture — hero, ticker, cards (benefits), FAQ, CTA. Best for building hype before launch.',
    archetype: 'waitlist',
    blockOrder: ['ic-hero', 'ic-ticker', 'ic-cards', 'ic-faq', 'ic-cta'],
    theme: 'dark-minimal',
    background: 'none',
    seedProps: {
      'ic-hero': {
        badge: 'COMING SOON',
        headline: 'Get Early Access to [Your Offer]',
        subtext: 'Join the waitlist for exclusive bonuses and early-bird pricing.',
        ctaLabel: 'Join the Waitlist ↗',
        ctaHref: '#apply',
      },
      'ic-cards': {
        headline: "Here's What You'll Get",
        cards: [
          { title: 'Early Access', desc: 'Be first in line when we launch.', bullets: ['Priority access to the program.', 'Lock in the founding member rate.', 'Get onboarded before anyone else.'] },
          { title: 'Exclusive Bonuses', desc: 'Bonuses only available to waitlist members.', bullets: ['Free strategy session ($500 value).', 'Private community access.', 'Launch-day only pricing.'] },
          { title: 'No Risk', desc: 'Join the waitlist free. No commitment.', bullets: ['Zero cost to join the list.', 'Unsubscribe anytime.', 'Full details before you commit.'] },
        ],
      },
    },
  },

  // ── VSL (Video Sales Letter) ─────────────────────────────────────────
  'vsl': {
    id: 'vsl',
    name: 'Video Sales Letter',
    description: 'Long-form sales page — hero (with video), cards (proof/benefits), FAQ, CTA. Best for info products and courses.',
    archetype: 'vsl',
    blockOrder: ['ic-hero', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta'],
    theme: 'dark-green',
    background: 'none',
    seedProps: {
      'ic-hero': {
        badge: 'FREE TRAINING',
        headline: 'Discover the [X]-Step System That [Result]',
        subtext: 'Watch this free training to learn the exact method [N] people used to [transformation].',
        ctaLabel: 'Watch the Free Training ↗',
        ctaHref: '#apply',
      },
    },
  },

  // ── Agency ───────────────────────────────────────────────────────────
  'agency': {
    id: 'agency',
    name: 'Agency / Service',
    description: 'Service-based funnel — hero, cards (services), results (case studies), FAQ, CTA. Best for agencies and done-for-you services.',
    archetype: 'agency',
    blockOrder: ['ic-hero', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta'],
    theme: 'light-blue',
    background: 'none',
    seedProps: {
      'ic-hero': {
        badge: 'DONE-FOR-YOU SERVICE',
        headline: 'We [Do X] So You Can [Get Y]',
        subtext: 'Stop struggling with [pain]. Our team handles everything — you get the results.',
        ctaLabel: 'Book a Free Consultation ↗',
        ctaHref: '#apply',
      },
    },
  },

  // ── Light Waitlist ───────────────────────────────────────────────────
  'light-waitlist': {
    id: 'light-waitlist',
    name: 'Light Waitlist',
    description: 'Clean, light-themed waitlist — for SaaS and tech products.',
    archetype: 'waitlist',
    blockOrder: ['ic-hero', 'ic-ticker', 'ic-cards', 'ic-faq', 'ic-cta'],
    theme: 'light-clean',
    background: 'none',
  },

  // ── Bold Agency ──────────────────────────────────────────────────────
  'bold-agency': {
    id: 'bold-agency',
    name: 'Bold Agency',
    description: 'Dark, bold agency funnel — for high-end services and consulting.',
    archetype: 'agency',
    blockOrder: ['ic-hero', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta'],
    theme: 'dark-minimal',
    background: 'none',
  },

  // ── Template projects (from templates/ directory) ────────────────────

  'aidropship': {
    id: 'aidropship',
    name: 'AI Dropship',
    description: 'Dropshipping course funnel — hero, partners, how-it-works, features, founder, stores, CTA. Clone of ai-dropship.com.',
    archetype: 'application',
    blockOrder: ['ic-hero', 'ic-ticker', 'ic-cards', 'ic-results', 'ic-cta'],
    theme: 'dark-green',
    background: 'none',
    seedProps: {
      'ic-hero': {
        badge: 'MAKE 2026 YOUR BIGGEST YEAR',
        headline: 'See How Regular People Are Building $5K-$30K/Month High-Ticket Reselling Businesses',
        subtext: 'The exact system 200+ members use to flip authentic products for profit.',
        ctaLabel: 'Apply For The Inner Circle ↗',
        ctaHref: '#apply',
      },
    },
  },

  'fortuneflips': {
    id: 'fortuneflips',
    name: 'Fortune Flips',
    description: 'Reselling mentorship funnel — hero, how-it-works, VSL, value stack, founder, testimonials, application, FAQ. Clone of fortuneflips.com.',
    archetype: 'application',
    blockOrder: ['ic-hero', 'ic-cards', 'ic-results', 'ic-faq', 'ic-apply'],
    theme: 'dark-green',
    background: 'none',
    seedProps: {
      'ic-hero': {
        badge: 'FREE TRAINING',
        headline: 'Discover How Students Are Making $5K-$30K/Month Reselling Authentic Products',
        subtext: 'Watch this free training to learn the exact method our students use.',
        ctaLabel: 'Watch the Free Training ↗',
        ctaHref: '#apply',
      },
    },
  },

  'lucasresell': {
    id: 'lucasresell',
    name: 'Lucas Resell Waitlist',
    description: 'Waitlist funnel with testimonials and wins — hero, waitlist form, testimonials, wins, CTA. Clone of inner circle closed page.',
    archetype: 'waitlist',
    blockOrder: ['ic-hero', 'ic-ticker', 'ic-cards', 'ic-cta'],
    theme: 'dark-minimal',
    background: 'none',
    seedProps: {
      'ic-hero': {
        badge: 'JOIN THE WAITLIST',
        headline: 'The Inner Circle Is Currently Closed',
        subtext: 'We\'re not accepting new applications right now, but join the waitlist below to be first in line when spots open up.',
        ctaLabel: 'Join the Waitlist ↗',
        ctaHref: '#apply',
      },
    },
  },
}

/**
 * Creates a full funnel from a template — valid blocks + settings.
 * Uses DEFAULT_PROPS for props, overridden by template.seedProps.
 */
export function makeFunnelFromTemplate(template: Template): { blocks: Block[]; settings: FunnelSettings } {
  const blocks: Block[] = template.blockOrder.map(type => {
    const baseProps = { ...DEFAULT_PROPS[type] }
    const overrides = template.seedProps?.[type] || {}
    return {
      id: crypto.randomUUID(),
      type,
      props: { ...baseProps, ...overrides },
    }
  }) as Block[]

  const settings: FunnelSettings = {
    ...DEFAULT_SETTINGS,
    theme: template.theme,
    background: template.background,
  }

  return { blocks, settings }
}

