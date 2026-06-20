import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TrainPage() {
  const supabase = await createClient()

  const { count: pagesCount } = await supabase
    .from('pages')
    .select('*', { count: 'exact', head: true })

  const { count: funnelsCount } = await supabase
    .from('funnels')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 opacity-40 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-indigo-100 to-blue-50 opacity-25 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-bold tracking-tight text-black">Kenzo</Link>
            <nav className="flex gap-6">
              <Link href="/dashboard" className="text-sm text-gray-500 transition-colors hover:text-black">Funnels</Link>
              <Link href="/dashboard/train" className="text-sm font-semibold text-black">AI Training ✦</Link>
              <Link href="/dashboard/developer" className="text-sm text-gray-500 transition-colors hover:text-black">Dev Console 🛠️</Link>
            </nav>
          </div>
          <Link href="/admin" className="text-sm text-gray-400 transition-colors hover:text-black">Admin</Link>
        </div>
      </header>

      <main className="relative z-[1] mx-auto max-w-3xl px-6 py-12">
        {/* Page title */}
        <div className="mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
            Fine-Tuning Console
          </span>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-black leading-[1.1]">
            Train Your AI Model
          </h1>
          <p className="mt-3 text-sm text-gray-500 max-w-lg leading-relaxed">
            Export your high-converting page structures from the database into a training dataset, upload it to your AI platform, and instruct your editor AI to run your custom-tuned model.
          </p>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-2">
          {/* Stats card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Dataset Stats</span>
            <div className="mt-4 flex gap-10">
              <div>
                <p className="text-4xl font-bold text-black">{pagesCount ?? 0}</p>
                <p className="mt-1 text-xs text-gray-400">Available Pages</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-black">{funnelsCount ?? 0}</p>
                <p className="mt-1 text-xs text-gray-400">Funnels</p>
              </div>
            </div>
            <div className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-400">
              Format: <span className="font-mono text-black">JSONL (Chat Messages)</span>
            </div>
          </div>

          {/* Download card */}
          <div className="flex flex-col justify-between rounded-2xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">Compile Dataset</span>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Generates a training file mapping user inputs to your exact database layouts. Re-download when you create or modify funnels.
              </p>
            </div>
            <a
              href="/api/ai/export-dataset"
              download
              className="mt-4 block rounded-full bg-black px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
            >
              Download JSONL Dataset ✦
            </a>
          </div>
        </div>

        {/* Pipeline steps */}
        <section className="mb-12">
          <h2 className="mb-5 border-b border-gray-100 pb-3 text-lg font-bold tracking-tight text-black">
            Pipeline Steps
          </h2>

          <div className="flex flex-col gap-5">
            {[
              {
                step: '1',
                title: 'Download JSONL File',
                desc: 'Click the download button above to compile your current funnel design database into a training file.',
              },
              {
                step: '2',
                title: 'Upload to AI Platform',
                desc: 'Log in to your AI platform account. Go to "Fine-Tuning" or "Model Training" and upload your training file.',
              },
              {
                step: '3',
                title: 'Start Fine-Tuning Job',
                desc: 'Set the base model to your preferred model. Leave parameters as default and click "Start Training". Fine-tuning typically finishes in 15–40 minutes.',
              },
              {
                step: '4',
                title: 'Configure Your New Model ID',
                desc: 'Once complete, copy your custom model ID. Set it as an environment variable in your Vercel Dashboard, and redeploy. The editor AI will immediately use your custom model.',
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-bold text-black shadow-sm">
                  {s.step}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-black">{s.title}</h4>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Block schema reference */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold tracking-tight text-black">
            Block Schema Reference
          </h2>
          <p className="mt-1 text-xs text-gray-400 leading-relaxed">
            The AI editor runs under these system instructions. When you train your custom model, it will already be familiar with this template layout.
          </p>
          <pre className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-[11px] text-gray-600 font-mono leading-relaxed">
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
- theme, accentColor, bgColor, textColor, font, headingFont
- fontScale, letterSpacing, fontWeight, maxWidth, sectionSpacing
- borderRadius, buttonStyle, buttonSize, buttonRadius
- glowEnabled, gradientHeadlines, glassmorphism
- tickerSpeed, pageTitle, faviconUrl, ogImage, pixelId, customCss`}
          </pre>
        </section>
      </main>
    </div>
  )
}
