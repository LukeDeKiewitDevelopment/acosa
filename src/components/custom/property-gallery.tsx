// src/components/custom/property-gallery.tsx
// CLIENT ISLAND — mount with a client: directive (Embla + dialog need JS).
import { useEffect, useState } from "react";
import { Images } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";

/* Property photography leads the profile (Creative Direction Blueprint,
   Page 04). Desktop: a generous mosaic with the hero image first.
   Mobile: a swipeable carousel. Either opens a full-size viewer.
   Slides = heroImage first, then gallery[] in order. */
export type PropertyGallerySlide = {
  image: ResolvedAcosaImage;
  alt: string;
};

export type PropertyGalleryProps = {
  slides: PropertyGallerySlide[];
  propertyName?: string;
};

const SlideCarousel = ({
  slides,
  startIndex = 0,
  fit = "cover",
  className,
}: {
  slides: PropertyGallerySlide[];
  startIndex?: number;
  fit?: "cover" | "contain";
  className?: string;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(startIndex + 1);

  useEffect(() => {
    if (!api) return;
    api.scrollTo(startIndex, true);
    setCurrent(api.selectedScrollSnap() + 1);
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, startIndex]);

  return (
    <div className={cn("relative", className)}>
      <Carousel
        setApi={setApi}
        opts={{ startIndex, loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.image.src} className="basis-full">
              <div
                className={cn(
                  "bg-muted relative aspect-4/3 overflow-hidden rounded-xl",
                  fit === "contain" && "bg-navy aspect-3/2",
                )}
              >
                <StaticAcosaImage
                  {...slide.image}
                  alt={slide.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  className={cn(
                    "absolute inset-0 h-full w-full max-w-none",
                    fit === "cover" ? "object-cover" : "object-contain",
                  )}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {slides.length > 1 && (
          <>
            <CarouselPrevious className="bg-card/95 left-3 border-0 shadow-md" />
            <CarouselNext className="bg-card/95 right-3 border-0 shadow-md" />
          </>
        )}
      </Carousel>
      <p
        aria-live="polite"
        className="bg-navy/80 absolute right-3 bottom-3 rounded-md px-2.5 py-1 text-xs font-medium text-white"
      >
        {current} / {slides.length}
      </p>
    </div>
  );
};

export const PropertyGallery = ({
  slides,
  propertyName,
}: PropertyGalleryProps) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  if (slides.length === 0) return null;

  // 5-up (hero + 4) or 3-up (hero + 2) mosaics keep the grid complete.
  const mosaicSize =
    slides.length >= 5 ? 5 : slides.length >= 3 ? 3 : slides.length;
  const mosaic = slides.slice(0, mosaicSize);
  const open = (index: number) => setViewerIndex(index);

  return (
    <div data-slot="property-gallery">
      {/* Mobile and tablet: swipe through every photo. */}
      <SlideCarousel slides={slides} className="lg:hidden" />

      {/* Desktop: hero image plus up to four supporting photographs. */}
      <div className="relative hidden lg:block">
        <div
          className={cn(
            "grid h-136 gap-2",
            mosaic.length >= 5
              ? "grid-cols-4 grid-rows-2"
              : mosaic.length === 3
                ? "grid-cols-3 grid-rows-2"
                : mosaic.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-1",
          )}
        >
          {mosaic.map((slide, index) => (
            <button
              key={slide.image.src}
              type="button"
              onClick={() => open(index)}
              className={cn(
                "group bg-muted focus-visible:ring-ring relative overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                index === 0 && mosaic.length >= 3 && "col-span-2 row-span-2",
                index === 0 && "rounded-l-xl",
                mosaic.length === 1 && "rounded-xl",
                // Round the outer corners of the mosaic only.
                mosaic.length >= 5 && index === 2 && "rounded-tr-xl",
                mosaic.length >= 5 && index === 4 && "rounded-br-xl",
                mosaic.length === 3 && index === 1 && "rounded-tr-xl",
                mosaic.length === 3 && index === 2 && "rounded-br-xl",
                mosaic.length === 2 && index === 1 && "rounded-r-xl",
              )}
              aria-label={`View photo ${index + 1} of ${slides.length}: ${slide.alt}`}
            >
              <StaticAcosaImage
                {...slide.image}
                alt=""
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="absolute inset-0 h-full w-full max-w-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
        {slides.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => open(0)}
            className="bg-card text-navy hover:bg-card absolute right-4 bottom-4 border-transparent shadow-md"
          >
            <Images aria-hidden="true" />
            View all {slides.length} photos
          </Button>
        )}
      </div>

      <Dialog
        open={viewerIndex !== null}
        onOpenChange={(isOpen) => !isOpen && setViewerIndex(null)}
      >
        <DialogContent className="max-w-[calc(100%-1.5rem)] gap-4 rounded-xl p-3 sm:max-w-5xl sm:p-4">
          <DialogTitle className="sr-only">
            {propertyName
              ? `${propertyName} photographs`
              : "Property photographs"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Use the arrow buttons to move between photographs.
          </DialogDescription>
          {viewerIndex !== null && (
            <SlideCarousel
              slides={slides}
              startIndex={viewerIndex}
              fit="contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
