import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export type SectionProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "className"
> & {
  slotName?: string;
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

export const Section = ({
  slotName,
  children,
  className,
  fullWidth = false,
  ...sectionProps
}: SectionProps) => {
  return (
    <section
      {...sectionProps}
      data-slot={slotName || "section"}
      className={cn(
        "my-6 flex flex-col gap-6 md:my-8 md:gap-8",
        fullWidth ? "w-full" : "mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </section>
  );
};
