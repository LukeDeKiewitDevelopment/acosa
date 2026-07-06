import type { ImageMetadata, ImageOutputFormat } from "astro";
import { getImage } from "astro:assets";

export const optimizeImage = async (
  image: ImageMetadata,
  format: ImageOutputFormat,
  width: number,
) => {
  if (!image) {
    throw new Error("No image provided for optimization.");
  }

  const optimizedImage = await getImage({
    src: image,
    format: format,
    width: width,
    widths: [
      width / 5,
      width / 4,
      width / 3,
      width / 2,
      width,
      width * 1.25,
      width * 1.5,
    ],
  });

  return optimizedImage;
};

export const optimizeImages = async (
  images: ImageMetadata[],
  format: ImageOutputFormat,
  width: number,
) => {
  if (images.length === 0) {
    console.warn("Empty array provided for image optimization.");
    return [];
  }

  const optimizedImages = await Promise.all(
    images.map((image) =>
      getImage({
        src: image,
        format: format,
        width: width,
        widths: [
          width / 5,
          width / 4,
          width / 3,
          width / 2,
          width,
          width * 1.25,
          width * 1.5,
        ],
      }),
    ),
  );
  return optimizedImages;
};
