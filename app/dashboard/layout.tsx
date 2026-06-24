import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DashboardSidebar } from './sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const fullName: string | undefined = user?.user_metadata?.full_name
  const email: string | undefined = user?.email
  const firstName = fullName?.split(' ')[0] ?? email?.split('@')[0] ?? 'there'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1a1a1a' }}>
      <DashboardSidebar firstName={firstName} />
      <main style={{ flex: 1, marginLeft: '260px' }}>{children}</main>
    </div>
  )
}

