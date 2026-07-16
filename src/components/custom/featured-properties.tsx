// src/components/custom/featured-properties.tsx
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";

export type FeaturedPropertyItem = {
  id: string;
  name: string;
  propertyTypeLabel: string;
  approved: boolean;
  shortDescription: string;
  image: ResolvedAcosaImage;
  imageAlt: string;
};

export const FeaturedProperties = ({
  items,
}: {
  items: FeaturedPropertyItem[];
}) => {
  if (items.length === 0) return null;

  return (
    <div data-slot="featured-properties" className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-primary text-xl font-bold md:text-2xl lg:text-3xl">
            Featured Properties
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Handpicked for business travellers across key South African nodes
          </p>
        </div>
        <a
          href="/business-nodes"
          className="bg-secondary text-secondary-foreground inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
        >
          View All Nodes <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>

      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item) => (
          <li key={item.id}>
            <article className="bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
              <div className="relative m-3 aspect-[16/11] overflow-hidden rounded-xl">
                <StaticAcosaImage
                  {...item.image}
                  alt={item.imageAlt}
                  className="h-full w-full object-cover"
                />
                <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase">
                  {item.propertyTypeLabel}
                </span>
                {item.approved && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase backdrop-blur">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Acosa Approved™
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4 pt-1">
                <h3 className="text-primary text-lg font-bold">
                  <a
                    href={`/properties/${item.id}`}
                    className="after:absolute after:inset-0"
                  >
                    {item.name}
                  </a>
                </h3>
                <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
                  <MapPin
                    className="text-secondary mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="line-clamp-2">{item.shortDescription}</span>
                </p>
                <span className="border-secondary text-secondary mt-auto inline-flex items-center justify-between rounded-full border px-5 py-2.5 text-sm font-medium">
                  View Details <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};
