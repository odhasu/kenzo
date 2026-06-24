import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const fullName: string | undefined = user?.user_metadata?.full_name
  const email: string | undefined = user?.email
  const firstName = fullName?.split(' ')[0] ?? email?.split('@')[0] ?? 'there'

  const { data: funnels } = await supabase
    .from('funnels')
    .select('*')
    .order('created_at', { ascending: false })

  return <DashboardClient firstName={firstName} funnels={funnels ?? []} />
}
