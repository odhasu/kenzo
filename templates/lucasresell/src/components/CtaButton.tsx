import { cn } from "@/lib/utils";

interface CtaButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function CtaButton({ children, className }: CtaButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center cursor-pointer",
        "bg-gradient-to-b from-[#5bff3d] via-[#39ff14] to-[#22d600]",
        "text-black font-semibold text-sm leading-normal",
        "rounded-[14.4px] px-[18.4px] py-[14.08px]",
        "shadow-[0_18px_40px_-15px_rgba(57,255,20,0.85),0_3px_6px_0_rgba(255,255,255,0.7)_inset,0_-3px_6px_0_rgba(0,0,0,0.2)_inset]",
        "transition-all hover:brightness-110 hover:scale-[1.02]",
        "max-w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}
