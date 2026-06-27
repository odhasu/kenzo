import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-kenzo-hover text-kenzo-text-secondary",
  success: "bg-kenzo-accent-dim text-kenzo-accent",
  warning: "bg-yellow-500/10 text-yellow-400",
  danger: "bg-red-500/10 text-red-400",
} as const;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
