'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface BusinessProfile {
  offer_type: string
  niche: string
  transform: string
  competitors: string
  dream_client: string
  tried_before: string
  client_wants: string
  offer_name: string
  offer_format: string
  offer_includes: string
  guarantee: string
  price: string
  value_roi: string
  payment_type: string
  pain_points: string
  top_objection: string
  inaction_cost: string
  social_proof: string
  brand_voice: string
  voice_notes: string
}

const EMPTY_PROFILE: BusinessProfile = {
  offer_type: '',
  niche: '',
  transform: '',
  competitors: '',
  dream_client: '',
  tried_before: '',
  client_wants: '',
  offer_name: '',
  offer_format: '',
  offer_includes: '',
  guarantee: '',
  price: '',
  value_roi: '',
  payment_type: '',
  pain_points: '',
  top_objection: '',
  inaction_cost: '',
  social_proof: '',
  brand_voice: '',
  voice_notes: '',
}

export function BusinessSettingsPanel() {
  const [profile, setProfile] = useState<BusinessProfile>(EMPTY_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { if (active) setLoading(false); return }

      const { data } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (!active) return

      if (data) {
        setProfile({
          offer_type: data.offer_type || '',
          niche: data.niche || '',
          transform: data.transform || '',
          competitors: data.competitors || '',
          dream_client: data.dream_client || '',
          tried_before: data.tried_before || '',
          client_wants: data.client_wants || '',
          offer_name: data.offer_name || '',
          offer_format: data.offer_format || '',
          offer_includes: data.offer_includes || '',
          guarantee: data.guarantee || '',
          price: data.price || '',
          value_roi: data.value_roi || '',
          payment_type: data.payment_type || '',
          pain_points: data.pain_points || '',
          top_objection: data.top_objection || '',
          inaction_cost: data.inaction_cost || '',
          social_proof: data.social_proof || '',
          brand_voice: data.brand_voice || '',
          voice_notes: data.voice_notes || '',
        })
      }
      setLoading(false)
    })()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    await supabase.from('business_profiles').upsert({
      user_id: user.id,
      ...profile,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function set(key: keyof BusinessProfile, value: string) {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="px-4 py-8 text-center text-xs text-gray-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-black">Business Profile</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Used by AI to write copy that sounds like you
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      {/* Offer section */}
      <Section title="Offer">
        <Field label="Offer name" value={profile.offer_name} onChange={(v) => set('offer_name', v)} />
        <Field label="Format (1:1, group, course, DFY, mix)" value={profile.offer_format} onChange={(v) => set('offer_format', v)} />
        <FieldArea label="What's included" value={profile.offer_includes} onChange={(v) => set('offer_includes', v)} />
        <Field label="Guarantee / risk reversal" value={profile.guarantee} onChange={(v) => set('guarantee', v)} />
      </Section>

      {/* Niche section */}
      <Section title="Niche & Client">
        <Field label="Offer type" value={profile.offer_type} onChange={(v) => set('offer_type', v)} />
        <Field label="Niche / industry" value={profile.niche} onChange={(v) => set('niche', v)} />
        <FieldArea label="Transformation delivered" value={profile.transform} onChange={(v) => set('transform', v)} />
        <Field label="Competitors / alternatives" value={profile.competitors} onChange={(v) => set('competitors', v)} />
        <FieldArea label="Dream client description" value={profile.dream_client} onChange={(v) => set('dream_client', v)} />
      </Section>

      {/* Pricing section */}
      <Section title="Pricing & Proof">
        <Field label="Price" value={profile.price} onChange={(v) => set('price', v)} />
        <FieldArea label="Value / ROI clients get" value={profile.value_roi} onChange={(v) => set('value_roi', v)} />
        <Field label="Payment type" value={profile.payment_type} onChange={(v) => set('payment_type', v)} />
        <FieldArea label="Pain points" value={profile.pain_points} onChange={(v) => set('pain_points', v)} />
        <Field label="Top objection" value={profile.top_objection} onChange={(v) => set('top_objection', v)} />
        <Field label="Cost of inaction" value={profile.inaction_cost} onChange={(v) => set('inaction_cost', v)} />
        <FieldArea label="Social proof / testimonials" value={profile.social_proof} onChange={(v) => set('social_proof', v)} />
      </Section>

      {/* Voice section */}
      <Section title="Brand Voice">
        <Field label="Voice (casual, formal, bold, etc.)" value={profile.brand_voice} onChange={(v) => set('brand_voice', v)} />
        <FieldArea label="Voice notes (words to use/avoid)" value={profile.voice_notes} onChange={(v) => set('voice_notes', v)} />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group" open>
      <summary className="flex cursor-pointer items-center justify-between py-2 select-none">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>
      </summary>
      <div className="space-y-3 pt-1">{children}</div>
    </details>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-black placeholder-gray-400 focus:border-indigo-400 focus:outline-none transition"
      />
    </div>
  )
}

function FieldArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-gray-500 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-black placeholder-gray-400 focus:border-indigo-400 focus:outline-none transition resize-none"
      />
    </div>
  )
}
