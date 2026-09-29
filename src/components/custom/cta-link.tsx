import { ArrowRight, MessageCircle } from "lucide-react";
import { Button, type buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type CtaVariant = "primary" | "secondary" | "outline" | "inverted" | "link";
type CtaSize = "sm" | "md" | "lg";
type CtaIcon = "arrow" | "whatsapp" | "none";

export type CtaLinkProps = {
  label: string;
  href: string;
  variant?: CtaVariant;
  size?: CtaSize;
  icon?: CtaIcon;
  external?: boolean;
  className?: string;
  trackingKey?: string;
};

const variantMap: Record<CtaVariant, VariantProps<typeof buttonVariants>["variant"]> = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  inverted: "default",
  link: "link",
};

const sizeMap: Record<CtaSize, VariantProps<typeof buttonVariants>["size"]> = {
  sm: "sm",
  md: "default",
  lg: "lg",
};

const iconMap: Record<CtaIcon, React.ReactNode> = {
  arrow: <ArrowRight className="size-4" aria-hidden="true" />,
  whatsapp: <MessageCircle className="size-4" aria-hidden="true" />,
  none: null,
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
}: CtaLinkProps) {
  const isDarkContext = variant === "inverted";
  const isLink = variant === "link";

  return (
    <Button
      variant={variantMap[variant]}
      size={sizeMap[size]}
      asChild
      className={cn(
        !isLink && "rounded-full no-underline",
        isDarkContext && "bg-background text-foreground hover:bg-background/90",
        className,
      )}
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-acosa-track={trackingKey || "cta_click"}
        data-property-name={label}
        className="no-underline"
      >
        {icon === "whatsapp" && iconMap.whatsapp}
        {label}
        {icon === "arrow" && iconMap.arrow}
      </a>
    </Button>
  );
}
