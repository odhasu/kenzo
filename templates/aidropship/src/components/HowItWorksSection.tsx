'use client';

import { useEffect, useRef } from 'react';
import HowItWorksStep from './HowItWorksStep';
import CtaButton from './CtaButton';
import { SparkIcon } from './icons';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    eyebrow: 'STEP ONE · 10 MINUTES',
    title: 'Build your store with ',
    emphasis: 'AI.',
    description:
      'Answer a few prompts. The AI picks your niche, writes your product pages, designs your theme, and imports winning products. Under ten minutes, you have a live, functional store.',
    chips: [
      { label: 'Niche research done for you' },
      { label: 'AI-picked winning products' },
      { label: 'Live checkout on day one' },
    ],
    image: { src: '/storebuilder.avif', alt: 'AI Store Builder' },
    visualType: 'screenshot' as const,
    reverse: false,
  },
  {
    number: '02',
    eyebrow: 'STEP TWO · $4,500 VALUE',
    title: 'Unlock the full ',
    emphasis: 'masterclass.',
    description:
      "Fifteen+ hours of proven playbooks: product research, ad frameworks, scaling systems, supplier negotiation. Every module taught by operators who've actually done it. And it's only the start of the library.",
    chips: [
      { label: '15+ hours, 12 modules' },
      { label: 'Ad frameworks + creatives' },
      { label: 'Instant lifetime access' },
    ],
    image: { src: '/course-mockup.avif', alt: 'AI Dropshipping Masterclass' },
    visualType: 'mockup' as const,
    reverse: true,
  },
  {
    number: '03',
    eyebrow: 'STEP THREE · LIVE EVERY WEEKDAY',
    title: 'Show up to daily coaching.',
    emphasis: 'daily',
    description:
      "Every single weekday - Monday through Friday - mentors who've scaled past $1M hop on Zoom to unpack live stores, ad creative, and anything you're stuck on. Yours included if you want.",
    chips: [
      { label: '5 live calls every week' },
      { label: 'Replays in the portal' },
      { label: '1,000+ active operators' },
    ],
    image: { src: '/zoom-coach.avif', alt: 'Coach on live call' },
    visualType: 'zoom-call' as const,
    reverse: false,
  },
];

export default function HowItWorksSection({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const spark = sparkRef.current;
    if (!section || !spark) return;

    const animate = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportH = window.innerHeight;

      // How far the section's top has scrolled past viewport center
      const scrollProgress = (-rect.top + viewportH * 0.5) / sectionHeight;
      const clamped = Math.max(0, Math.min(1, scrollProgress));

      const sparkStart = 400;
      const sparkEnd = sectionHeight - 200;
      const y = sparkStart + clamped * (sparkEnd - sparkStart);

      spark.style.top = `${y}px`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn('ld-wrap', className)}
      style={{
        position: 'relative',
        padding: '120px 64px 160px',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow */}
      <div
        className="ld-glow"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background:
            'radial-gradient(ellipse at center, rgba(99,102,241,0.15), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        className="ld-head"
        style={{ textAlign: 'center' as const }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#6366f1',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          HOW IT WORKS
        </div>
        <h2
          style={{
            fontSize: '42px',
            fontWeight: 700,
            color: '#e8ecf1',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}
        >
          Three steps to your{' '}
          <em
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontStyle: 'italic',
              color: '#6366f1',
              fontWeight: 400,
            }}
          >
            first sale.
          </em>
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: '#7f84a0',
            maxWidth: '600px',
            margin: '0 auto',
            marginBottom: '80px',
          }}
        >
          No coding, no design skills, no $4,500 tuition. Just the AI tools that
          already built 1,200+ stores &mdash; and the playbook to make them
          print.
        </p>
      </div>

      {/* Spine */}
      <div
        className="ld-spine"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          top: '400px',
          height: 'calc(100% - 400px)',
          background:
            'linear-gradient(to bottom, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.35) 94%, transparent 100%)',
          zIndex: 0,
        }}
      />

      {/* Spine spark — glowing star on the vertical line */}
      <div
        ref={sparkRef}
        className="ld-spine-spark"
        style={{
          position: 'absolute',
          left: '50%',
          top: '400px',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          willChange: 'top',
        }}
      >
        <SparkIcon
          style={{
            width: '28px',
            height: '28px',
            color: '#6366f1',
            filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.7)) drop-shadow(0 0 20px rgba(99,102,241,0.4))',
          }}
        />
      </div>

      {/* Steps container */}
      <div
        className="ld-steps"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {steps.map((step) => (
          <HowItWorksStep
            key={step.number}
            number={step.number}
            eyebrow={step.eyebrow}
            title={step.title}
            emphasis={step.emphasis}
            description={step.description}
            chips={step.chips}
            image={step.image}
            visualType={step.visualType}
            reverse={step.reverse}
          />
        ))}
      </div>

      {/* Inline CTA */}
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <CtaButton variant="primary" showArrow>
          Get Your Free Store &amp; Course
        </CtaButton>
      </div>
    </section>
  );
}
