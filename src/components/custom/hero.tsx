import { cn } from "@/lib/utils";
import { AcosaImage } from "./image";
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { CtaLink } from "./cta-link";

/* Cinematic hero (Creative Direction Blueprint §2, §3, §5).
   Desktop: the photograph fills the band, and a directional navy gradient
   sits only behind the copy, so the headline leads and the image supports it.
   Copy goes on the side of the photo that has negative space (`align`).
   Mobile/tablet: the photo is cropped to its subject (`imageClassName`) and the copy
   stacks beneath it on navy. No text over faces, and the headline keeps its
   space. Supplied tablet/mobile crops can be passed as `tabletImage` /
   `mobileImage`. */
export type HeroProps = {
  heading: string;
  subheading?: string;
  eyebrow?: string;
  body?: string;
  primaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  /** "button" = outline button; "link" = quieter text link, so a second
   *  audience gets an entry point without competing with the primary. */
  secondaryStyle?: "button" | "link";
  image?: ImageMetadata | null;
  mobileImage?: ImageMetadata | null;
  tabletImage?: ImageMetadata | null;
  imageAlt?: string;
  imageWidths?: number[];
  imageSizes?: string;
  /** object-position classes that keep the subject in frame per breakpoint. */
  imageClassName?: string;
  /** Brand underline under the heading's final word. */
  underlineHeading?: boolean;
  /** Desktop side for the copy, the side of the photo with negative space. */
  align?: "left" | "right";
  size?: "cinematic" | "standard";
  className?: string;
  contentClassName?: string;
  overlay?: HeroOverlay;
};

export type HeroOverlay = {
  /** Strength of the desktop gradient behind the copy, 0–100. */
  opacity?: number;
};

const DEFAULT_WIDTHS = [480, 768, 1024, 1408, 1920];

export const Hero = async ({
  heading,
  subheading,
  eyebrow,
  body,
  primaryCta,
  secondaryCta,
  secondaryStyle = "button",
  image,
  mobileImage,
  tabletImage,
  imageAlt,
  imageWidths,
  imageSizes,
  imageClassName,
  underlineHeading = false,
  align = "left",
  size = "standard",
  className,
  contentClassName,
  overlay,
}: HeroProps) => {
  const widths = imageWidths || DEFAULT_WIDTHS;
  const sizes = imageSizes || "100vw";
  const responsiveImages = await Promise.all(
    [
      mobileImage && { image: mobileImage, media: "(max-width: 639px)" },
      tabletImage && {
        image: tabletImage,
        media: "(min-width: 640px) and (max-width: 1023px)",
      },
    ]
      .filter(Boolean)
      .map(async (source) => {
        if (!source) return null;
        const optimized = await getImage({
          src: source.image,
          widths,
          sizes,
        });
        return {
          media: source.media,
          srcSet: optimized.srcSet.attribute || optimized.src,
        };
      }),
  );

  // Solid navy behind the copy, releasing the photograph past the midpoint,
  // so light walls in the photo never read as a washed-out tint.
  const strength = Math.min(100, Math.max(60, overlay?.opacity ?? 94));
  const direction = align === "left" ? "to right" : "to left";
  const navy = (pct: number) =>
    `color-mix(in srgb, var(--brand-navy) ${Math.round(pct)}%, transparent)`;
  const gradient = `linear-gradient(${direction}, ${navy(strength)} 0%, ${navy(strength * 0.97)} 34%, ${navy(strength * 0.6)} 50%, ${navy(strength * 0.15)} 66%, transparent 80%)`;

  const copy = body || subheading;
  const headingTrimmed = heading.trim();
  const headingLastSpace = headingTrimmed.lastIndexOf(" ");
  const headingLead =
    headingLastSpace >= 0 ? headingTrimmed.slice(0, headingLastSpace + 1) : "";
  const headingFinalWord = headingTrimmed.slice(headingLastSpace + 1);
  const minHeight =
    size === "cinematic"
      ? "lg:min-h-[min(calc(100svh-4.5rem),54rem)]"
      : "lg:min-h-[34rem] xl:min-h-[38rem]";

  return (
    <section
      data-slot="hero"
      className={cn(
        "surface-navy relative isolate flex flex-col overflow-hidden",
        minHeight,
        className,
      )}
    >
      {image && (
        <div className="relative aspect-4/3 w-full sm:aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
          <picture className="pointer-events-none absolute inset-0">
            {responsiveImages.map(
              (source) =>
                source && (
                  <source
                    key={source.media}
                    media={source.media}
                    srcSet={source.srcSet}
                    sizes={sizes}
                  />
                ),
            )}
            <AcosaImage
              src={image}
              alt={imageAlt || ""}
              widths={widths}
              sizes={sizes}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className={cn(
                "absolute inset-0 h-full w-full max-w-none object-cover object-center",
                imageClassName,
              )}
            />
          </picture>
          {/* Desktop: gradient only behind the copy. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden lg:block"
            style={{ backgroundImage: gradient }}
          />
          {/* Mobile/tablet: a soft fade into the navy copy panel. */}
          <div
            aria-hidden="true"
            className="from-navy absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t to-transparent lg:hidden"
          />
        </div>
      )}

      <div className="relative z-10 flex flex-1 items-center">
        <div className="container-page">
          <div
            className={cn(
              "flex max-w-xl flex-col gap-5 pt-8 pb-12 sm:pt-10 sm:pb-14 lg:max-w-140 lg:py-24",
              align === "right" && "lg:ml-auto",
              !image && "lg:py-28",
              contentClassName,
            )}
          >
            {eyebrow && <p className="eyebrow-accent">{eyebrow}</p>}
            <h1 className={size === "cinematic" ? "type-display" : "type-h1"}>
              {underlineHeading ? (
                <>
                  {headingLead}
                  <span className="accent-underline">{headingFinalWord}</span>
                </>
              ) : (
                heading
              )}
            </h1>
            {copy && (
              <p className="text-muted-foreground max-w-136 text-base leading-relaxed lg:text-[1.0625rem]">
                {copy}
              </p>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                {primaryCta && (
                  <CtaLink
                    label={primaryCta.label}
                    href={primaryCta.href}
                    external={primaryCta.external}
                    variant="primary"
                    size="lg"
                    icon="arrow"
                    trackingKey="hero_primary_click"
                    className="w-full sm:w-auto"
                  />
                )}
                {secondaryCta && (
                  <CtaLink
                    label={secondaryCta.label}
                    href={secondaryCta.href}
                    external={secondaryCta.external}
                    variant={secondaryStyle === "link" ? "link" : "secondary"}
                    size="lg"
                    icon={secondaryStyle === "link" ? "arrow" : "none"}
                    trackingKey="hero_secondary_click"
                    className={
                      secondaryStyle === "link" ? "" : "w-full sm:w-auto"
                    }
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
