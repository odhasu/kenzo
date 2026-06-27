"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { label: "Docs", href: "#" },
  { label: "Discord", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Affiliates", href: "#" },
  { label: "Terms", href: "#" },
];

export function DashboardSidebar({ firstName }: { firstName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function handleLogout() {
    await fetch("/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-kenzo-deep border-r border-kenzo-border-subtle flex flex-col z-20">
      {/* Logo */}
      <div className="px-5 pt-5 pb-0">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-kenzo-text font-[family-name:var(--font-lora)] tracking-tight"
        >
          Kenzo
        </Link>
      </div>

      {/* Nav */}
      <nav className="p-3 flex flex-col gap-0.5 mt-2">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive("/dashboard")
              ? "bg-kenzo-hover text-kenzo-text"
              : "text-kenzo-text-secondary hover:text-kenzo-text hover:bg-kenzo-hover"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l6-4 6 4v8H2V6z" />
            <path d="M6 14V9h4v5" />
          </svg>
          Home
        </Link>
        <Link
          href="/dashboard/templates"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isActive("/dashboard/templates")
              ? "bg-kenzo-hover text-kenzo-text"
              : "text-kenzo-text-secondary hover:text-kenzo-text hover:bg-kenzo-hover"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="5" height="5" rx="1" />
            <rect x="10" y="1" width="5" height="5" rx="1" />
            <rect x="1" y="10" width="5" height="5" rx="1" />
            <rect x="10" y="10" width="5" height="5" rx="1" />
          </svg>
          Templates
        </Link>
      </nav>

      {/* Quick links */}
      <div className="px-5 py-5 flex-1">
        <div className="text-[11px] font-semibold text-kenzo-text-dim uppercase tracking-wider mb-2">
          Quick links
        </div>
        <div className="flex flex-col gap-0.5">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block py-1 text-[13px] text-kenzo-text-secondary hover:text-kenzo-text transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* User row */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-kenzo-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-kenzo-hover text-kenzo-text flex items-center justify-center text-xs font-semibold uppercase">
            {firstName.charAt(0)}
          </div>
          <span className="text-[13px] text-kenzo-text font-medium">{firstName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-1 rounded-md text-kenzo-text-muted hover:text-kenzo-text hover:bg-kenzo-hover transition-colors"
          title="Sign out"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 14H2V2h4M10 11l3-3-3-3M13 8H5" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
