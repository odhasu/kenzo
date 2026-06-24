import { createClient } from '@/lib/supabase/server'
import type { Block, FunnelSettings } from '@/types/blocks'
import { TEMPLATES, makeFunnelFromTemplate } from '@/lib/templates'

export async function createFunnel(name: string, seed?: { content?: Block[]; settings?: FunnelSettings }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const { data: funnel, error: funnelError } = await supabase
    .from('funnels')
    .insert({ user_id: user.id, name, slug })
    .select()
    .single()

  if (funnelError) throw funnelError

  const { error: pageError } = await supabase
    .from('pages')
    .insert({
      funnel_id: funnel.id,
      slug: 'main',
      title: 'Main Page',
      content: seed?.content ?? [],
      settings: seed?.settings ?? null,
      order: 0,
    })

  if (pageError) throw pageError

  return funnel
}

export async function createFunnelFromTemplate(templateId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const template = TEMPLATES[templateId]
  if (!template) throw new Error(`Template "${templateId}" not found`)

  const { blocks, settings } = makeFunnelFromTemplate(template)

  const slugBase = template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const slug = `${slugBase}-${Date.now().toString(36)}`

  const { data: funnel, error: funnelError } = await supabase
    .from('funnels')
    .insert({ user_id: user.id, name: template.name, slug })
    .select()
    .single()

  if (funnelError) throw funnelError

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

  if (pageError) throw pageError

  return funnel
}

export async function getUserFunnels() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('funnels')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getFunnelBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('funnels')
    .select('*, pages(*)')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function getFunnelById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('funnels')
    .select('*, pages(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function savePage(pageId: string, content: Block[], settings?: FunnelSettings) {
  const supabase = await createClient()
  const payload: Record<string, unknown> = { content }
  if (settings !== undefined) payload.settings = settings
  const { error } = await supabase
    .from('pages')
    .update(payload)
    .eq('id', pageId)

  if (error) throw error
}

export async function updateFunnelStatus(id: string, status: 'draft' | 'published') {
  const supabase = await createClient()
  const { error } = await supabase
    .from('funnels')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}

export async function getFunnelSlugById(id: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('funnels')
    .select('slug')
    .eq('id', id)
    .single()

  return data?.slug ?? null
}
