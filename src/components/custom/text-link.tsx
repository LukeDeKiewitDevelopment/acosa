import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TextLinkIcon =
  "arrow" | "whatsapp" | "email" | "phone" | "external" | "none";

export type TextLinkProps = {
  label: string;
  href: string;
  className?: string;
  trackingKey?: string;
  external?: boolean;
  icon?: TextLinkIcon;
  propertyId?: string;
  propertyName?: string;
};

/* Tertiary action: the label carries a gold underline, the only gold on the
   link, so it reads as an action without competing with gold buttons. */
export const textLinkClassName =
  "group/link inline-flex w-fit items-center gap-2 font-sans whitespace-nowrap text-[0.9375rem] font-semibold text-foreground no-underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export function TextLink({
  label,
  href,
  className,
  trackingKey,
  external = false,
  icon = "arrow",
  propertyId,
  propertyName,
}: TextLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-acosa-track={trackingKey || "text_link_click"}
      data-property-id={propertyId}
      data-property-name={propertyName || label}
      className={cn(textLinkClassName, className)}
    >
      {icon === "whatsapp" && (
        <MessageCircle className="size-4" aria-hidden="true" />
      )}
      {icon === "email" && <Mail className="size-4" aria-hidden="true" />}
      {icon === "phone" && <Phone className="size-4" aria-hidden="true" />}
      <span className="decoration-gold underline decoration-2 underline-offset-[6px] transition-colors group-hover/link:decoration-current">
        {label}
      </span>
      {icon === "arrow" && (
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5"
          aria-hidden="true"
        />
      )}
      {icon === "external" && (
        <ArrowUpRight className="size-4" aria-hidden="true" />
      )}
    </a>
  );
}
