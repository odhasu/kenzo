import type { Metadata } from 'next'
import { WaitlistNav } from '@/components/waitlist/WaitlistNav'
import { WaitlistHero } from '@/components/waitlist/WaitlistHero'
import { WaitlistForm } from '@/components/waitlist/WaitlistForm'
import { VideoTestimonials } from '@/components/waitlist/VideoTestimonials'
import { TestimonialGallery } from '@/components/waitlist/TestimonialGallery'
import { WaitlistCta } from '@/components/waitlist/WaitlistCta'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'

export const metadata: Metadata = {
  title: 'The Inner Circle Waitlist — Join the #1 High-Ticket Reselling Community',
  description:
    'Join 200+ members building $5K–$30K/month high-ticket reselling businesses. Get on the waitlist for private OEM vendor access, 1-on-1 coaching, and proven systems.',
}

export default function WaitlistPage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: '#0a0a0a',
        color: '#ffffff',
        fontFamily: "'Satoshi', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Subtle page texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Radial vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(57,255,20,0.03) 0%, transparent 60%)',
        }}
      />

      <WaitlistNav />
      <WaitlistHero />
      <WaitlistForm />
      <WaitlistCta />
      <VideoTestimonials />
      <WaitlistCta />
      <TestimonialGallery />
      <WaitlistCta />
      <WaitlistFooter />
    </div>
  )
}
