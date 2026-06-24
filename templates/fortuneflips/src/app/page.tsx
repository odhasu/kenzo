import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { VSLSection } from "@/components/VSLSection";
import { ValueStackSection } from "@/components/ValueStackSection";
import { FoundersNoteSection } from "@/components/FoundersNoteSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ApplicationSection } from "@/components/ApplicationSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <VSLSection />
        <ValueStackSection />
        <FoundersNoteSection />
        <TestimonialsSection />
        <ApplicationSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
