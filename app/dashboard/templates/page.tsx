"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DbTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: unknown[];
  settings: unknown;
  is_public: boolean;
  created_at: string;
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<DbTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => {
        setTemplates(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleUse(templateId: string) {
    const res = await fetch("/api/templates/use", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId }),
    });
    const data = await res.json();
    if (data.redirect) {
      router.push(data.redirect);
    } else if (data.error) {
      alert(data.error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[13px] text-kenzo-text-secondary hover:text-kenzo-text transition-colors mb-3 block"
        >
          ← Back
        </button>
        <h1 className="font-[family-name:var(--font-lora)] text-2xl font-bold text-kenzo-text mb-1">
          Choose a template
        </h1>
        <p className="text-sm text-kenzo-text-secondary">
          Pick a starting point. Every funnel is fully customizable with AI.
        </p>
      </div>

      {/* Template grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-kenzo-card border border-kenzo-border-subtle bg-kenzo-card h-48 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleUse(template.id)}
              className="rounded-kenzo-card border border-kenzo-border-subtle bg-kenzo-card overflow-hidden text-left hover:border-kenzo-border transition-colors group"
            >
              {/* Preview placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-kenzo-surface to-teal-950/30 flex items-center justify-center">
                <span className="text-3xl opacity-20">⚡</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-kenzo-text text-sm group-hover:text-kenzo-accent transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-kenzo-text-muted mt-1 capitalize">{template.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && templates.length === 0 && (
        <div className="text-center py-16">
          <p className="text-kenzo-text-muted">No templates available yet.</p>
        </div>
      )}

      {/* Bottom help link */}
      <p className="mt-10 text-center text-xs text-kenzo-text-dim">
        Need a custom funnel or having issues?{" "}
        <a href="#" className="text-kenzo-text-secondary hover:text-kenzo-text transition-colors underline underline-offset-2">
          Contact support
        </a>
      </p>
    </div>
  );
}
