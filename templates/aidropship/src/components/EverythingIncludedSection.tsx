import CtaButton from './CtaButton';
import { ZapIcon } from './icons';
import { cn } from '@/lib/utils';

const items = [
  {
    name: 'AI Store Builder',
    desc: 'Fully built AI online store. Products, branding, suppliers, checkout - live in under 10 minutes.',
    value: '$500',
  },
  {
    name: 'The AI Dropshipping Masterclass',
    desc: 'The full A-Z program: winning products, ads, campaign set-up, LLC, lifetime access.',
    value: '$2,500',
  },
  {
    name: 'Daily Live Coaching',
    desc: '5 calls a week, Mon–Fri. Live store reviews, ad teardowns, Q&A with 7-figure operators.',
    value: '$1,000',
  },
  {
    name: 'Private Community',
    desc: '1,000+ operators posting wins, supplier leads, creative swaps - shared daily.',
    value: '$500',
  },
];

export default function EverythingIncludedSection({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      className={cn(className)}
      style={{
        padding: '120px 64px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <p
        className="mb-4 text-[11px] font-semibold uppercase tracking-[2px]"
        style={{ color: '#6366f1' }}
      >
        EVERYTHING THAT&apos;S INCLUDED
      </p>

      <h2
        className="mb-4 text-[42px] font-bold leading-[1.1]"
        style={{ color: '#e8ecf1' }}
      >
        The full stack.{' '}
        <span className="font-serif italic text-[#6366f1]">Zero to start.</span>
      </h2>

      <p
        className="mb-12 text-[18px]"
        style={{ color: '#7f84a0', maxWidth: '600px' }}
      >
        Not a gated demo. Every tool, training, and support channel operators
        actually use to run stores that work.
      </p>

      {/* Package card */}
      <div
        className="rounded-[20px] p-10"
        style={{
          backgroundColor: 'rgba(99,102,241,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          maxWidth: '600px',
        }}
      >
        {/* Card header */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[14px] font-semibold" style={{ color: '#e8ecf1' }}>
            YOUR PACKAGE
          </span>
          <span className="text-[12px]" style={{ color: '#7f84a0' }}>
            4 ITEMS
          </span>
        </div>

        {/* Item rows */}
        {items.map((item, i) => (
          <div
            key={item.name}
            className="flex items-start gap-4 py-5"
            style={{
              borderBottom:
                i < items.length - 1
                  ? '1px solid rgba(255,255,255,0.06)'
                  : 'none',
            }}
          >
            <ZapIcon
              width={20}
              height={20}
              color="#6366f1"
              style={{ marginTop: '4px', flexShrink: 0 }}
            />

            <div className="min-w-0 flex-1">
              <p
                className="mb-1 text-[16px] font-semibold"
                style={{ color: '#e8ecf1' }}
              >
                {item.name}
              </p>
              <p
                className="text-[14px] leading-[1.5]"
                style={{ color: '#7f84a0' }}
              >
                {item.desc}
              </p>
            </div>

            <span
              className="ml-auto shrink-0 text-right text-[16px] font-semibold whitespace-nowrap"
              style={{ color: '#7f84a0' }}
            >
              {item.value}
            </span>
          </div>
        ))}

        {/* Totals */}
        <div className="pt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[14px]" style={{ color: '#7f84a0' }}>
              TOTAL VALUE
            </span>
            <span
              className="text-[20px] line-through"
              style={{ color: '#7f84a0' }}
            >
              $4,500
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-[18px] font-semibold"
              style={{ color: '#e8ecf1' }}
            >
              YOUR PRICE TODAY
            </span>
            <span
              className="text-[24px] font-bold"
              style={{ color: '#22c55e' }}
            >
              Free
            </span>
          </div>
        </div>
      </div>

      {/* Warning */}
      <p
        className="mt-6 mb-4 text-center text-[14px]"
        style={{ color: '#7f84a0' }}
      >
        &#9889; This won&apos;t be free forever. Our partners currently cover
        the cost - but that could change at any time.
      </p>

      {/* CTA */}
      <div className="text-center">
        <CtaButton variant="primary" showArrow>
          Claim Your Free Store &amp; Course
        </CtaButton>
      </div>

      {/* Fine print */}
      <p
        className="mt-4 text-center text-[11px] tracking-[1px]"
        style={{ color: '#7f84a0' }}
      >
        NO CARD &middot; NO STRINGS &middot; 100% FREE
      </p>
    </section>
  );
}
