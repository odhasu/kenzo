'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import type { Block } from '@/types/blocks'

function makeTemplate(): Block[] {
  return [
    {
      id: crypto.randomUUID(),
      type: 'ic-hero',
      props: {
        badge: 'MAKE 2026 YOUR BIGGEST YEAR YET',
        headline: 'See How Regular People Are Building $5K-$30K/Month High-Ticket Reselling Businesses',
        subtext: 'The Exact System 200+ Members Use to Flip Authentic Products for Profit',
        ctaLabel: 'Apply For The Inner Circle ↗',
        ctaHref: '#apply',
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-ticker',
      props: {
        items: ['10+ Hours of Reselling Training', '200+ Inner Circle Members', 'High Ticket Vendor Access', 'OEM StockX Passing Vendors', '1-on-1 Onboarding Call', 'Weekly Group Meetings', 'Custom $10K/Month Action Plan', 'View Bots for Enhanced Sales', 'And Much More'],
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-apply',
      props: { headline: 'Apply Now', subtext: 'Complete the application below to see if you qualify.' },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-cards',
      props: {
        headline: 'My Exact 3-Step System to $10K/Month',
        cards: [
          { title: 'Source The Deals', desc: 'Access my private vendors for untapped products at wholesale prices.', bullets: ['OEM vendors that pass StockX authentication.', 'High-ticket items with guaranteed margins.', 'Skip the middlemen & source direct.'] },
          { title: 'Sell With Confidence', desc: '100% authentic OEM products — no replicas, no legal trouble, no bans.', bullets: ['Pass authentication on StockX & GOAT every time.', 'Zero customer complaints — happy buyers, easy sales.', 'Never worry about account bans or legal issues.'] },
          { title: 'Scale To $10K+/Month', desc: 'Get a custom action plan built for your situation to hit $10K/month.', bullets: ['1-on-1 onboarding call to map your path.', 'Weekly group calls — get your questions answered live.', 'Discord community with 200+ active members.'] },
        ],
        ctaLabel: 'Apply For The Inner Circle ↗',
        ctaHref: '#apply',
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-faq',
      props: {
        headline: 'Frequently Asked Questions',
        items: [
          { q: 'Are these vendors legit?', a: 'Yes. These are the same OEM vendors our Inner Circle members use to pass StockX and GOAT authentication every single time. 100% authentic products.' },
          { q: 'How fast can I start making money?', a: 'You can place your first order and list products the same day you get access. Many members make their first sale within the first week.' },
          { q: 'Do I need experience to start?', a: 'No experience needed. Our vendors and resources are beginner-friendly. Everything is explained step-by-step inside the community.' },
        ],
      },
    },
    {
      id: crypto.randomUUID(),
      type: 'ic-cta',
      props: { label: 'Join The Inner Circle ↗', href: '#apply', subtext: 'Start your journey to $10K/month' },
    },
  ]
}

export function CreateFunnelButton() {
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    const name = prompt('Funnel name:')
    if (!name) return

    setCreating(true)
    const supabase = createClient()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data: funnel, error } = await supabase
      .from('funnels')
      .insert({ name, slug, user_id: 'aaaaaaaa-0000-0000-0000-000000000001' })
      .select()
      .single()

    if (error) { alert(error.message); setCreating(false); return }

    await supabase.from('pages').insert({
      funnel_id: funnel.id,
      slug: 'main',
      title: 'Main Page',
      content: makeTemplate(),
      order: 0,
    })

    router.push(`/dashboard/funnels/${funnel.id}/edit`)
  }

  return (
    <button
      onClick={handleCreate}
      disabled={creating}
      style={{ background: '#39FF14', color: '#000', fontWeight: 700, fontSize: '13px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.6 : 1, letterSpacing: '-0.2px', boxShadow: '0 0 20px rgba(57,255,20,0.2)', transition: 'opacity 0.15s' }}
    >
      {creating ? 'Creating...' : '+ New funnel'}
    </button>
  )
}
