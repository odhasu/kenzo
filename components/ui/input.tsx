import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-kenzo-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-kenzo-text-muted">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-kenzo-input border border-kenzo-border bg-kenzo-input px-3.5 text-sm text-kenzo-text placeholder:text-kenzo-text-dim transition-colors duration-150",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "focus:outline-none focus:ring-2 focus:ring-kenzo-accent focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-kenzo-danger focus:ring-kenzo-danger",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-kenzo-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
