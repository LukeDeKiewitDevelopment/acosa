import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type TextLinkProps = {
  label: string;
  href: string;
  className?: string;
  trackingKey?: string;
};

export function TextLink({
  label,
  href,
  className,
  trackingKey,
}: TextLinkProps) {
  return (
    <a
      href={href}
      data-acosa-track={trackingKey || "text_link_click"}
      className={cn(
        "text-primary inline-flex items-center gap-2 font-semibold no-underline",
        className,
      )}
    >
      {label}
      <ArrowRight className="size-4" aria-hidden="true" />
    </a>
  );
}
