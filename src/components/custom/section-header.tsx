import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SectionHeaderProps = {
  eyebrow?: string | null;
  title: string;
  lead?: string | null;
  emphasizeLead?: boolean;
  /** Rendered under the lead, e.g. a text link. */
  children?: ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2";
  /** Gold eyebrow, for navy surfaces. */
  accent?: boolean;
  /** Straight brand-gold underline under the heading's final word. */
  underline?: boolean;
  /** Underline the first occurrence of this word instead of the final word. */
  underlineWord?: string;
  className?: string;
  titleClassName?: string;
};

/* The shared eyebrow → heading → supporting-text block, so every page keeps
   the same hierarchy. */
export const SectionHeader = ({
  eyebrow,
  title,
  lead,
  emphasizeLead = false,
  children,
  align = "start",
  as: Heading = "h2",
  accent = false,
  underline = false,
  underlineWord,
  className,
  titleClassName,
}: SectionHeaderProps) => {
  // The final word (with its punctuation) carries the underline accent.
  const trimmedTitle = title.trim();
  const lastSpace = trimmedTitle.lastIndexOf(" ");
  const titleLead = lastSpace >= 0 ? trimmedTitle.slice(0, lastSpace + 1) : "";
  const titleFinalWord = trimmedTitle.slice(lastSpace + 1);
  const underlineTarget = underlineWord ?? (underline ? titleFinalWord : null);
  const underlineIndex = underlineTarget
    ? trimmedTitle.lastIndexOf(underlineTarget)
    : -1;
  const leadSentence =
    emphasizeLead && lead
      ? (lead.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] ?? lead)
      : null;
  const leadSupportingCopy = leadSentence
    ? lead.slice(leadSentence.length).trim()
    : "";

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
        {underlineIndex >= 0 && underlineTarget ? (
          <>
            {trimmedTitle.slice(0, underlineIndex)}
            <span className="accent-underline">{underlineTarget}</span>
            {trimmedTitle.slice(underlineIndex + underlineTarget.length)}
          </>
        ) : (
          title
        )}
      </Heading>
      {leadSentence ? (
        <>
          <p className={cn("type-emphasis", accent && "text-white")}>
            {leadSentence}
          </p>
          {leadSupportingCopy && (
            <p className={cn("type-body", accent && "text-white/85")}>
              {leadSupportingCopy}
            </p>
          )}
        </>
      ) : (
        lead && <p className="type-lead">{lead}</p>
      )}
      {children}
    </div>
  );
};
