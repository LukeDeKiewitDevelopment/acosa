import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SectionProps = {
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
}: SectionProps) => {
  return (
    <section
      data-slot={slotName || "section"}
      className={cn(
        "flex flex-col gap-8 my-12",
        fullWidth ? "w-full" : "mx-4 md:mx-6 lg:mx-8",
        className,
      )}
    >
      {children}
    </section>
  );
};
