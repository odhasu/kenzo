import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  title: string;
  subtitle?: string;
  thumbnailUrl: string;
  className?: string;
}

export function TestimonialCard({
  title,
  subtitle = "Inner Circle Member",
  thumbnailUrl,
  className,
}: TestimonialCardProps) {
  return (
    <button
      className={cn(
        "group relative w-full cursor-pointer text-left",
        "rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]",
        "bg-[rgba(255,255,255,0.03)]",
        "transition-all hover:border-[rgba(255,255,255,0.2)] hover:scale-[1.02]",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#39ff14] text-black shadow-lg">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="p-3.5">
        <p className="text-sm font-medium text-white leading-snug line-clamp-2">
          {title}
        </p>
        <p className="mt-1 text-xs text-[#919191]">{subtitle}</p>
      </div>
    </button>
  );
}
