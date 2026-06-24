"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  CloseIcon,
} from "./icons";
import { cn } from "@/lib/utils";

const SLOTS = [8, 7, 6, 5, 4, 3, 2];

export default function FinalCtaSection() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  if (!visible) return null;

  return (
    <section style={{ padding: "120px 64px", display: "flex", justifyContent: "center" }}>
      <div
        className="relative w-full"
        style={{
          backgroundColor: "rgba(99,102,241,0.04)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: 48,
          maxWidth: 480,
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute hover:opacity-100 transition-opacity"
          style={{
            top: 20,
            right: 20,
            opacity: 0.7,
          }}
        >
          <CloseIcon color="#7f84a0" width={20} height={20} />
        </button>

        {/* Heading */}
        <h2
          className="text-center mb-6"
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#e8ecf1",
            lineHeight: 1.2,
          }}
        >
          Get Your Free Store Built + $4,500 Course
        </h2>

        {/* Countdown */}
        <div
          className="flex justify-center items-center mb-8"
          style={{ gap: 4, fontSize: 14, color: "#7f84a0" }}
        >
          {SLOTS.map((digit) => (
            <span
              key={digit}
              className="font-mono"
              style={{
                backgroundColor: "rgba(99,102,241,0.12)",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 14,
                fontWeight: 700,
                color: "#e8ecf1",
              }}
            >
              {digit}
            </span>
          ))}
          <span> free slots remaining</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full name */}
          <div className="relative mb-4">
            <span
              className="absolute"
              style={{
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7f84a0",
              }}
            >
              <UserIcon width={20} />
            </span>
            <input
              type="text"
              placeholder="Full name"
              style={{
                width: "100%",
                padding: "14px 16px 14px 48px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "#e8ecf1",
                fontSize: 16,
                outline: "none",
              }}
              className="placeholder-[#7f84a0] font-[inherit]"
            />
          </div>

          {/* Email address */}
          <div className="relative mb-4">
            <span
              className="absolute"
              style={{
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7f84a0",
              }}
            >
              <MailIcon width={20} />
            </span>
            <input
              type="email"
              placeholder="Email address"
              style={{
                width: "100%",
                padding: "14px 16px 14px 48px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "#e8ecf1",
                fontSize: 16,
                outline: "none",
              }}
              className="placeholder-[#7f84a0] font-[inherit]"
            />
          </div>

          {/* Phone number */}
          <div className="relative mb-4">
            <span
              className="absolute"
              style={{
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7f84a0",
              }}
            >
              <PhoneIcon width={20} />
            </span>
            <input
              type="tel"
              placeholder="Phone number"
              style={{
                width: "100%",
                padding: "14px 16px 14px 48px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "#e8ecf1",
                fontSize: 16,
                outline: "none",
              }}
              className="placeholder-[#7f84a0] font-[inherit]"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="mb-4 w-full text-white border-none cursor-pointer font-bold transition-[transform,box-shadow] duration-300"
            style={{
              backgroundColor: "#6366f1",
              borderRadius: 12,
              padding: "16px 32px",
              fontSize: 16,
              fontWeight: 700,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(99,102,241,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Claim My Free Store + Course →
          </button>
        </form>

        {/* Trust row */}
        <div
          className="flex items-center justify-center mb-3"
          style={{ gap: 2 }}
        >
          <LockIcon width={16} color="#7f84a0" />
          <span style={{ fontSize: 13, color: "#7f84a0" }}>
            Your information is 100% secure.
          </span>
        </div>

        {/* Legal */}
        <p
          className="text-center"
          style={{ fontSize: 12, color: "#7f84a0", lineHeight: 1.5 }}
        >
          By submitting, you agree to our{" "}
          <a
            href="/terms"
            style={{ color: "#6366f1" }}
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            style={{ color: "#6366f1" }}
          >
            Privacy Policy
          </a>
          . NO-SPAM. Opt out anytime.
        </p>
      </div>
    </section>
  );
}
