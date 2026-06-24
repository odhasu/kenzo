import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TEMPLATES, makeFunnelFromTemplate } from '@/lib/templates'
import type { Template } from '@/lib/templates'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { templateId } = await request.json()

    // Try DB first (user's custom + system), fall back to code
    let template: Template | undefined

    const { data: dbTemplate } = await supabase
      .from('templates')
      .select('*')
      .eq('template_id', templateId)
      .or(`user_id.is.null,user_id.eq.${user.id}`)
      .order('user_id', { ascending: true, nullsFirst: true })
      .limit(1)
      .maybeSingle()

    if (dbTemplate) {
      template = {
        id: dbTemplate.template_id,
        name: dbTemplate.name,
        description: dbTemplate.description,
        archetype: dbTemplate.archetype,
        blockOrder: dbTemplate.block_order,
        theme: dbTemplate.theme,
        background: dbTemplate.background,
        seedProps: dbTemplate.seed_props as Template['seedProps'],
      }
    } else {
      template = TEMPLATES[templateId]
    }

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const { blocks, settings } = makeFunnelFromTemplate(template)
    const slugBase = template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const slug = `${slugBase}-${Date.now().toString(36)}`

    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .insert({ user_id: user.id, name: template.name, slug })
      .select()
      .single()

    if (funnelError) {
      console.error('Failed to create funnel:', funnelError)
      return NextResponse.json({ error: 'Failed to create funnel' }, { status: 500 })
    }

    const { error: pageError } = await supabase
      .from('pages')
      .insert({
        funnel_id: funnel.id,
        slug: 'main',
        title: 'Main Page',
        content: blocks,
        settings,
        order: 0,
      })

    if (pageError) {
      console.error('Failed to create page:', pageError)
      return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
    }

    return NextResponse.json({ redirect: `/dashboard/funnels/${funnel.id}/edit` })
  } catch (err) {
    console.error('Template use error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
