import { getImage } from "astro:assets";
import { cn } from "@/lib/utils";
import type { ImageMetadata, ImageOutputFormat } from "astro";
import type { ComponentPropsWithoutRef } from "react";

export type AcosaImageProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "srcSet" | "width" | "height"
> & {
  src: ImageMetadata;
  width?: number;
  height?: number;
  widths?: number[];
  sizes?: string;
  format?: ImageOutputFormat;
};

const DEFAULT_WIDTHS = [400, 800, 1200, 1600, 1920];

export const AcosaImage = async ({
  src,
  alt,
  width,
  height,
  widths,
  sizes,
  format,
  loading,
  decoding,
  fetchPriority,
  className,
}: AcosaImageProps) => {
  const image = await getImage({
    src,
    width,
    height,
    format,
    widths: widths || DEFAULT_WIDTHS,
    sizes: sizes || "100vw",
  });

  return (
    <img
      src={image.src}
      alt={alt || ""}
      width={image.attributes.width}
      height={image.attributes.height}
      srcSet={image.srcSet.attribute || undefined}
      sizes={image.attributes.sizes}
      loading={loading || "lazy"}
      decoding={decoding || "sync"}
      fetchPriority={fetchPriority || "auto"}
      className={cn(
        "text-muted-foreground pointer-events-none flex h-auto max-w-full items-center justify-center text-xs italic select-none",
        className,
      )}
    />
  );
};

/**
 * Pre-resolved image data (the output of `getImage()`), for use where an
 * image must be passed into a `client:*` hydrated tree. `AcosaImage` is an
 * async component and can only run on the server — resolve it there with
 * `getImage()` and render the result through `StaticAcosaImage` instead,
 * which is a plain synchronous component safe to hydrate on the client.
 */
export type ResolvedAcosaImage = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

export type StaticAcosaImageProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "srcSet" | "width" | "height"
> &
  ResolvedAcosaImage;

export const StaticAcosaImage = ({
  src,
  srcSet,
  sizes,
  width,
  height,
  alt,
  loading,
  decoding,
  fetchPriority,
  className,
}: StaticAcosaImageProps) => {
  return (
    <img
      src={src}
      alt={alt || ""}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={sizes}
      loading={loading || "lazy"}
      decoding={decoding || "sync"}
      fetchPriority={fetchPriority || "auto"}
      className={cn(
        "text-muted-foreground pointer-events-none flex h-auto max-w-full items-center justify-center text-xs italic select-none",
        className,
      )}
    />
  );
};
