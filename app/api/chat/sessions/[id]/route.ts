import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/chat/sessions/[id] → rename session
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { title } = await request.json()
    if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 })

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw new Error(`Update error: ${error.message}`)
    return NextResponse.json({ success: true, session })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Patch session error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: msg }, { status: 500 })
  }
}

// DELETE /api/chat/sessions/[id] → delete session (cascades to messages)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw new Error(`Delete error: ${error.message}`)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Delete session error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: msg }, { status: 500 })
  }
}
