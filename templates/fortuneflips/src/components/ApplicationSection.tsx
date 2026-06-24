"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

const questions = [
  {
    id: 1,
    label: "Have you already been reselling? If so, how long? And tell me about it.",
    subtitle: 'If not, type "I\'m just starting."',
  },
  {
    id: 2,
    label: "What's your current monthly income from reselling (if any)?",
    subtitle: "Be honest — this helps me understand where you're at.",
  },
  {
    id: 3,
    label: "What platforms do you currently sell on?",
    subtitle: "e.g., eBay, StockX, GOAT, Amazon, Facebook Marketplace, etc.",
  },
  {
    id: 4,
    label: "What's your biggest challenge or bottleneck right now in reselling?",
    subtitle: "The more specific, the better I can help.",
  },
  {
    id: 5,
    label: "What's your goal? Where do you want to be in 6 months?",
    subtitle: "Income goals, lifestyle goals, etc.",
  },
  {
    id: 6,
    label: "How many hours per week can you dedicate to reselling?",
    subtitle: "School, work, other commitments — just give me the real number.",
  },
  {
    id: 7,
    label: "Why do you want 1-on-1 coaching specifically?",
    subtitle:
      "What made you apply for mentorship instead of just watching free content?",
  },
  {
    id: 8,
    label: "Is there anything else you'd like me to know?",
    subtitle: "Any questions for me, or anything you want to share.",
  },
];

export function ApplicationSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(8).fill(""));

  const isLastStep = currentStep === questions.length - 1;
  const isEmpty = answers[currentStep].trim() === "";

  const handleNext = () => {
    if (isLastStep) {
      // Demo only — log answers to console
      console.log("Application submitted:", answers);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleAnswerChange = (value: string) => {
    const next = [...answers];
    next[currentStep] = value;
    setAnswers(next);
  };

  const progressPercent = Math.round((currentStep / questions.length) * 100);

  const question = questions[currentStep];

  return (
    <section id="application" className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-lg">
        {/* Heading */}
        <div className="mb-2 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center">
            <span className="text-primary">Apply</span> for 1-1 Coaching
          </h2>
          <div className="mx-auto mt-2 h-[2px] w-1/2 rounded-full bg-primary" />
          <p className="mt-3 text-xs text-muted-foreground">
            Complete the application below to see if you qualify.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-6 rounded-2xl border-2 border-primary/40 bg-card p-5 md:p-8 min-h-[420px] flex flex-col">
          {/* Question Number Badge */}
          <div className="mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              {question.id}
            </span>
          </div>

          {/* Question Area */}
          <div className="flex-1 flex flex-col">
            <div key={currentStep} className="animate-fade-in">
              <label className="mb-1 block text-base font-bold text-foreground md:text-lg">
                {question.label}
              </label>
              {question.subtitle && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {question.subtitle}
                </p>
              )}
              <textarea
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows={5}
                placeholder="Type your answer here..."
                value={answers[currentStep]}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            </div>
          </div>

          {/* Button Row */}
          <div className="mt-6 flex items-center justify-between">
            <div />
            <LiquidMetalButton
              label={isLastStep ? "Submit" : "Next"}
              onClick={isEmpty ? undefined : handleNext}
            />
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>
                Question {currentStep + 1} of {questions.length}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(currentStep / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
