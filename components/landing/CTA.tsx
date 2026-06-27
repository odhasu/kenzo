"use client";

import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <h2 className="font-[family-name:var(--font-lora)] text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to build your first funnel?
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto">
          Start free. 100 AI credits included. No credit card required.
        </p>
        <div className="mt-8">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center rounded-full bg-teal-500 px-8 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </section>
  );
}
