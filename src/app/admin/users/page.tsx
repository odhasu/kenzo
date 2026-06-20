import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Get all funnels grouped by user to show user activity
  const { data: funnels } = await supabase
    .from('funnels')
    .select('user_id, name, status, created_at')
    .order('created_at', { ascending: false })

  // Group by user_id
  const userMap = new Map<string, { funnelCount: number; publishedCount: number; lastActive: string }>()
  funnels?.forEach((f) => {
    const existing = userMap.get(f.user_id) || { funnelCount: 0, publishedCount: 0, lastActive: f.created_at }
    existing.funnelCount++
    if (f.status === 'published') existing.publishedCount++
    if (f.created_at > existing.lastActive) existing.lastActive = f.created_at
    userMap.set(f.user_id, existing)
  })

  const users = Array.from(userMap.entries()).map(([userId, stats]) => ({
    userId: userId.slice(0, 8) + '...',
    fullId: userId,
    ...stats,
  }))

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h2 className="text-xl font-semibold text-white">Users</h2>
      <p className="mt-1 text-sm text-zinc-500">{users.length} user{users.length !== 1 ? 's' : ''} with funnels</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800/50 bg-zinc-900/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">User ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Funnels</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Published</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.fullId} className="border-b border-zinc-800/30 last:border-0">
                <td className="px-4 py-3 font-mono text-sm text-zinc-300">{u.userId}</td>
                <td className="px-4 py-3 text-sm text-white">{u.funnelCount}</td>
                <td className="px-4 py-3 text-sm text-green-400">{u.publishedCount}</td>
                <td className="px-4 py-3 text-sm text-zinc-500">{new Date(u.lastActive).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-zinc-500">No users yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
