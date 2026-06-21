import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const activeStages = ['qualified', 'booked', 'follow_up']
  const activeLeads = leads.filter((l) => activeStages.includes(l.stage))

  const stageCounts: Record<string, number> = {}
  const stageValues: Record<string, number> = {}
  for (const l of activeLeads) {
    stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1
    stageValues[l.stage] = (stageValues[l.stage] || 0) + (l.deal_value || 0)
  }

  const totalWeighted = activeLeads.reduce((sum, l) => sum + (l.deal_value || 0), 0)

  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const closedThisWeek = leads.filter(
    (l) => l.stage === 'closed_won' && l.closed_at && new Date(l.closed_at) >= weekStart
  )
  const closedThisWeekValue = closedThisWeek.reduce((sum, l) => sum + (l.deal_value || 0), 0)

  const closerIds = new Set(leads.filter((l) => l.closer_id).map((l) => l.closer_id))

  return NextResponse.json({
    stats: {
      totalLeads: activeLeads.length,
      totalWeighted,
      stageCounts,
      stageValues,
      closedThisWeek: closedThisWeek.length,
      closedThisWeekValue,
      activeClosers: closerIds.size,
    },
  })
}
