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
        "my-12 flex flex-col gap-8",
        fullWidth ? "w-full" : "mx-4 md:mx-6 lg:mx-8",
        className,
      )}
    >
      {children}
    </section>
  );
};
