// src/components/custom/property-gallery.tsx
// CLIENT ISLAND — mount with a client: directive (Embla needs JS).
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";

/* The PROPERTY PAGE Gallery per ACOSA_BRIEF.
   Slides = heroImage first, then gallery[] (image + alt fields) — the
   page resolves them via getImage() and passes ResolvedAcosaImage data.
   Full-width: each CarouselItem is basis-full so every image is 100%
   of the carousel width. Counter = "current/total" via CarouselApi. */
export type PropertyGallerySlide = {
  image: ResolvedAcosaImage;
  alt: string;
};

export type PropertyGalleryProps = {
  slides: PropertyGallerySlide[];
};

export const PropertyGallery = ({ slides }: PropertyGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(slides.length);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (slides.length === 0) return null;

  return (
    <div data-slot="property-gallery" className="flex flex-col gap-3">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.image.src} className="basis-full">
              <div className="overflow-hidden rounded-2xl">
                <StaticAcosaImage
                  {...slide.image}
                  alt={slide.alt}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
      {/* counter under the carousel, e.g. 1/18 */}
      <p
        aria-live="polite"
        className="text-muted-foreground text-center text-sm font-medium"
      >
        {current}/{count}
      </p>
    </div>
  );
};
