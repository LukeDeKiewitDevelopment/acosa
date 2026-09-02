import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { AcosaImage } from "./image";
import type { ImageMetadata } from "astro";
import type { CSSProperties } from "react";

export type HeroProps = {
  heading: string;
  subheading?: string;
  eyebrow?: string;
  body?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  image?: ImageMetadata | null;
  imageAlt?: string;
  imageWidths?: number[];
  imageSizes?: string;
  imageClassName?: string;
  className?: string;
  contentClassName?: string;
  overlay?: HeroOverlay;
};

export type HeroOverlay = {
  color?: string;
  opacity?: number;
  className?: string;
  additonalCss?: CSSProperties;
};

export const Hero = async ({
  heading,
  subheading,
  eyebrow,
  body,
  primaryCta,
  secondaryCta,
  image,
  imageAlt,
  imageWidths,
  imageSizes,
  imageClassName,
  className,
  contentClassName,
  overlay,
}: HeroProps) => {
  return (
    <section
      data-slot="hero"
      className={cn(
        "relative flex min-h-screen flex-1 flex-col items-center justify-center",
        className,
      )}
    >
      <div
        className={cn(
          "dark:text-foreground relative z-20 mx-auto my-24 flex w-4/5 flex-col gap-4",
          contentClassName,
        )}
      >
        {eyebrow && (
          <p className="text-center text-xs font-semibold uppercase tracking-wider">
            {eyebrow}
          </p>
        )}
        {heading && (
          <h1 className="font-heading text-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
            {heading}
          </h1>
        )}
        {(subheading || body) && <Separator className="bg-foreground not-dark:bg-background" />}
        {(subheading || body) && (
          <div className="mx-auto max-w-prose text-center font-sans">
            {body || subheading}
          </div>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mx-auto mt-2 flex flex-wrap justify-center gap-3">
            {primaryCta && <a href={primaryCta.href} className="bg-primary text-primary-foreground inline-flex rounded-full px-6 py-3 text-sm font-medium no-underline">{primaryCta.label}</a>}
            {secondaryCta && <a href={secondaryCta.href} target={secondaryCta.external ? "_blank" : undefined} rel={secondaryCta.external ? "noopener noreferrer" : undefined} className="border-background text-background inline-flex rounded-full border px-6 py-3 text-sm font-medium no-underline">{secondaryCta.label}</a>}
          </div>
        )}
      </div>

      {overlay && (
        <div
          className={cn("absolute z-10 size-full", overlay.className)}
          style={{
            backgroundColor: overlay.color || "oklch(0 0 0)",
            opacity: `${overlay.opacity || 50}%`,
            ...overlay.additonalCss,
          }}
        ></div>
      )}

      {image && (
        <AcosaImage
          src={image}
          alt={imageAlt || ""}
          widths={imageWidths || [320, 480, 640, 960, 1280, 1920]}
          sizes={imageSizes || "100vw"}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className={cn(
            "absolute z-5 h-full w-full object-cover",
            imageClassName,
          )}
        />
      )}
    </section>
  );
};
