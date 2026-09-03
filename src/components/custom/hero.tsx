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
  const hasImage = Boolean(image);
  const effectiveOverlay = hasImage
    ? {
        color: overlay?.color || "#000",
        opacity: Math.max(55, overlay?.opacity ?? 50),
        className: overlay?.className,
        additonalCss: overlay?.additonalCss,
      }
    : undefined;

  return (
    <section
      data-slot="hero"
      className={cn(
        "relative flex min-h-152 flex-1 flex-col items-center justify-center overflow-hidden md:min-h-screen",
        className,
      )}
    >
      <div
        className={cn(
          "relative z-20 mx-auto my-24 flex w-4/5 flex-col gap-4",
          contentClassName,
          hasImage ? "text-white" : "text-foreground",
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
        {(subheading || body) && <Separator className="bg-current" />}
        {(subheading || body) && (
          <div className="mx-auto max-w-prose text-center font-sans">
            {body || subheading}
          </div>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mx-auto mt-2 flex w-full max-w-md flex-col justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
            {primaryCta && <a href={primaryCta.href} className="bg-white text-[#121743] inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-center text-sm font-semibold no-underline shadow-sm hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{primaryCta.label}</a>}
            {secondaryCta && <a href={secondaryCta.href} target={secondaryCta.external ? "_blank" : undefined} rel={secondaryCta.external ? "noopener noreferrer" : undefined} className="border-white bg-black/25 text-white inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 text-center text-sm font-semibold no-underline shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{secondaryCta.label}</a>}
          </div>
        )}
      </div>

      {effectiveOverlay && (
        <div
          className={cn("pointer-events-none absolute z-10 size-full", effectiveOverlay.className)}
          style={{
            backgroundColor: effectiveOverlay.color || "oklch(0 0 0)",
            opacity: `${effectiveOverlay.opacity ?? 50}%`,
            ...effectiveOverlay.additonalCss,
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
            "pointer-events-none absolute z-5 h-full w-full object-cover object-[65%_center] md:object-center",
            imageClassName,
          )}
        />
      )}
    </section>
  );
};
