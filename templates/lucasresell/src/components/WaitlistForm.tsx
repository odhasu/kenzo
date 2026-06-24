"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

interface Question {
  heading: string;
  options: { value: string; label: string }[];
}

const questions: Question[] = [
  {
    heading: "How long have you been reselling?",
    options: [
      { value: "A", label: "I'm just starting" },
      { value: "B", label: "Less than 6 months" },
      { value: "C", label: "6 months - 1 year" },
      { value: "D", label: "1 - 2 years" },
      { value: "E", label: "2+ years" },
    ],
  },
];

const totalDots = 7;

export function WaitlistForm() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const question = questions[step];
  if (!question) return null;

  return (
    <section
      id="application-form"
      className="relative w-full bg-transparent"
      style={{
        zIndex: 2000000,
        paddingTop: "clamp(30px, 16px + 2.2vw, 46px)",
        paddingBottom: "clamp(30px, 16px + 2.2vw, 46px)",
        paddingLeft: "clamp(0.85rem, 4vw, 1.5rem)",
        paddingRight: "clamp(0.85rem, 4vw, 1.5rem)",
      }}
    >
      <div
        className="mx-auto flex flex-col"
        style={{
          maxWidth: "700px",
          padding: "clamp(0.625rem, 2vw, 1.25rem) clamp(0.875rem, 3vw, 1.75rem)",
          minHeight: "clamp(360px, 52vh, 560px)",
          borderRadius: "1rem",
          overflow: "hidden",
          background: "#000000",
          border: "2px solid rgba(57, 255, 20, 0.3)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          transition: "border-color 0.3s",
        }}
      >
        {/* Hidden form inputs */}
        <input type="hidden" />
        <input type="hidden" />

        {/* Content area */}
        <div
          className="flex flex-col"
          style={{ flex: "1 1 auto", justifyContent: "center" }}
        >
          {/* Step number badge */}
          <span
            className="inline-flex items-center justify-center font-bold"
            style={{
              width: "clamp(2.5rem, 10vw, 3rem)",
              height: "clamp(2.5rem, 10vw, 3rem)",
              borderRadius: "0.75rem",
              background: "rgba(57, 255, 20, 0.1)",
              color: "#39FF14",
              fontSize: "clamp(1rem, 4vw, 1.25rem)",
              marginBottom: "0.75rem",
              alignSelf: "flex-start",
              animation:
                "clyro-step-up 500ms cubic-bezier(0.22, 1, 0.36, 1) 60ms forwards",
            }}
          >
            {step + 1}
          </span>

          {/* Question heading */}
          <div
            className="text-left"
            style={{
              marginBottom: "clamp(1rem, 3.5vw, 1.75rem)",
              animation:
                "clyro-step-up 500ms cubic-bezier(0.22, 1, 0.36, 1) 110ms forwards",
            }}
          >
            <h3
              className="font-heading text-[32px] leading-[44.8px] font-medium"
              style={{ color: "rgb(200, 200, 200)", margin: 0 }}
            >
              {question.heading}
            </h3>
          </div>

          {/* Option buttons */}
          <div className="flex flex-col gap-2">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className="flex items-center text-left cursor-pointer w-full"
                style={{
                  gap: "0.75rem",
                  padding:
                    "clamp(0.4rem, 1.6vw, 0.5rem) clamp(0.75rem, 2.5vw, 0.875rem)",
                  borderRadius: "0.625rem",
                  border:
                    selected === opt.value
                      ? "1px solid #39ff14"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  background:
                    selected === opt.value
                      ? "rgba(57, 255, 20, 0.08)"
                      : "rgba(255, 255, 255, 0.03)",
                  color:
                    selected === opt.value ? "#ffffff" : "rgb(200, 200, 200)",
                  transition: "all 0.2s",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color:
                      selected === opt.value
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {opt.value}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{ marginTop: "1rem" }}
        >
          <button
            type="button"
            disabled={step === 0}
            className="flex items-center font-heading"
            style={{
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              background: "transparent",
              border: "none",
              color: step === 0 ? "transparent" : "rgb(200, 200, 200)",
              fontSize: "1rem",
              cursor: step === 0 ? "default" : "pointer",
              transition: "color 0.2s",
              pointerEvents: step === 0 ? "none" : "auto",
            }}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              if (step < questions.length - 1) {
                setStep(step + 1);
                setSelected(null);
              }
            }}
            className="inline-flex items-center font-heading font-semibold cursor-pointer"
            style={{
              gap: "0.75rem",
              padding: "0.875rem 1.75rem",
              borderRadius: "0.75rem",
              border: "none",
              background:
                "rgba(255, 255, 255, 0.03)",
              color: "rgb(120, 120, 120)",
              fontSize: "clamp(1rem, 3.2vw, 1.125rem)",
              opacity: 1,
              boxShadow: "none",
              transition: "all 0.2s",
            }}
          >
            OK
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div
          className="flex justify-center flex-shrink-0"
          style={{ gap: "0.5rem", marginTop: "1rem" }}
        >
          {Array.from({ length: totalDots }, (_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                height: "0.5rem",
                width: i === step ? "1.5rem" : "0.5rem",
                background:
                  i === step
                    ? "#39FF14"
                    : "rgba(255, 255, 255, 0.12)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Clyro attribution */}
        <a
          href="https://clyro.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center font-heading no-underline"
          style={{
            gap: "0.375rem",
            marginTop: "1rem",
            fontSize: "0.875rem",
            color: "rgb(120, 120, 120)",
          }}
        >
          Form built with Clyro
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes clyro-step-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
