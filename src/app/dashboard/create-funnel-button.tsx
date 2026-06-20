'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function CreateFunnelButton() {
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    const name = prompt('Funnel name:')
    if (!name) return

    setCreating(true)
    const supabase = createClient()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data: funnel, error } = await supabase
      .from('funnels')
      .insert({ name, slug })
      .select()
      .single()

    if (error) {
      alert(error.message)
      setCreating(false)
      return
    }

    await supabase
      .from('pages')
      .insert({ funnel_id: funnel.id, slug: 'main', title: 'Main Page', content: [], order: 0 })

    router.push(`/dashboard/funnels/${funnel.id}/edit`)
  }

  return (
    <button
      onClick={handleCreate}
      disabled={creating}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
    >
      {creating ? 'Creating...' : '+ New funnel'}
    </button>
  )
}
