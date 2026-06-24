import { cn } from "@/lib/utils";

interface GlassOptionProps {
  label: string;
  value: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function GlassOption({
  label,
  value,
  selected,
  onClick,
  className,
}: GlassOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3.5 py-2 rounded-[10px] text-base cursor-pointer",
        "border transition-all",
        selected
          ? "border-[#39ff14] bg-[rgba(57,255,20,0.08)] text-white"
          : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#c8c8c8] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]",
        className,
      )}
    >
      <span className="font-semibold mr-2 text-white/70">{value}</span>
      {label}
    </button>
  );
}
