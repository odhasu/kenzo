import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { StatsBar } from '@/components/landing/StatsBar'
import { Problem } from '@/components/landing/Problem'
import { RoiCalculator } from '@/components/landing/RoiCalculator'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { WhatYouGet } from '@/components/landing/WhatYouGet'
import { InstagramDmSetter } from '@/components/landing/InstagramDmSetter'
import { WebinarFunnel } from '@/components/landing/WebinarFunnel'
import { Testimonials } from '@/components/landing/Testimonials'
import { AiWorkforce } from '@/components/landing/AiWorkforce'
import { Analytics } from '@/components/landing/Analytics'
import { SalesPipeline } from '@/components/landing/SalesPipeline'
import { WhoItsFor } from '@/components/landing/WhoItsFor'
import { AgencyWhiteLabel } from '@/components/landing/AgencyWhiteLabel'
import { Faq } from '@/components/landing/Faq'
import { FinalCta } from '@/components/landing/FinalCta'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* 1. Nav */}
      <Nav />

      {/* 2. Hero */}
      <Hero />

      {/* 3. Stats bar */}
      <StatsBar />

      {/* 4. The Problem */}
      <Problem />

      {/* 5. ROI Calculator */}
      <RoiCalculator />

      {/* 6. Comparison Table */}
      <ComparisonTable />

      {/* 7. How It Works */}
      <HowItWorks />

      {/* 8. What You Get */}
      <WhatYouGet />

      {/* 9. Instagram DM Setter */}
      <InstagramDmSetter />

      {/* 10. Webinar Funnel */}
      <WebinarFunnel />

      {/* 11. Testimonials */}
      <Testimonials />

      {/* 12. AI Workforce */}
      <AiWorkforce />

      {/* 13. Analytics */}
      <Analytics />

      {/* 14. Sales Pipeline */}
      <SalesPipeline />

      {/* 15. Who It's For */}
      <WhoItsFor />

      {/* 16. Agency / White-Label */}
      <AgencyWhiteLabel />

      {/* 17. FAQ */}
      <Faq />

      {/* 18. Final CTA */}
      <FinalCta />

      {/* 19. Footer */}
      <Footer />
    </div>
  )
}
