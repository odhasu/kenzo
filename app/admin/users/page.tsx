import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: funnels } = await supabase
    .from('funnels')
    .select('user_id, name, status, created_at')
    .order('created_at', { ascending: false })

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
      <h2 className="text-xl font-semibold text-black">Users</h2>
      <p className="mt-1 text-sm text-gray-500">{users.length} user{users.length !== 1 ? 's' : ''} with funnels</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Funnels</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Published</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.fullId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{u.userId}</td>
                <td className="px-4 py-3 text-sm font-medium text-black">{u.funnelCount}</td>
                <td className="px-4 py-3 text-sm text-green-600">{u.publishedCount}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{new Date(u.lastActive).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No users yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
