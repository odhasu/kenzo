"use client";

import {
  MessageCircle,
  CircleCheckBig,
  BookOpen,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

const items = [
  {
    label: "1-on-1 Direct Coaching",
    description: "My personal phone number & calendar. Unlimited calls and texts.",
    value: "$2,000",
    icon: MessageCircle,
    highlight: true,
  },
  {
    label: "Verified Vendor Network",
    description: "50+ vetted suppliers including StockX & Alias-passing vendors.",
    value: "$1,500",
    icon: CircleCheckBig,
  },
  {
    label: "Complete Training Vault",
    description: "5+ hours of custom modules. First listing → consistent $10K months.",
    value: "$1,000",
    icon: BookOpen,
  },
  {
    label: "Custom Scaling Blueprint",
    description: "Tailored 90-day plan built around your situation & goals.",
    value: "$1,500",
    icon: TrendingUp,
  },
  {
    label: "Private Community",
    description: "100+ elite resellers. Daily deal-sharing, partnerships, accountability.",
    value: "$500",
    icon: Users,
  },
  {
    label: "Automation & Software Stack",
    description: "Tools that find deals, cross-list, and track inventory 24/7.",
    value: "$500",
    icon: Zap,
  },
];

export function ValueStackSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Everything You{" "}
            <span className="text-primary">Get</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            When you join the Inner Circle, here&apos;s exactly what&apos;s included.
          </p>
        </div>

        {/* Value items */}
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-colors hover:border-primary/30 ${
                  item.highlight
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                </div>

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground">
                    {item.label}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground hidden sm:block">
                    {item.description}
                  </p>
                </div>

                {/* Value */}
                <span className="shrink-0 text-sm font-extrabold text-primary tabular-nums">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-6 rounded-2xl border-2 border-primary/40 bg-primary/5 p-5 md:p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground md:text-base">
              Total Value
            </span>
            <span className="text-xl font-extrabold text-foreground line-through decoration-muted-foreground/40 md:text-2xl">
              $7,000
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-bold text-primary md:text-base">
              Today — Application Based
            </span>
            <span className="text-xl font-extrabold text-primary md:text-2xl">
              Apply Free
            </span>
          </div>
        </div>

        {/* Urgency note */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          This won&apos;t be open forever. I only take on students I can personally support.
        </p>

        {/* CTA */}
        <div className="mt-6 text-center">
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
