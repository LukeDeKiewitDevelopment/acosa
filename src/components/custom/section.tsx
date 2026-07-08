import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import type { ReactNode } from "react";

export type SectionProps = {
  title?: string;
  slotName?: string;
  children?: ReactNode;
  className?: string;
};

export const Section = ({
  title,
  slotName,
  children,
  className,
}: SectionProps) => {
  return (
    <section
      data-slot={slotName}
      className={cn("mx-auto flex max-w-4/5 flex-col gap-8", className)}
    >

      {title && (
        <h2 className="xl:text-5x1 heading-font text-center text-2xl font-semibold md:text-3xl lg:text-4xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};
