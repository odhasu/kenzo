import { createClient } from '@/lib/supabase/server'
import { CreateFunnelButton } from './create-funnel-button'
import { FunnelCard } from './funnel-card'

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1a1a1a',
        color: '#ffe',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Hero — centered launcher */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 24px 60px',
          textAlign: 'center',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,238,0.04) 0%, transparent 60%)',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 700,
            color: '#ffe',
            margin: '0 0 8px',
            fontFamily: "'Lora', Georgia, serif",
            lineHeight: 1.2,
          }}
        >
          Ready to build, {firstName}?
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: '15px', color: '#ffffeea6', maxWidth: '420px' }}>
          Create, customize, and ship your funnel.
        </p>
        <CreateFunnelButton />
      </div>

      {/* Funnel grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' }}>
        {funnels && funnels.length > 0 && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffeea6',
                  margin: 0,
                  fontFamily: 'inherit',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Your funnels
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              }}
            >
              {funnels.map(funnel => (
                <FunnelCard key={funnel.id} funnel={funnel} />
              ))}
            </div>
          </>
        )}

        {(!funnels || funnels.length === 0) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '1rem',
              border: '1px dashed #ffffee2e',
              background: '#222',
              padding: '60px 24px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600, color: '#ffe' }}>
              No funnels yet
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#ffffeea6' }}>
              Pick a template to create your first funnel
            </p>
            <CreateFunnelButton />
          </div>
        )}
      </div>
    </div>
  )
}
