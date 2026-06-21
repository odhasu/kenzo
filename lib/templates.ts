// Shared default block props and base funnel template.
// Imported by: components/editor/EditorLayout.tsx, app/create/page.tsx

import type { Block, BlockType, FunnelSettings } from '@/types/blocks'
import { DEFAULT_SETTINGS } from '@/types/blocks'

// ─── Default props per block type ────────────────────────────────────────────
// Single source of truth — every array prop guaranteed valid by construction.

export const DEFAULT_PROPS: Record<BlockType, Block['props']> = {
  heading: { text: 'Your Headline Here' },
  text:    { text: 'Add your message here.' },
  button:  { label: 'Get Started', href: '#' },
  image:   { src: '', alt: '' },
  form:    { fields: ['email'] },
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
