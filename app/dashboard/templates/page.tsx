'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Template } from '@/lib/templates'
import { makeFunnelFromTemplate } from '@/lib/templates'
import { TemplateCard } from '@/components/templates/TemplateCard'

export default function TemplatesPage() {
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
        background: '#111',
        color: '#ffe',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffeea6',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'inherit',
              padding: 0,
              marginBottom: '12px',
              display: 'block',
            }}
          >
            ← Back
          </button>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#ffe',
              margin: '0 0 8px',
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            Choose a template
          </h1>
          <p style={{ fontSize: '14px', color: '#ffffeea6', margin: 0, maxWidth: '560px' }}>
            Pick a template to start building your funnel. You can customize and make it exactly what you want anytime.
          </p>
        </div>

        {/* Template list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(n => (
              <div
                key={n}
                style={{
                  height: '160px',
                  borderRadius: '1rem',
                  background: '#1a1a1a',
                  border: '1px solid #ffffff14',
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {templates.map(template => {
              const { blocks, settings } = makeFunnelFromTemplate(template)
              return (
                <TemplateCard
                  key={template.id}
                  templateId={template.id}
                  name={template.name}
                  description={template.description}
                  blocks={blocks}
                  settings={settings}
                  onUse={handleUse}
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
