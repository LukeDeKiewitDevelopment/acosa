import type { ReactNode } from "react";
import { Section } from "./section";

export type TextSectionProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
};

export const TextSection = ({
  title,
  children,
  className,
}: TextSectionProps) => {
  return (
    <Section slotName="text-section" title={title} className={className}>
      <div className="text-muted-foreground mx-auto max-w-prose text-center">
        {children}
      </div>
    </Section>
  );
};
