import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { AcosaImage } from "./image";
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { CSSProperties } from "react";
import { CtaLink } from "./cta-link";

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
  mobileImage?: ImageMetadata | null;
  tabletImage?: ImageMetadata | null;
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
  mobileImage,
  tabletImage,
  imageAlt,
  imageWidths,
  imageSizes,
  imageClassName,
  className,
  contentClassName,
  overlay,
}: HeroProps) => {
  const hasImage = Boolean(image);
  const responsiveImages = await Promise.all(
    [
      mobileImage && { image: mobileImage, media: "(max-width: 639px)" },
      tabletImage && { image: tabletImage, media: "(min-width: 640px) and (max-width: 1023px)" },
    ]
      .filter(Boolean)
      .map(async (source) => {
        if (!source) return null;
        const optimized = await getImage({
          src: source.image,
          widths: imageWidths || [320, 480, 640, 960, 1280, 1920],
          sizes: imageSizes || "100vw",
        });
        return {
          media: source.media,
          srcSet: optimized.srcSet.attribute || optimized.src,
        };
      }),
  );
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
        "relative flex min-h-[32rem] flex-1 flex-col items-center justify-center overflow-hidden sm:min-h-[34rem] md:min-h-[42rem] lg:min-h-screen",
        className,
      )}
    >
      <div
        className={cn(
          "relative z-20 mx-auto mt-6 mb-12 flex w-4/5 flex-col gap-4 sm:mt-8 sm:mb-16",
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
            {primaryCta && (
              <CtaLink
                label={primaryCta.label}
                href={primaryCta.href}
                variant="inverted"
                size="lg"
                icon="arrow"
              />
            )}
            {secondaryCta && (
              <CtaLink
                label={secondaryCta.label}
                href={secondaryCta.href}
                variant="outline"
                size="lg"
                external={secondaryCta.external}
                className="border-white/60 bg-black/25 text-white hover:bg-black/40 hover:text-white"
              />
            )}
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
        <picture className="pointer-events-none absolute z-5 size-full">
          {responsiveImages.map(
            (source) =>
              source && <source key={source.media} media={source.media} srcSet={source.srcSet} sizes={imageSizes || "100vw"} />,
          )}
          <AcosaImage
            src={image}
            alt={imageAlt || ""}
            widths={imageWidths || [320, 480, 640, 960, 1280, 1920]}
            sizes={imageSizes || "100vw"}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className={cn(
              "pointer-events-none absolute z-5 size-full object-cover object-[52%_center] sm:object-[50%_center] md:object-center",
              imageClassName,
            )}
          />
        </picture>
      )}
    </section>
  );
};
