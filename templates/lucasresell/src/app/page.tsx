import { GradientHeading } from "@/components/GradientHeading";
import { WaitlistForm } from "@/components/WaitlistForm";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { WinsSection } from "@/components/WinsSection";
import { CtaButton } from "@/components/CtaButton";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <BackgroundEffects />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Header section */}
        <section className="pt-[68px] pb-6 px-4">
          <GradientHeading
            as="h1"
            className="max-w-[670px] text-[52.8px] leading-[58.08px] font-extrabold -tracking-[0.02em] bg-[linear-gradient(167deg,#fff_0%,#919191_100%)]"
          >
            The Inner Circle Is Currently Closed
          </GradientHeading>

          <p className="mx-auto mt-[25px] max-w-[510px] text-[20px] leading-[30px] text-[#d4d4d4]">
            We&apos;re not accepting new applications right now, but join the
            waitlist below to be first in line when spots open up.
          </p>
        </section>

        {/* Waitlist form section */}
        <section className="w-full">
          <div className="pt-0">
            <GradientHeading
              as="h1"
              className="text-[47.8px] leading-[52.58px] font-bold -tracking-[0.02em] bg-[linear-gradient(135deg,#fff_0%,#969696_100%)]"
            >
              Join the Waitlist
            </GradientHeading>
          </div>

          <WaitlistForm />
        </section>

        {/* Testimonials section */}
        <TestimonialsSection />

        {/* CTA */}
        <section className="py-8 px-4">
          <CtaButton>Get Started Now</CtaButton>
        </section>

        {/* Wins section */}
        <WinsSection />

        {/* CTA */}
        <section className="py-8 px-4">
          <CtaButton>Get Started Now</CtaButton>
        </section>

        {/* Footer */}
        <footer className="w-full flex justify-center px-4 py-9">
          <a
            href="https://clyro.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[6px] px-[10.8px] text-sm text-[#919191] hover:text-white transition-colors"
          >
            Built using clyro
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </footer>
      </div>
    </main>
  );
}
