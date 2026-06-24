"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  CircleCheckBig,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CardData {
  tag: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

const iconMap: Record<string, LucideIcon> = {
  MessageCircle,
  CircleCheckBig,
  BookOpen,
  TrendingUp,
  Users,
};

const cards: CardData[] = [
  {
    tag: "Direct Access",
    title: "1-on-1 Guidance",
    description:
      "Get my personal phone number and calendar to book 1-on-1 calls and text me whenever — unlimited access",
    icon: "MessageCircle",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    tag: "Vendor Network",
    title: "Verified Vendors",
    description:
      "Get access to my full list of 50+ top-tier vendors from around the world — including StockX and Alias passing vendors",
    icon: "CircleCheckBig",
    gradient: "from-emerald-500/20 to-green-500/10",
  },
  {
    tag: "Training Library",
    title: "Training Vault",
    description:
      "Get 5+ hours of custom training modules covering every aspect of reselling — from your first listing to consistent sales",
    icon: "BookOpen",
    gradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    tag: "Proven Systems",
    title: "Scaling Blueprint",
    description:
      "Get a custom scaling blueprint crafted around your situation to reach $5–10K+ per month in under 90 days",
    icon: "TrendingUp",
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    tag: "Join the Movement",
    title: "Private Community",
    description:
      "Join a community of 100+ like-minded elite resellers to connect, learn, and build with",
    icon: "Users",
    gradient: "from-rose-500/20 to-pink-500/10",
  },
];

function Card({
  data,
  index,
  visible,
  isMobile,
}: {
  data: CardData;
  index: number;
  visible: boolean;
  isMobile: boolean;
}) {
  const Icon = iconMap[data.icon];

  return (
    <div
      className={`relative flex shrink-0 cursor-pointer flex-col rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 ${
        isMobile ? "w-[72vw] snap-center" : ""
      } ${
        visible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95"
      }`}
      style={{
        transitionDelay: visible ? `${150 + index * 100}ms` : "0ms",
      }}
    >
      {/* Colored gradient overlay */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.gradient} opacity-40`}
      />

      <div className="relative z-10">
        {/* Icon + Tag row */}
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            {Icon && (
              <Icon
                className="h-5 w-5 text-primary"
                strokeWidth={1.8}
              />
            )}
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
            {data.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-bold text-foreground">
          {data.title}
        </h3>

        {/* Description */}
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {data.description}
        </p>

        {/* "Tap to learn more" — mobile only */}
        {isMobile && (
          <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-primary/70">
            <ChevronRight className="h-3 w-3" />
            Tap to learn more
          </div>
        )}
      </div>
    </div>
  );
}

export function MentorshipSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-12 md:py-20 overflow-hidden" ref={sectionRef}>
      {/* Radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(at 50% 0%, rgba(60,255,20,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4">
        {/* Heading */}
        <h2
          className={`text-center text-xl font-extrabold tracking-tight text-foreground md:text-2xl transition-all duration-700 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2.5"
          }`}
        >
          What&apos;s Inside The Mentorship?
        </h2>

        {/* "Swipe to explore" — mobile only */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground md:hidden">
          Swipe to explore
          <ChevronRight className="h-3 w-3 animate-[pulse_2s_ease-in-out_infinite]" />
        </p>
      </div>

      <div className="mt-5 md:px-4">
        {/* Mobile: horizontal scroll with snap */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-none md:hidden">
          {cards.map((card, i) => (
            <Card
              key={card.tag}
              data={card}
              index={i}
              visible={visible}
              isMobile
            />
          ))}
        </div>

        {/* Desktop: 3-column grid */}
        <div className="mx-auto hidden max-w-4xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:grid">
          {cards.map((card, i) => (
            <Card
              key={card.tag}
              data={card}
              index={i}
              visible={visible}
              isMobile={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
