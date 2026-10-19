import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SectionHeaderProps = {
  eyebrow?: string | null;
  title: string;
  lead?: string | null;
  /** Rendered under the lead, e.g. a text link. */
  children?: ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2";
  /** Gold eyebrow, for navy surfaces. */
  accent?: boolean;
  className?: string;
  titleClassName?: string;
};

/* The shared eyebrow → heading → supporting-text block, so every page keeps
   the same hierarchy. */
export const SectionHeader = ({
  eyebrow,
  title,
  lead,
  children,
  align = "start",
  as: Heading = "h2",
  accent = false,
  className,
  titleClassName,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className={accent ? "eyebrow-accent" : "eyebrow"}>{eyebrow}</p>
      )}
      <Heading
        className={cn(Heading === "h1" ? "type-h1" : "type-h2", titleClassName)}
      >
        {title}
      </Heading>
      {lead && <p className="type-lead">{lead}</p>}
      {children}
    </div>
  );
};
