'use client';

import { cn } from '@/lib/utils';

interface StoreCardProps {
  image: string;
  url?: string;
  className?: string;
}

export default function StoreCard({
  image,
  url = 'https://your-store.ai',
  className,
}: StoreCardProps) {
  return (
    <article
      className={cn('group cursor-pointer', className)}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: 'rgba(99,102,241,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.3s, border-color 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          backgroundColor: '#1a1a1e',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Dots */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              display: 'block',
            }}
          />
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#eab308',
              display: 'block',
            }}
          />
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'block',
            }}
          />
        </div>

        {/* URL bar */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: '6px',
            padding: '4px 12px',
            flex: 1,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: '11px',
              color: '#7f84a0',
            }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* Screenshot */}
      <img
        src={image}
        alt="AI-built e-commerce store"
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          aspectRatio: '4 / 3',
        }}
      />
    </article>
  );
}
