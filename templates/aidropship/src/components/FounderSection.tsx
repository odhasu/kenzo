'use client';

import Image from 'next/image';
import CtaButton from './CtaButton';
import { CheckIcon } from './icons';
import { cn } from '@/lib/utils';

const benefits = [
  'A fully built store',
  'A $4,500 course',
  '5x weekly mentorship calls',
  '24/7 support',
  'The product research tool, business tools, exclusive ad credits',
  'And a community of 1,000 people all figuring this out together',
];

export default function FounderSection() {
  return (
    <section
      className="w-full"
      style={{
        backgroundColor: '#080911',
        padding: '120px 64px',
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 items-center mx-auto"
        style={{
          gap: '80px',
          maxWidth: '1200px',
        }}
      >
        {/* LEFT - Photo container */}
        <div
          className="relative overflow-hidden w-full"
          style={{ borderRadius: '20px' }}
        >
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/founder.avif"
              alt="Nathan Nazareth, Founder of AI Dropshipping Builder"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Name badge (bottom-left overlay) */}
          <div
            className="absolute flex flex-col"
            style={{
              bottom: '24px',
              left: '24px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '12px',
              padding: '12px 20px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#e8ecf1',
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              Nathan
            </span>
            <span
              style={{
                fontSize: '11px',
                color: '#7f84a0',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              FOUNDER
            </span>
          </div>

          {/* Social handle (top-right overlay) */}
          <div
            className="absolute flex items-center"
            style={{
              top: '24px',
              right: '24px',
              gap: '6px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '20px',
              padding: '6px 14px',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e8ecf1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v1a11 11 0 0 1-8 8h-1" />
            </svg>
            <span style={{ fontSize: '13px', color: '#e8ecf1' }}>@nathan</span>
          </div>
        </div>

        {/* RIGHT - Text content */}
        <div>
          {/* Kicker */}
          <p
            className="uppercase mb-4"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: '#6366f1',
            }}
          >
            A NOTE FROM THE FOUNDER
          </p>

          {/* Quote mark */}
          <span
            className="font-serif block mb-4"
            style={{
              fontSize: '72px',
              color: '#6366f1',
              lineHeight: 0.8,
            }}
          >
            &ldquo;
          </span>

          {/* H2 */}
          <h2
            className="mb-6"
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#e8ecf1',
              lineHeight: 1.15,
            }}
          >
            Wait - what&apos;s the catch?{' '}
            <span
              className="font-serif italic font-normal"
              style={{ color: '#6366f1' }}
            >
              How is all of this free?
            </span>
          </h2>

          {/* Paragraph 1 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#c0c4d4',
              marginBottom: '20px',
            }}
          >
            Look. I know what you&apos;re thinking. There has to be a catch.
            Nobody gives away{' '}
            <span
              className="font-serif italic"
              style={{ color: '#e8ecf1' }}
            >
              $4,500 of stuff
            </span>{' '}
            for free.
          </p>

          {/* Paragraph 2 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#c0c4d4',
              marginBottom: '20px',
            }}
          >
            So let me spill it all here.
          </p>

          {/* Paragraph 3 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#c0c4d4',
              marginBottom: '20px',
            }}
          >
            You see, we&apos;re partnered with billion-dollar companies like{' '}
            <span
              className="font-serif italic"
              style={{ color: '#e8ecf1' }}
            >
              Wix, TikTok, and Snapchat.
            </span>{' '}
            They trust us enough to foot the bill. They pay us to bring people
            like you in and actually help you succeed, because when you win, you
            become a long-term user and everyone wins.
          </p>

          {/* Paragraph 4 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#c0c4d4',
              marginBottom: '20px',
            }}
          >
            That means the course, the coaching, the community, the store we
            build for you -{' '}
            <span
              className="font-serif italic"
              style={{ color: '#e8ecf1' }}
            >
              none of that costs you anything.
            </span>
          </p>

          {/* Paragraph 5 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#c0c4d4',
              marginBottom: '20px',
            }}
          >
            The only thing you do pay for is the Wix subscription to host your
            store online. And that&apos;s about the same as a Netflix account.
          </p>

          {/* Paragraph 6 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#c0c4d4',
              marginBottom: '20px',
            }}
          >
            That money doesn&apos;t even come to us - it goes straight to Wix,
            because you&apos;d need hosting no matter where you built a store.
            It&apos;s not something we charge for.
          </p>

          {/* Paragraph 7 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#c0c4d4',
              marginBottom: '20px',
            }}
          >
            So for less than a Netflix subscription, you get:
          </p>

          {/* Benefits list */}
          <ul className="list-none pl-0 mb-8">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="relative"
                style={{
                  padding: '8px 0 8px 28px',
                  fontSize: '16px',
                  color: '#e8ecf1',
                }}
              >
                <span className="absolute left-0 top-[12px] text-[#6366f1]">
                  <CheckIcon width={13} height={13} color="#6366f1" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          {/* Paragraph 8 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#c0c4d4',
              marginBottom: '20px',
            }}
          >
            That&apos;s it. No upsell, no pressure, no &ldquo;oh by the way we
            also sell a $4k program&rdquo; at the end. We get paid when{' '}
            <span
              className="font-serif italic"
              style={{ color: '#e8ecf1' }}
            >
              you succeed,
            </span>{' '}
            so we&apos;re genuinely going to do everything we can to make sure
            you do.
          </p>

          {/* Signature */}
          <div
            className="pt-6 mt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#e8ecf1',
              }}
            >
              Nathan Nazareth
            </p>
            <p
              className="uppercase"
              style={{
                fontSize: '12px',
                color: '#7f84a0',
                letterSpacing: '1px',
              }}
            >
              FOUNDER, AI DROPSHIPPING BUILDER
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <CtaButton variant="primary" showArrow>
              Claim Your Free Store &amp; Course
            </CtaButton>
          </div>

          {/* Fine print */}
          <p
            className="mt-3"
            style={{
              fontSize: '11px',
              color: '#7f84a0',
              letterSpacing: '1px',
            }}
          >
            NO CARD &middot; NO STRINGS &middot; 100% FREE
          </p>
        </div>
      </div>
    </section>
  );
}
