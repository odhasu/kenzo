"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-20 sm:pt-28 text-center">
      {/* Subtle gradient blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10">
        <h1 className="mx-auto max-w-3xl font-[family-name:var(--font-lora)] text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Build and scale high-ticket funnels with AI.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-gray-500 sm:text-lg leading-relaxed">
          Kenzo helps coaches and agency owners create, publish, and optimize
          sales funnels — powered by AI. No coding. No designers. Just results.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-8 text-sm font-medium text-gray-900 shadow-sm backdrop-blur-md hover:bg-white transition-colors"
          >
            Start free trial
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">No credit card required · 100 free AI credits</p>
      </div>
    </section>
  );
}
