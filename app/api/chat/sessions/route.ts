import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/chat/sessions?funnelId= → list sessions (newest first)
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const funnelId = searchParams.get('funnelId')
    if (!funnelId) return NextResponse.json({ error: 'Missing funnelId' }, { status: 400 })

    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('funnel_id', funnelId)
      .order('updated_at', { ascending: false })

    if (error) throw new Error(`Database fetch error: ${error.message}`)
    return NextResponse.json({ success: true, sessions })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Fetch sessions error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: msg }, { status: 500 })
  }
}

// POST /api/chat/sessions → create a session
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { funnelId, title } = await request.json()
    if (!funnelId) return NextResponse.json({ error: 'Missing funnelId' }, { status: 400 })

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        funnel_id: funnelId,
        title: title || 'New chat',
      })
      .select()
      .single()

    if (error) throw new Error(`Insert error: ${error.message}`)
    return NextResponse.json({ success: true, session })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Create session error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: msg }, { status: 500 })
  }
}
