'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function PublishButton({ funnelId, currentStatus }: {
  funnelId: string
  currentStatus: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handlePublish() {
    setLoading(true)
    const supabase = createClient()
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'

    await supabase.from('funnels').update({ status: newStatus }).eq('id', funnelId)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handlePublish}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${
        currentStatus === 'published'
          ? 'bg-zinc-700 hover:bg-zinc-600'
          : 'bg-green-600 hover:bg-green-500'
      }`}
    >
      {loading
        ? 'Saving...'
        : currentStatus === 'published'
          ? 'Unpublish'
          : 'Publish'}
    </button>
  )
}
