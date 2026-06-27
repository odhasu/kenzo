import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-kenzo-accent text-black hover:bg-teal-400 active:bg-teal-500",
  secondary: "bg-white text-black hover:bg-gray-200 active:bg-gray-300",
  ghost: "bg-transparent text-kenzo-text-secondary hover:bg-kenzo-hover hover:text-kenzo-text",
  outline: "border border-kenzo-border bg-transparent text-kenzo-text hover:bg-kenzo-hover",
  danger: "bg-kenzo-danger text-white hover:bg-red-600 active:bg-red-700",
  link: "bg-transparent text-kenzo-text-secondary hover:text-kenzo-text underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
  pill: "h-12 px-8 text-sm rounded-full gap-2",
} as const;

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kenzo-accent focus-visible:ring-offset-2 focus-visible:ring-offset-kenzo-deep disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
