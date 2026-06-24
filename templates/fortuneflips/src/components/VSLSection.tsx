"use client";

import { Play } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export function VSLSection() {
  return (
    <section id="vsl" className="px-4 pb-8 md:pb-12">
      <div className="mx-auto max-w-3xl">
        {/* Video Container */}
        <div className="glow-border relative overflow-hidden rounded-2xl bg-card">
          <div
            className="relative w-full"
            style={{ paddingBottom: "56.25%" }}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-pointer"
              aria-label="Play video"
            >
              <img
                src="/images/vsl-thumbnail.webp"
                alt="Video thumbnail"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg md:h-20 md:w-20">
                <Play className="ml-1 h-7 w-7 fill-primary-foreground text-primary-foreground md:h-9 md:w-9" />
              </div>
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <LiquidMetalButton label="Apply For The Inner Circle" />
        </div>
      </div>
    </section>
  );
}
