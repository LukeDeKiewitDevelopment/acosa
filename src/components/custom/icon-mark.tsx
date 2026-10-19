import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* The one icon treatment for feature lists, steps and contact routes:
   a soft gold-tinted 8px tile on light surfaces, a gold outline on navy. */
export const IconMark = ({
  icon: Icon,
  tone = "light",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: "light" | "navy";
  size?: "sm" | "md";
  className?: string;
}) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-lg",
      size === "md" ? "size-11" : "size-9",
      tone === "light"
        ? "bg-gold/12 text-gold-ink"
        : "border-gold/40 text-gold border",
      className,
    )}
  >
    <Icon className={size === "md" ? "size-5" : "size-4"} />
  </span>
);
