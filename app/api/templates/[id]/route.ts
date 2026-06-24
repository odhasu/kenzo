import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: templateId } = await params
    const body = await request.json()

    // Find existing user template, then upsert
    const { data: existing } = await supabase
      .from('templates')
      .select('id')
      .eq('template_id', templateId)
      .eq('user_id', user.id)
      .maybeSingle()

    let result
    if (existing) {
      result = await supabase
        .from('templates')
        .update({
          name: body.name,
          description: body.description,
          archetype: body.archetype,
          block_order: body.blockOrder,
          theme: body.theme,
          background: body.background,
          seed_props: body.seedProps || {},
        })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('templates')
        .insert({
          template_id: templateId,
          user_id: user.id,
          name: body.name,
          description: body.description,
          archetype: body.archetype,
          block_order: body.blockOrder,
          theme: body.theme,
          background: body.background,
          seed_props: body.seedProps || {},
        })
        .select()
        .single()
    }

    const { data, error } = result
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
