import { cn } from "@/lib/utils"

const links = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Contact", href: "mailto:nathan@aiecominsiders.com" },
]

function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] bg-transparent px-16 py-8 max-sm:flex-col max-sm:items-center max-sm:text-center",
        className,
      )}
    >
      <p className="text-sm text-[#7f84a0]">
        &copy; 2026 AI Dropshipping Builder. All rights reserved.
      </p>
      <nav className="flex items-center gap-0">
        {links.map((link, i) => (
          <span key={link.href} className="flex items-center">
            {i > 0 && (
              <span className="text-sm text-[#7f84a0]" aria-hidden="true">
                {" "}
                ·{" "}
              </span>
            )}
            <a
              href={link.href}
              className="text-sm text-[#7f84a0] no-underline hover:text-[#e8ecf1]"
            >
              {link.label}
            </a>
          </span>
        ))}
      </nav>
    </footer>
  )
}

export default Footer
