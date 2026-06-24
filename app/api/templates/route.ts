import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATES } from '@/lib/templates'
import type { Template } from '@/lib/templates'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase.from('templates').select('*').order('created_at', { ascending: true })

    if (user) {
      query = query.or(`user_id.is.null,user_id.eq.${user.id}`)
    } else {
      query = query.is('user_id', null)
    }

    const { data: dbTemplates, error } = await query

    if (error) {
      console.error('Failed to fetch templates from DB, falling back to code templates:', error)
      return NextResponse.json(Object.values(TEMPLATES))
    }

    // Merge: DB templates override code templates by template_id (slug)
    const merged: Record<string, Template> = { ...TEMPLATES }

    if (dbTemplates) {
      for (const t of dbTemplates) {
        merged[t.template_id] = {
          id: t.template_id,
          name: t.name,
          description: t.description,
          archetype: t.archetype,
          blockOrder: t.block_order,
          theme: t.theme,
          background: t.background,
          seedProps: t.seed_props as Template['seedProps'],
        }
      }
    }

    return NextResponse.json(Object.values(merged))
  } catch (err) {
    console.error('Templates API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
