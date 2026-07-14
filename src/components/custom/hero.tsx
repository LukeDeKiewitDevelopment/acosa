import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { AcosaImage } from "./image";
import type { ImageMetadata } from "astro";
import type { CSSProperties } from "react";

export type HeroProps = {
  heading: string;
  subheading: string;
  image?: ImageMetadata | null | undefined;
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
        {heading && (
          <h1 className="xl:text-5x1 font-heading text-center text-2xl md:text-3xl lg:text-4xl">
            {heading}
          </h1>
        )}
        {subheading && <Separator />}
        {subheading && (
          <div className="mx-auto max-w-prose text-center font-sans">
            {subheading}
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
