import { createClient } from '@/lib/supabase/server'

export interface Lead {
  id: string
  user_id: string
  funnel_id?: string | null
  name: string
  email?: string | null
  phone?: string | null
  source: string
  stage: string
  deal_value: number
  payment_type: string
  closer_id?: string | null
  setter_id?: string | null
  notes?: string | null
  disposition?: string | null
  booked_call_at?: string | null
  closed_at?: string | null
  last_contact_at?: string | null
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PipelineStats {
  totalLeads: number
  totalWeighted: number
  stageCounts: Record<string, number>
  stageValues: Record<string, number>
  closedThisWeek: number
  closedThisWeekValue: number
  activeClosers: number
}

export async function getUserLeads(): Promise<Lead[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Lead[]
}

export async function getLeadsByStage(stage: string): Promise<Lead[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('stage', stage)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Lead[]
}

export async function createLead(
  lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Lead> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...lead,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Lead
}

export async function updateLeadStage(
  leadId: string,
  stage: string,
  extra?: { disposition?: string; notes?: string; deal_value?: number; booked_call_at?: string }
): Promise<void> {
  const supabase = await createClient()

  const updates: Record<string, unknown> = { stage }
  if (extra?.disposition) updates.disposition = extra.disposition
  if (extra?.notes !== undefined) updates.notes = extra.notes
  if (extra?.deal_value !== undefined) updates.deal_value = extra.deal_value
  if (extra?.booked_call_at) updates.booked_call_at = extra.booked_call_at

  if (
    stage === 'closed_won' ||
    stage === 'lost' ||
    stage === 'no_show' ||
    stage === 'unqualified'
  ) {
    updates.closed_at = new Date().toISOString()
  }

  const { error } = await supabase.from('leads').update(updates).eq('id', leadId)

  if (error) throw new Error(error.message)
}

export async function assignCloser(leadId: string, closerId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ closer_id: closerId }).eq('id', leadId)
  if (error) throw new Error(error.message)
}

export async function getPipelineStats(): Promise<PipelineStats> {
  const supabase = await createClient()
  const { data: leads, error } = await supabase.from('leads').select('*')

  if (error) throw new Error(error.message)

  const activeStages = ['qualified', 'booked', 'follow_up']
  const activeLeads = leads.filter((l: Lead) => activeStages.includes(l.stage))

  const stageCounts: Record<string, number> = {}
  const stageValues: Record<string, number> = {}
  for (const l of activeLeads) {
    stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1
    stageValues[l.stage] = (stageValues[l.stage] || 0) + (l.deal_value || 0)
  }

  const totalWeighted = activeLeads.reduce((sum: number, l: Lead) => sum + (l.deal_value || 0), 0)

  // This week's closed won
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const closedThisWeek = activeLeads.filter(
    (l: Lead) => l.stage === 'closed_won' && l.closed_at && new Date(l.closed_at) >= weekStart
  )
  const closedThisWeekValue = closedThisWeek.reduce(
    (sum: number, l: Lead) => sum + (l.deal_value || 0),
    0
  )

  // Unique closers
  const closerIds = new Set(
    leads.filter((l: Lead) => l.closer_id).map((l: Lead) => l.closer_id)
  )

  return {
    totalLeads: activeLeads.length,
    totalWeighted,
    stageCounts,
    stageValues,
    closedThisWeek: closedThisWeek.length,
    closedThisWeekValue,
    activeClosers: closerIds.size,
  }
}
