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
        "pointer-events-none block h-auto max-w-full select-none",
        className,
      )}
    />
  );
};
