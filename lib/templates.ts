// Default props per block type + template library.
// Imported by EditorLayout, AI route, templates API, and dashboard.

import type { Block, BlockType, FunnelSettings } from '@/types/blocks'
import { DEFAULT_SETTINGS } from '@/types/blocks'
import type { ThemeId, BackgroundId } from '@/types/blocks'

// ─── DEFAULT_PROPS ──────────────────────────────────────────────────────────

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

// ─── Template library ───────────────────────────────────────────────────────

export type TemplateArchetype = 'application' | 'waitlist' | 'vsl' | 'agency'

export interface Template {
  id: string
  name: string
  description: string
  archetype: TemplateArchetype
  blockOrder: BlockType[]
  theme: ThemeId
  background: BackgroundId
  seedProps?: Partial<Record<BlockType, Partial<Block['props']>>>
}

export const TEMPLATES: Record<string, Template> = {
  'template-1': {
    id: 'template-1',
    name: 'Template #1',
    description: 'High Ticket AI Dropshipping Funnel — A full stack high ticket AI dropshipping experience for 2026. Best for coaches, consultants, and course creators selling $400–$1000+ offers. Includes hero, ticker, cards, results, FAQ, and CTA blocks.',
    archetype: 'application',
    blockOrder: ['ic-hero', 'ic-ticker', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta'],
    theme: 'dark-green',
    background: 'none',
  },
  'template-2': {
    id: 'template-2',
    name: 'Template #2',
    description: 'Waitlist / Coming Soon — A comprehensive waitlist funnel designed to capture leads before your launch. Perfect for building hype and collecting early signups. Includes hero, ticker, cards, FAQ, and CTA blocks.',
    archetype: 'waitlist',
    blockOrder: ['ic-hero', 'ic-ticker', 'ic-cards', 'ic-faq', 'ic-cta'],
    theme: 'dark-minimal',
    background: 'none',
  },
  'template-3': {
    id: 'template-3',
    name: 'Template #3',
    description: 'Business Consultant Landing Page — A credible business consultant funnel designed to convert high-value clients. Professional layout with hero, cards, results, FAQ, and CTA blocks. Ideal for agencies and service providers.',
    archetype: 'agency',
    blockOrder: ['ic-hero', 'ic-cards', 'ic-results', 'ic-faq', 'ic-cta'],
    theme: 'light-blue',
    background: 'none',
  },
}

// ─── makeFunnelFromTemplate ──────────────────────────────────────────────────

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
