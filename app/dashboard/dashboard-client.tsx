"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Funnel = {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
};

const CREDITS = 100;

export function DashboardClient({ firstName, funnels }: { firstName: string; funnels: Funnel[] }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Announcement */}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-kenzo-accent-dim border border-teal-500/20 px-3 py-1 text-xs text-kenzo-accent mb-8">
        <span className="font-semibold">New</span>
        <span className="text-kenzo-text-dim">·</span>
        <span>AI funnel builder is live</span>
        <span className="ml-1 opacity-60">→</span>
      </div>

      {/* Greeting */}
      <h1 className="font-[family-name:var(--font-lora)] text-3xl font-bold text-kenzo-text mb-2">
        Ready to build, {firstName}?
      </h1>
      <p className="text-kenzo-text-secondary text-sm mb-10">
        Create and manage your high-ticket funnels.
      </p>

      {/* CTA card */}
      <Link
        href="/dashboard/templates"
        className="flex items-center gap-4 p-5 rounded-kenzo-card border border-kenzo-border bg-kenzo-card hover:border-kenzo-border-strong transition-colors mb-2"
      >
        <div className="w-10 h-10 rounded-xl bg-kenzo-hover flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-kenzo-text-secondary">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-kenzo-text">New funnel</div>
          <div className="text-[13px] text-kenzo-text-secondary">Pick a template to get started</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-kenzo-hover flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-kenzo-text-secondary">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </Link>
      <p className="text-xs text-kenzo-text-dim mb-10">{CREDITS} AI credits remaining</p>

      {/* Funnel list */}
      {funnels.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-kenzo-text-muted uppercase tracking-wider mb-3">
            Your funnels
          </h2>
          <div className="flex flex-col gap-2">
            {funnels.map((funnel) => (
              <Link
                key={funnel.id}
                href={`/dashboard/funnels/${funnel.id}/edit`}
                className="flex items-center gap-3 p-3.5 rounded-kenzo-card border border-kenzo-border-subtle bg-kenzo-card hover:border-kenzo-border transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-kenzo-hover flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-kenzo-text-muted">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-kenzo-text truncate">{funnel.name}</div>
                  <div className="text-[11px] text-kenzo-text-dim font-mono mt-0.5">/f/{funnel.slug}</div>
                </div>
                {funnel.status === "published" && <Badge variant="success">LIVE</Badge>}
                {funnel.status === "draft" && <Badge>DRAFT</Badge>}
                {funnel.status === "paused" && <Badge variant="warning">PAUSED</Badge>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {funnels.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-kenzo-card border border-dashed border-kenzo-border bg-kenzo-card py-12 px-6 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="text-[15px] font-semibold text-kenzo-text mb-1">No funnels yet</h3>
          <p className="text-[13px] text-kenzo-text-secondary mb-5">Pick a template to start</p>
          <Link
            href="/dashboard/templates"
            className="inline-flex h-10 items-center rounded-lg bg-white px-6 text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
          >
            + New funnel
          </Link>
        </div>
      )}
    </div>
  );
}
