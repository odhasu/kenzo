import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('ping').select('message').limit(1).single()

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>
        {error ? `Supabase error: ${error.message}` : data?.message}
      </p>
    </main>
  )
}
