'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    const supabase = createClient()
    const { error } = await supabase.from('waitlist').insert({ email })
    if (error) {
      setState('error')
      setErrorMsg(error.code === '23505' ? 'You\'re already on the list!' : error.message)
    } else {
      setState('success')
      setEmail('')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-5 text-center">
        <p className="text-2xl">🎉</p>
        <p className="mt-2 font-semibold text-green-800">You're on the list!</p>
        <p className="mt-1 text-sm text-green-600">We'll reach out when your spot is ready.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 shadow-sm focus:border-black focus:outline-none transition"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60 whitespace-nowrap"
      >
        {state === 'loading' ? 'Joining...' : 'Join waitlist →'}
      </button>
      {state === 'error' && (
        <p className="mt-1 w-full text-xs text-red-500">{errorMsg}</p>
      )}
    </form>
  )
}
