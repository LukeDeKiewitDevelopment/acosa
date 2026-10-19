import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "../ui/button";
import { TextLink } from "./text-link";

/* CTA hierarchy (Creative Direction Blueprint §2 and §4):
   - primary   → gold. One per visual grouping.
   - secondary → outline; adapts to light, warm and navy surfaces.
   - link      → tertiary text link with a gold underline. */
type CtaVariant = "primary" | "secondary" | "link";
type CtaSize = "sm" | "md" | "lg";
type CtaIcon = "arrow" | "whatsapp" | "email" | "phone" | "external" | "none";

export type CtaLinkProps = {
  label: string;
  href: string;
  variant?: CtaVariant;
  size?: CtaSize;
  icon?: CtaIcon;
  external?: boolean;
  className?: string;
  trackingKey?: string;
  propertyId?: string;
  propertyName?: string;
};

const sizeMap = {
  sm: "sm",
  md: "default",
  lg: "lg",
} as const;

/* Contact-channel icons lead the label; directional icons trail it. */
const leadingIcons: Partial<Record<CtaIcon, React.ReactNode>> = {
  whatsapp: <MessageCircle aria-hidden="true" />,
  email: <Mail aria-hidden="true" />,
  phone: <Phone aria-hidden="true" />,
};

const trailingIcons: Partial<Record<CtaIcon, React.ReactNode>> = {
  arrow: (
    <ArrowRight
      aria-hidden="true"
      className="transition-transform duration-200 group-hover/button:translate-x-0.5"
    />
  ),
  external: <ArrowUpRight aria-hidden="true" />,
};

export function CtaLink({
  label,
  href,
  variant = "primary",
  size = "md",
  icon = "none",
  external = false,
  className,
  trackingKey,
  propertyId,
  propertyName,
}: CtaLinkProps) {
  if (variant === "link") {
    return (
      <TextLink
        label={label}
        href={href}
        external={external}
        className={className}
        trackingKey={trackingKey || "cta_click"}
        propertyId={propertyId}
        propertyName={propertyName}
        icon={icon === "none" ? "arrow" : icon}
      />
    );
  }

  return (
    <Button
      variant={variant === "primary" ? "default" : "outline"}
      size={sizeMap[size]}
      asChild
      className={className}
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-acosa-track={trackingKey || "cta_click"}
        data-property-id={propertyId}
        data-property-name={propertyName || label}
      >
        {leadingIcons[icon]}
        {label}
        {trailingIcons[icon]}
      </a>
    </Button>
  );
}
