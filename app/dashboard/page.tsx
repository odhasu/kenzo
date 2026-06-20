import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CreateFunnelButton } from './create-funnel-button'
import { FunnelCard } from './funnel-card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: funnels } = await supabase
    .from('funnels')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/" style={{ fontSize: '16px', fontWeight: 800, color: '#fff', textDecoration: 'none', letterSpacing: '-0.3px' }}>
              Kenzo
            </Link>
            <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link href="/dashboard" style={{ fontSize: '13px', fontWeight: 600, color: '#39FF14', textDecoration: 'none' }}>
                Funnels
              </Link>
              <Link
                href="/dashboard/train"
                className="nav-link"
              >
                AI Training ✦
              </Link>
              <Link
                href="/dashboard/developer"
                className="nav-link"
              >
                Dev Console 🛠️
              </Link>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/admin" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.15s' }}>
              Admin
            </Link>
            <CreateFunnelButton />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        {/* PAGE TITLE */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1, background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '6px' }}>
            Your Funnels
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
            {funnels?.length ?? 0} funnel{funnels?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* EMPTY STATE */}
        {!funnels?.length ? (
          <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '18px', padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.3px' }}>No funnels yet</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>Create your first funnel to get started</p>
            <CreateFunnelButton />
          </div>
        ) : (
          /* FUNNEL GRID */
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {funnels.map((funnel) => (
              <FunnelCard key={funnel.id} funnel={funnel} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
