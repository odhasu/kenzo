import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Verify Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const funnelId = searchParams.get('funnelId')
    const sessionId = searchParams.get('sessionId')
    const type = searchParams.get('type')

    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (funnelId) {
      query = query.eq('funnel_id', funnelId).eq('console_type', 'editor')
      if (sessionId) {
        query = query.eq('session_id', sessionId)
      }
    } else if (type === 'developer') {
      query = query.eq('console_type', 'developer')
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const { data: messages, error } = await query

    if (error) {
      throw new Error(`Database fetch error: ${error.message}`)
    }

    return NextResponse.json({ success: true, messages })

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Fetch chats error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: errMsg }, { status: 500 })
  }
}
