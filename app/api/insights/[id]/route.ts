import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: funnelId } = await params
    const supabase = await createClient()

    // Verify user owns this funnel
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: funnel } = await supabase
      .from('funnels')
      .select('id')
      .eq('id', funnelId)
      .eq('user_id', user.id)
      .single()

    if (!funnel) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // ── Traffic ─────────────────────────────────────────────────────
    const { data: trafficData } = await supabase
      .from('funnel_events')
      .select('event_type, created_at')
      .eq('funnel_id', funnelId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const totalViews = (trafficData || []).filter(e => e.event_type === 'view').length
    const submissions = (trafficData || []).filter(e => e.event_type === 'submission').length
    const conversionRate = totalViews > 0 ? ((submissions / totalViews) * 100) : 0

    // ── Speed (from leads) ──────────────────────────────────────────
    // Note: leads table stores funnel_id as a reference
    const { data: leadsData } = await supabase
      .from('leads')
      .select('stage, deal_value, created_at, closed_at')
      .eq('user_id', user.id)

    // Safely filter leads related to this funnel (if funnel_id column exists)
    const funnelLeads = (leadsData || []).filter((l: Record<string, unknown>) => {
      return (l as { funnel_id?: string }).funnel_id === funnelId
    })

    const closeRate = funnelLeads.length > 0
      ? funnelLeads.filter((l: { stage?: string }) => l.stage === 'closed_won').length / funnelLeads.length
      : 0

    const closedWonLeads = funnelLeads.filter((l: { stage?: string }) => l.stage === 'closed_won')
    const avgDealValue = closedWonLeads.length > 0
      ? closedWonLeads.reduce((sum: number, l: { deal_value?: number }) => sum + (l.deal_value || 0), 0) / closedWonLeads.length
      : 0

    // Time to close (days)
    const closedLeads = funnelLeads.filter((l: { closed_at?: string; created_at?: string }) => l.closed_at)
    const avgTimeToClose = closedLeads.length > 0
      ? closedLeads.reduce((sum: number, l: { closed_at: string; created_at: string }) => {
          const days = (new Date(l.closed_at).getTime() - new Date(l.created_at).getTime()) / (1000 * 60 * 60 * 24)
          return sum + days
        }, 0) / closedLeads.length
      : 0

    // ── Pipeline ─────────────────────────────────────────────────────
    const leadsByStage: Record<string, number> = {}
    let pipelineValue = 0
    funnelLeads.forEach((l: { stage?: string; deal_value?: number }) => {
      const stage = l.stage || 'unknown'
      leadsByStage[stage] = (leadsByStage[stage] || 0) + 1
      if (l.stage !== 'closed_lost' && l.stage !== 'closed_won') {
        pipelineValue += l.deal_value || 0
      }
    })

    // Closed won per week (last 4 weeks)
    const closedWonWeekly: number[] = []
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)
      const weekValue = closedWonLeads
        .filter((l: { closed_at?: string }) => {
          if (!l.closed_at) return false
          const d = new Date(l.closed_at)
          return d >= weekStart && d < weekEnd
        })
        .reduce((sum: number, l: { deal_value?: number }) => sum + (l.deal_value || 0), 0)
      closedWonWeekly.push(weekValue)
    }

    // ── Performance (web vitals) ─────────────────────────────────────
    const { data: vitalsData } = await supabase
      .from('funnel_events')
      .select('value, metadata')
      .eq('funnel_id', funnelId)
      .eq('event_type', 'web_vital')

    const vitalsByType: Record<string, number[]> = {}
    ;(vitalsData || []).forEach((v: { value?: number; metadata?: { vital?: string } }) => {
      const vital = v.metadata?.vital || 'unknown'
      if (v.value != null) {
        if (!vitalsByType[vital]) vitalsByType[vital] = []
        vitalsByType[vital].push(v.value)
      }
    })

    const percentile = (arr: number[], p: number) => {
      if (!arr.length) return 0
      const sorted = [...arr].sort((a, b) => a - b)
      const idx = Math.ceil(sorted.length * (p / 100)) - 1
      return sorted[idx]
    }

    const performance: Record<string, { p50: number; p75: number; count: number }> = {}
    for (const [vital, values] of Object.entries(vitalsByType)) {
      performance[vital] = {
        p50: Math.round(percentile(values, 50)),
        p75: Math.round(percentile(values, 75)),
        count: values.length,
      }
    }

    return NextResponse.json({
      traffic: {
        totalViews,
        submissions,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
      speed: {
        avgTimeToCloseDays: Math.round(avgTimeToClose * 10) / 10,
        closeRate: Math.round(closeRate * 100 * 100) / 100,
        avgDealValue: Math.round(avgDealValue),
      },
      pipeline: {
        leadsByStage,
        pipelineValue,
        closedWonWeekly,
        totalLeads: funnelLeads.length,
      },
      performance,
    })
  } catch (err) {
    console.error('Insights API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
