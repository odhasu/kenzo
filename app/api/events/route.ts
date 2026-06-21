import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { funnel_id, event_type, path, value, metadata } = body

    if (!funnel_id || !event_type) {
      return NextResponse.json({ error: 'Missing funnel_id or event_type' }, { status: 400 })
    }

    if (!['view', 'submission', 'web_vital'].includes(event_type)) {
      return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 })
    }

    const supabase = await createClient()

    // Use service client for public inserts (bypasses RLS for anon users)
    const { error } = await supabase
      .from('funnel_events')
      .insert({
        funnel_id,
        event_type,
        path: path || null,
        value: value || null,
        metadata: metadata || null,
      })

    if (error) {
      console.error('Failed to insert event:', error)
      return NextResponse.json({ error: 'Failed to record event' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Events API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
