'use client';

const ITEMS = [
  '10+ Hours of Reselling Training',
  '200+ Inner Circle Members',
  'High Ticket Vendor Access',
  'OEM StockX Passing Vendors',
  '1-on-1 Onboarding Call',
  'Weekly Group Meetings',
  'Custom $10K/Month Action Plan',
  'View Bots for Enhanced Sales',
  'And Much More',
];

export function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden border-t border-b"
      style={{
        borderColor: 'rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.4)',
        padding: '13px 0',
        marginBottom: '80px',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'icTicker 34s linear infinite',
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 24px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <span style={{ color: '#39FF14', fontSize: '11px' }}>✓</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
