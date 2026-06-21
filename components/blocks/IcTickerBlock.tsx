import type { IcTickerProps } from '@/types/blocks'

export function IcTickerBlock({ props, tickerSpeed }: { props: IcTickerProps; tickerSpeed?: number }) {
  const speed = tickerSpeed ?? 34
  const items = Array.isArray(props.items) ? props.items : []
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '13px 0', fontFamily: "'Inter', system-ui, sans-serif" }} aria-hidden="true">
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: `icTicker ${speed}s linear infinite` }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent)', fontSize: '11px' }}>✓</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
