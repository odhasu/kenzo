"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Clock,
  DollarSign,
} from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

const proofBadges = [
  {
    icon: Clock,
    text: "10–20 hrs/week",
    sub: "Flexible schedule",
  },
  {
    icon: BadgeCheck,
    text: "Proven Blueprint",
    sub: "90-day system",
  },
  {
    icon: DollarSign,
    text: "$5K–$20K/Mo",
    sub: "Realistic target",
  },
];

const marketplaces = [
  "eBay",
  "StockX",
  "GOAT",
  "Amazon",
  "FB Marketplace",
  "Poshmark",
  "Mercari",
  "Whatnot",
];

const avatarColors = [
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-lime-500",
];

export function HeroSection() {
  const [avatarsVisible] = useState(true);

  return (
    <section className="hero-gradient relative overflow-hidden px-4 pt-24 pb-8 md:pt-32 md:pb-12">
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 mb-6">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Free Training Reveals:
        </div>

        {/* H1 */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-foreground mb-4">
          See How Regular People Are Making{" "}
          <span className="text-primary">$5K–$20K/Month</span>{" "}
          With Reselling Automation
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-lg leading-relaxed">
          A proven system that combines automation tools, vetted suppliers, and
          1-on-1 mentorship to build a profitable reselling business — even if
          you&apos;re starting from zero.
        </p>

        {/* Proof badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {proofBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.text}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card/80 backdrop-blur-sm px-4 py-3 text-left md:px-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground whitespace-nowrap">
                    {badge.text}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <LiquidMetalButton
            label="Apply For The Inner Circle"
            onClick={() =>
              document
                .getElementById("application")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </div>

        {/* Urgency */}
        <p className="mt-4 text-xs text-muted-foreground md:text-sm">
          <span className="font-semibold text-warning">
            ⚡ Spots are limited —
          </span>{" "}
          only accepting 10 new students this month. Applications close once full.
        </p>

        {/* Social proof — avatars */}
        <div
          className={`mt-8 flex items-center justify-center gap-3 transition-all duration-700 ${
            avatarsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Avatar stack */}
          <div className="flex -space-x-3">
            {avatarColors.map((color, i) => (
              <div
                key={i}
                className={`h-9 w-9 rounded-full border-2 border-background ${color} flex items-center justify-center text-xs font-bold text-white shadow-md`}
                style={{ zIndex: avatarColors.length - i }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">
              Join 100+ students
            </p>
            <p className="text-xs text-muted-foreground">
              already inside the Inner Circle
            </p>
          </div>
        </div>

        {/* Marketplace logo scroll */}
        <div className="mt-10 overflow-hidden">
          <p className="mb-3 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            Students sell on every major platform
          </p>
          <div className="relative">
            {/* Gradient fades on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-background z-10 pointer-events-none" />

            <div className="flex animate-marquee">
              {/* First set */}
              {marketplaces.map((name) => (
                <span
                  key={name}
                  className="shrink-0 mx-3 px-4 py-2 rounded-lg border border-border bg-card text-sm font-semibold text-muted-foreground whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {marketplaces.map((name) => (
                <span
                  key={`dup-${name}`}
                  className="shrink-0 mx-3 px-4 py-2 rounded-lg border border-border bg-card text-sm font-semibold text-muted-foreground whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
