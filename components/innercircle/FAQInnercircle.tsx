'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Are these vendors legit?',
    a: 'Yes. These are the same OEM vendors our Inner Circle members use to pass StockX and GOAT authentication every single time. 100% authentic products.',
  },
  {
    q: 'How fast can I start making money?',
    a: 'You can place your first order and list products the same day you get access. Many members make their first sale within the first week.',
  },
  {
    q: "What's the difference between Premium Vendors and the Discord?",
    a: 'Premium Vendors gives you instant lifetime access to 50+ vendor contacts. The Discord includes vendors PLUS weekly coaching calls, view bots, methods, and community support.',
  },
  {
    q: 'Do I need experience to start?',
    a: 'No experience needed. Our vendors and resources are beginner-friendly. Everything is explained step-by-step inside the community.',
  },
];

export function FAQInnercircle() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: 'clamp(30px, 6vw, 56px)',
          fontWeight: 900,
          letterSpacing: '-1.8px',
          lineHeight: 1.1,
          background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Frequently Asked Questions
      </h2>

      {FAQS.map((faq, i) => (
        <div
          key={i}
          onClick={() => setOpen(open === i ? null : i)}
          style={{
            border: `1px solid ${open === i ? 'rgba(57,255,20,0.2)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '10px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 22px',
              fontSize: '16px',
              fontWeight: 700,
              userSelect: 'none',
              letterSpacing: '-0.2px',
            }}
          >
            {faq.q}
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: open === i ? 'rgba(57,255,20,0.14)' : 'rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
                color: open === i ? '#39FF14' : 'rgba(255,255,255,0.45)',
                transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                transition: 'transform 0.25s, background 0.15s, color 0.15s',
              }}
            >
              +
            </span>
          </div>
          <div
            style={{
              maxHeight: open === i ? '300px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.35s ease, padding 0.2s',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
              padding: open === i ? '0 22px 20px' : '0 22px',
            }}
          >
            {faq.a}
          </div>
        </div>
      ))}
    </section>
  );
}
