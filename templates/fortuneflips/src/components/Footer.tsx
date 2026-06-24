export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-8">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 md:flex-row md:justify-between">
        {/* Brand */}
        <p className="text-sm font-bold text-foreground">
          Fortune<span className="text-primary">Flips</span>
        </p>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          &copy; 2026 Fortune Flips. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
