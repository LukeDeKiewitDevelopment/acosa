// src/components/custom/node-detail.tsx
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";
import type { FeaturedPropertyItem } from "./featured-properties";

/* Business node detail intentionally has only the four public sections in the
   copy master: Hero, Business Location, Properties, and Assistance. */
export type NodeDetailNode = {
  id: string;
  name: string;
  city: string;
  province: string;
  provinceLabel: string;
  mapUrl: string;
  image: ResolvedAcosaImage;
  imageAlt: string;
};

export type NodeDetailHighlight = {
  title: string;
  detail: string;
};

export type NodeDetailProps = {
  node: NodeDetailNode;
  properties: FeaturedPropertyItem[];
  highlights: NodeDetailHighlight[];
  nearby: string[];
  whatsappHref: string;
  children?: ReactNode;
};

export const NodeDetail = ({
  node,
  properties,
  highlights,
  nearby,
  whatsappHref,
  children,
}: NodeDetailProps) => {
  return (
    <div data-slot="node-detail" className="flex flex-col gap-12">
      {/* ---- Hero ---- */}
      <div className="relative overflow-hidden rounded-3xl">
        <StaticAcosaImage
          {...node.image}
          alt={node.imageAlt}
          className="h-64 w-full object-cover object-[65%_center] md:h-80 md:object-center lg:h-96"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-white md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Business accommodation in
          </p>
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
            {node.name}
          </h1>
          <a href="#properties" className="mt-3 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black no-underline">
            View Accommodation
          </a>
        </div>
      </div>

      {/* ---- Business Location ---- */}
      <div className="flex flex-col gap-4">
        <h2 className="text-primary text-xl font-bold md:text-2xl">
          Working in {node.name}?
        </h2>
        <div className="prose prose-sm text-muted-foreground md:prose-base max-w-none">
          {children}
        </div>
      </div>

      {/* ---- Properties ---- */}
      <div id="properties" className="flex flex-col gap-6">
        <h2 className="text-primary text-xl font-bold md:text-2xl">
          Find your stay in {node.name}.
        </h2>
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {properties.map((item) => (
            <li key={item.id}>
              <article className="bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
                <div className="relative m-3 aspect-[16/11] overflow-hidden rounded-xl">
                  <StaticAcosaImage
                    {...item.image}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center">
                    <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase">
                      {item.propertyTypeLabel}
                    </span>
                    {item.approved && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase backdrop-blur">
                        <BadgeCheck className="size-3.5" aria-hidden="true" />
                        Acosa Approved™
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4 pt-1">
                  <h3 className="text-primary text-lg font-bold">
                    <a
                      href={`/properties/${item.id}`}
                      className="after:absolute after:inset-0 no-underline"
                    >
                      {item.name}
                    </a>
                  </h3>
                  {item.shortDescription && (
                    <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
                      <MapPin
                        className="text-secondary mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="line-clamp-2">
                        {item.shortDescription}
                      </span>
                    </p>
                  )}
                  <span className="border-secondary text-secondary mt-auto inline-flex items-center justify-between rounded-full border px-5 py-2.5 text-sm font-medium">
                    View Details{" "}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- Assistance ---- */}
      <div className="flex flex-col gap-4">
        <h2 className="text-primary text-xl font-bold md:text-2xl">
          Have a specific requirement?
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          If you're arranging a longer stay, placing a team or need something specific from your accommodation, contact ACOSA and we'll help where possible.
        </p>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground inline-flex w-fit rounded-full px-5 py-2.5 text-sm font-medium no-underline">
          WhatsApp ACOSA
        </a>
      </div>
    </div>
  );
};
