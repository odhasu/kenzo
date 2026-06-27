import { cn } from "@/lib/utils";

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className }: DividerProps) {
  if (!text) {
    return <hr className={cn("border-kenzo-border-subtle", className)} />;
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 h-px bg-kenzo-border-subtle" />
      <span className="text-xs text-kenzo-text-muted font-medium whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-kenzo-border-subtle" />
    </div>
  );
}
