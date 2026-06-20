import type { Metadata } from 'next'
import { Background } from '@/components/innercircle/Background'
import { PageReveal } from '@/components/innercircle/PageReveal'
import { Hero } from '@/components/innercircle/Hero'
import { Ticker } from '@/components/innercircle/Ticker'
import { ApplySection } from '@/components/innercircle/ApplySection'
import { Community } from '@/components/innercircle/Community'
import { SystemCards } from '@/components/innercircle/SystemCards'
import { ResultsSlider } from '@/components/innercircle/ResultsSlider'
import { FAQInnercircle } from '@/components/innercircle/FAQInnercircle'
import { BottomCTA } from '@/components/innercircle/BottomCTA'
import { InnercircleFooter } from '@/components/innercircle/InnercircleFooter'

export const metadata: Metadata = {
  title: "OGs Inner Circle – Build a $5K-$30K/Month Reselling Business",
  description: "Join 200+ members building $5K–$30K/month high-ticket reselling businesses. Access private OEM vendors, 1-on-1 coaching, and the exact system that works.",
}

export default function InnercirclePage() {
  return (
    <div style={{ background: '#050505', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <Background />
      <PageReveal>
        <Hero />
        <Ticker />
        <ApplySection />
        <Community />
        <SystemCards />
        <ResultsSlider />
        <FAQInnercircle />
        <BottomCTA />
        <InnercircleFooter />
      </PageReveal>
    </div>
  )
}
