import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export type SectionTone = "default" | "warm" | "ivory" | "navy";
export type SectionSpacing = "default" | "tight" | "none";

export type SectionProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "className"
> & {
  slotName?: string;
  children?: ReactNode;
  /** Applied to the outer, full-width <section>. */
  className?: string;
  /** Applied to the inner page container (ignored when fullWidth). */
  containerClassName?: string;
  /** Skip the page container so children can bleed edge to edge. */
  fullWidth?: boolean;
  /** Surface treatment: plain warm-light, a warm band, or navy authority. */
  tone?: SectionTone;
  spacing?: SectionSpacing;
};

const toneClasses: Record<SectionTone, string> = {
  default: "",
  warm: "surface-warm",
  ivory: "surface-ivory",
  navy: "surface-navy",
};

const spacingClasses: Record<SectionSpacing, string> = {
  default: "section-y",
  tight: "section-y-tight",
  none: "",
};

export const Section = ({
  slotName,
  children,
  className,
  containerClassName,
  fullWidth = false,
  tone = "default",
  spacing = "default",
  ...sectionProps
}: SectionProps) => {
  return (
    <section
      {...sectionProps}
      data-slot={slotName || "section"}
      className={cn(
        "relative w-full",
        toneClasses[tone],
        spacingClasses[spacing],
        className,
      )}
    >
      {fullWidth ? (
        children
      ) : (
        <div className={cn("container-page", containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
};
