'use client';

import CtaButton from './CtaButton';
import { ZapIcon, PlayIcon } from './icons';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  className?: string;
}

const badges = [
  { value: '10', label: 'min store build' },
  { value: '$4,500', label: 'course included' },
  { value: '$0', label: 'upfront cost' },
];

export default function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center pt-24 pb-8 px-6 lg:pt-32',
        className,
      )}
      style={{ textAlign: 'center', maxWidth: '100%' }}
    >
      {/* Heading */}
      <h1
        className="reveal text-4xl lg:text-5xl font-bold leading-[1.1] text-[#e8ecf1] text-center max-w-[800px] mb-8"
        style={{ fontFamily: '"DM Sans", sans-serif', transitionDelay: '200ms' }}
      >
        Build your store with AI in 10 minutes + get access to my{' '}
        <span className="font-serif italic text-[#6366f1] font-normal">
          $4,500 AI dropshipping program
        </span>{' '}
        <span className="font-serif italic text-[#6366f1] font-normal">
          for free
        </span>
        .
      </h1>

      {/* Stats badges */}
      <div
        className="reveal grid grid-cols-3 gap-[10px] max-w-[640px] mb-6"
        style={{ transitionDelay: '300ms' }}
      >
        {badges.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.12)',
            }}
          >
            <ZapIcon color="#6366f1" width={20} height={20} />
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold text-[#e8ecf1]">
                {badge.value}
              </span>
              <span
                className="text-xs text-[#7f84a0] uppercase"
                style={{ fontSize: '12px' }}
              >
                {badge.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Video container */}
      <div
        className="reveal relative rounded-2xl overflow-hidden max-w-[320px] mb-6"
        style={{
          boxShadow: '0 0 60px rgba(99, 102, 241, 0.15)',
          transitionDelay: '300ms',
        }}
      >
        {/* Video placeholder */}
        <div className="aspect-[9/16] bg-gray-800" />

        {/* Video overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(99, 102, 241, 0.9)',
            }}
          >
            <PlayIcon width={16} height={16} color="#fff" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-semibold">
              Your Video Is Playing
            </span>
            <span className="text-white/60 text-[11px]">
              Click To Unmute
            </span>
          </div>
        </div>
      </div>

      {/* IMPORTANT notice */}
      <p
        className="reveal text-sm mb-3 max-w-[640px]"
        style={{
          color: 'rgba(232, 236, 241, 0.7)',
          fontSize: '14px',
          transitionDelay: '300ms',
        }}
      >
        <span className="font-semibold text-[#e8ecf1]">IMPORTANT:</span>{' '}
        This may be your only chance to get a fully built online store &amp;
        course for free. If you close this page you may never see this offer
        again.
      </p>

      {/* CTA */}
      <div
        className="reveal"
        style={{ transitionDelay: '600ms' }}
      >
        <CtaButton variant="primary" showArrow>
          Get Your Free Store &amp; Course
        </CtaButton>
      </div>

      {/* Social proof */}
      <p
        className="reveal mt-2"
        style={{
          fontSize: '13px',
          color: '#7f84a0',
          transitionDelay: '600ms',
        }}
      >
        Join 1,500+ happy customers
      </p>
    </section>
  );
}
