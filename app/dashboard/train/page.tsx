import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TrainPage() {
  const supabase = await createClient()

  // Fetch count of published funnel pages to compile statistics
  const { count: pagesCount } = await supabase
    .from('pages')
    .select('*', { count: 'exact', head: true })

  const { count: funnelsCount } = await supabase
    .from('funnels')
    .select('*', { count: 'exact', head: true })

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
              <Link
                href="/dashboard"
                style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
              >
                Funnels
              </Link>
              <Link href="/dashboard/train" style={{ fontSize: '13px', fontWeight: 600, color: '#39FF14', textDecoration: 'none' }}>
                AI Training ✦
              </Link>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/admin" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* PAGE TITLE */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#39FF14', display: 'block', marginBottom: '6px' }}>
            Fine-Tuning Console
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, letterSpacing: '-1.2px', lineHeight: 1.1, background: 'linear-gradient(to bottom, #ffffff 40%, rgba(255,255,255,0.6) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '10px' }}>
            Train Your DeepSeek Model
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', maxWidth: '600px', lineHeight: 1.5 }}>
            Export your high-converting page structures from the database into a training dataset, upload it to DeepSeek, and instruct your editor AI to run your custom-tuned model.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '40px' }}>
          {/* STATS CARD */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Dataset Stats</span>
            <div style={{ display: 'flex', gap: '32px', marginTop: '16px', alignItems: 'baseline' }}>
              <div>
                <p style={{ fontSize: '42px', fontWeight: 900, color: '#39FF14', margin: 0, lineHeight: 1 }}>{pagesCount ?? 0}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', marginBottom: 0 }}>Available Pages</p>
              </div>
              <div>
                <p style={{ fontSize: '42px', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>{funnelsCount ?? 0}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', marginBottom: 0 }}>Funnels</p>
              </div>
            </div>
            <div style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
              Format: <span style={{ fontFamily: 'monospace', color: '#fff' }}>JSONL (Chat Messages)</span>
            </div>
          </div>

          {/* DOWNLOAD ACTION CARD */}
          <div style={{ background: 'rgba(57,255,20,0.02)', border: '1px solid rgba(57,255,20,0.12)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#39FF14' }}>Compile Dataset</span>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '10px', lineHeight: '1.45' }}>
                Generates a training file mapping user inputs to your exact database layouts. Re-download this file when you create or modify funnels.
              </p>
            </div>
            <a
              href="/api/ai/export-dataset"
              download
              style={{
                marginTop: '16px',
                textAlign: 'center',
                display: 'block',
                background: '#39FF14',
                color: '#000',
                textDecoration: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 0 20px rgba(57,255,20,0.25)',
                transition: 'opacity 0.2s',
              }}
            >
              Download JSONL Dataset ✦
            </a>
          </div>
        </div>

        {/* STEP-BY-STEP TRAINING PIPELINE */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.4px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
            Pipeline Steps
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                step: '1',
                title: 'Download JSONL File',
                desc: 'Click the download button above to compile your current funnel design database into deepseek_training_data.jsonl.',
              },
              {
                step: '2',
                title: 'Upload to DeepSeek Platform',
                desc: 'Log in to your account at platform.deepseek.com. Go to "Fine-Tuning" or "Model Training" and upload your training file.',
              },
              {
                step: '3',
                title: 'Start Fine-Tuning Job',
                desc: 'Set the base model as "deepseek-chat" or "deepseek-v4-pro". Leave parameters (epochs, learning rate) as default and click "Start Training". Fine-tuning typically finishes in 15–40 minutes.',
              },
              {
                step: '4',
                title: 'Configure Your New Model ID',
                desc: 'Once complete, copy your custom model ID (e.g. ft:deepseek-chat:my-custom-funnel). Set it as an environment variable (DEEPSEEK_API_MODEL) in your Vercel Dashboard, and redeploy. The editor AI will immediately use your custom model!',
              },
            ].map((s) => (
              <div key={s.step} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0, color: '#39FF14' }}>
                  {s.step}
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0', color: '#fff' }}>{s.title}</h4>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.45 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEW-SHOT SYSTEM RULES */}
        <section style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>
            In-Context Model Training Prompt
          </h2>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', lineHeight: '1.4' }}>
            The AI editor runs under these system instructions. When you train your custom model, it will already be familiar with this template layout:
          </p>
          <pre style={{ background: '#000', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '8px', maxHeight: '250px', overflowY: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', lineHeight: '1.5' }}>
{`Block Schema:
- heading { text }
- text { text }
- button { label, href }
- image { src, alt }
- form { fields }
- ic-hero { badge, headline, subtext, ctaLabel, ctaHref }
- ic-ticker { items }
- ic-cards { headline, cards, ctaLabel, ctaHref }
- ic-faq { headline, items }
- ic-apply { headline, subtext }
- ic-cta { label, href, subtext }
- ic-results { headline, photos }

Settings:
- accentColor, bgColor, textColor, font, tickerSpeed, pageTitle, faviconUrl`}
          </pre>
        </section>
      </main>
    </div>
  )
}
