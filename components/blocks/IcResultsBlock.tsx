import type { IcResultsProps } from '@/types/blocks'

export function IcResultsBlock({ props, tickerSpeed }: { props: IcResultsProps; tickerSpeed?: number }) {
  const speed = tickerSpeed ?? 20
  const validPhotos = props.photos.filter(Boolean)
  const doubled = [...validPhotos, ...validPhotos]

  return (
    <section style={{ padding: '64px 0', background: 'var(--bg)', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {props.headline && (
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: 'var(--text)', marginBottom: '40px', padding: '0 24px', letterSpacing: '-0.5px' }}>
          {props.headline}
        </h2>
      )}
      {validPhotos.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', opacity: 0.5, fontSize: '13px', padding: '32px 24px' }}>
          Add photo URLs in the settings panel →
        </div>
      ) : (
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '16px', animation: `icPhotoScroll ${speed}s linear infinite`, width: 'max-content' }}>
            {doubled.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                style={{ height: '240px', width: 'auto', borderRadius: 'var(--radius)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
