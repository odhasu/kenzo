import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { experience, goal, age, budget, email, name, phone, contact_preference } = body

  if (!email || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('applications').insert({
    experience,
    goal,
    age,
    budget,
    email,
    name,
    phone,
    contact_preference,
  })

  if (error) {
    console.error('applications insert error:', error)
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
