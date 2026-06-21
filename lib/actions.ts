'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function publishFunnel(
  funnelId: string,
  slug: string,
  nextStatus: 'draft' | 'published',
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('funnels')
    .update({ status: nextStatus })
    .eq('id', funnelId)

  if (error) throw error

  // Revalidate the public funnel page so changes go live immediately
  revalidatePath(`/f/${slug}`, 'page')

  return { status: nextStatus }
}
