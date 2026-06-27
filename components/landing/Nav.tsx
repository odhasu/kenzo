"use client";

import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-lora)] text-lg font-bold text-gray-900 tracking-tight"
        >
          Kenzo
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Testimonials
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
        </nav>

        <Link
          href="/signup"
          className="inline-flex h-9 items-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
        >
          Start free trial
        </Link>
      </div>
    </header>
  );
}
