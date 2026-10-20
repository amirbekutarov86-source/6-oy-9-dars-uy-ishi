import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Mahsulotning "rasmi": rangli fon ustida emoji */
export function ProductTile({
  emoji,
  hue,
  className,
  size = "md",
}: {
  emoji: string;
  hue: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-10 w-10 text-xl rounded-lg", md: "h-16 w-16 text-3xl rounded-xl", lg: "h-full w-full text-7xl rounded-2xl" };
  return (
    <div
      className={cn("emoji-tile flex shrink-0 items-center justify-center", sizes[size], className)}
      style={{ "--h": hue } as CSSProperties}
      aria-hidden
    >
      <span>{emoji}</span>
    </div>
  );
}
