import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Upsert: insert if not exists, update if it does
    const { data, error } = await supabase
      .from('templates')
      .upsert({
        id,
        user_id: user.id,
        name: body.name,
        description: body.description,
        archetype: body.archetype,
        block_order: body.blockOrder,
        theme: body.theme,
        background: body.background,
        seed_props: body.seedProps || {},
      }, { onConflict: 'id,user_id' })
      .select()
      .single()

    if (error) {
      console.error('Failed to update template:', error)
      return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Template update error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
