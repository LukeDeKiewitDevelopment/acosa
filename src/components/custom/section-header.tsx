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
  /** Brand-gold hand-drawn underline under the heading's final word. */
  underline?: boolean;
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
  underline = false,
  className,
  titleClassName,
}: SectionHeaderProps) => {
  // The final word (with its punctuation) carries the hand-drawn accent.
  const trimmedTitle = title.trim();
  const lastSpace = trimmedTitle.lastIndexOf(" ");
  const titleLead =
    lastSpace >= 0 ? trimmedTitle.slice(0, lastSpace + 1) : "";
  const titleFinalWord = trimmedTitle.slice(lastSpace + 1);

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
        {underline ? (
          <>
            {titleLead}
            <span className="accent-underline">{titleFinalWord}</span>
          </>
        ) : (
          title
        )}
      </Heading>
      {lead && <p className="type-lead">{lead}</p>}
      {children}
    </div>
  );
};
