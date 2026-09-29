import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionIconProps = {
  icon: LucideIcon;
  className?: string;
};

export function SectionIcon({ icon: Icon, className }: SectionIconProps) {
  return (
    <span
      className={cn(
        "bg-secondary/10 text-secondary flex size-10 shrink-0 items-center justify-center rounded-xl",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}
