import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const funnelId = searchParams.get('funnel_id')

  let query = supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (funnelId) {
    query = query.eq('funnel_id', funnelId)
  }

  const { data: leads, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ leads })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, email, source, deal_value, stage, notes, funnel_id } = body

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      user_id: user.id,
      name,
      email: email || null,
      source: source || 'manual',
      deal_value: deal_value || 0,
      stage: stage || 'qualified',
      notes: notes || null,
      funnel_id: funnel_id || null,
      payment_type: 'unknown',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ lead })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { leadId, stage, disposition, notes, deal_value, booked_call_at } = body

  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (stage) updates.stage = stage
  if (disposition) updates.disposition = disposition
  if (notes !== undefined) updates.notes = notes
  if (deal_value !== undefined) updates.deal_value = deal_value
  if (booked_call_at) updates.booked_call_at = booked_call_at

  const closedStages = ['closed_won', 'lost', 'no_show', 'unqualified']
  if (stage && closedStages.includes(stage)) {
    updates.closed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
