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
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
        currentStatus === 'published'
          ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          : 'bg-black text-white hover:bg-gray-800'
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
