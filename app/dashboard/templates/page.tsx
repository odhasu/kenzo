'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Template } from '@/lib/templates'
import { makeFunnelFromTemplate } from '@/lib/templates'
import { TemplateCard } from '@/components/templates/TemplateCard'

export default function DashboardTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(data => {
        setTemplates(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleUse = async (templateId: string) => {
    const res = await fetch('/api/templates/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId }),
    })
    const data = await res.json()
    if (data.redirect) {
      router.push(data.redirect)
    } else if (data.error) {
      alert(data.error)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1a1a1a',
        color: '#ffe',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#ffe',
              margin: '0 0 8px',
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            Choose a template
          </h1>
          <p style={{ fontSize: '14px', color: '#ffffeea6', margin: 0 }}>
            Pick a template to start your funnel. You can customize everything after.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map(n => (
              <div
                key={n}
                style={{
                  height: '380px',
                  borderRadius: '1rem',
                  background: '#222',
                  border: '1px solid #ffffee14',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {templates.map(template => {
              const { blocks, settings } = makeFunnelFromTemplate(template)
              return (
                <TemplateCard
                  key={template.id}
                  templateId={template.id}
                  name={template.name}
                  description={template.description}
                  archetype={template.archetype}
                  blocks={blocks}
                  settings={settings}
                  onEdit={() => router.push(`/dashboard/templates/${template.id}`)}
                />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
