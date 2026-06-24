"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

const faqs = [
  {
    question: "What is reselling automation?",
    answer:
      "Reselling automation uses software tools to find underpriced items, list them across marketplaces, and manage inventory — turning what used to be hours of manual work into a system that runs 24/7.",
  },
  {
    question: "How much money can I make?",
    answer:
      "Students in the program typically reach $5K–$20K/month within 90 days. Results vary based on effort, consistency, and following the blueprint. This is not a get-rich-quick scheme — it's a real business model.",
  },
  {
    question: "Do I need experience to start?",
    answer:
      "No prior experience needed. The mentorship covers everything from your first listing to scaling to five figures per month. Whether you're a complete beginner or already selling, the system adapts to your level.",
  },
  {
    question: "How is this different from free YouTube content?",
    answer:
      "Free content gives you scattered information. The mentorship gives you: direct 1-on-1 access to me, a vetted vendor network, custom training modules, a scaling blueprint tailored to your situation, and a private community of serious resellers.",
  },
  {
    question: "What's the time commitment?",
    answer:
      "Most students spend 10–20 hours per week. The automation tools handle the heavy lifting, but you still need to pack and ship orders, source new inventory, and communicate with the community. It's flexible around your schedule.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Still have questions? Apply anyway — we&apos;ll cover everything on the call.
          </p>
          <LiquidMetalButton
            label="Apply For The Inner Circle"
            onClick={() =>
              document
                .getElementById("application")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </div>
      </div>
    </section>
  );
}
