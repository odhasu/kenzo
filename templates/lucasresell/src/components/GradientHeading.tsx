import { cn } from "@/lib/utils";

interface GradientHeadingProps {
  as?: "h1" | "h2";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GradientHeading({
  as: Tag = "h1",
  children,
  className,
  style,
}: GradientHeadingProps) {
  return (
    <Tag
      className={cn(
        "text-gradient font-heading tracking-tight",
        className,
      )}
      style={{
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
