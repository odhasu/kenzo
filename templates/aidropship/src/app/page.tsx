import SmoothScroll from "@/components/SmoothScroll";
import RevealObserver from "@/components/RevealObserver";
import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import PartnersSection from "@/components/PartnersSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import EverythingIncludedSection from "@/components/EverythingIncludedSection";
import FounderSection from "@/components/FounderSection";
import StoresSection from "@/components/StoresSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <RevealObserver />
      <Nav />
      <main>
        <HeroSection />
        <PartnersSection />
        <HowItWorksSection />
        <EverythingIncludedSection />
        <FounderSection />
        <StoresSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
