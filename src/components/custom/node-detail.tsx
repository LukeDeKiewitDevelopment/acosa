// src/components/custom/node-detail.tsx
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, ExternalLink, MapPin } from "lucide-react";
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
        {node.mapUrl && (
          <a
            href={node.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-secondary text-secondary inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium no-underline"
            data-acosa-track="business_node_maps_click"
            data-node-id={node.id}
            data-node-name={node.name}
          >
            <MapPin className="size-4" aria-hidden="true" />
            View on Google Maps
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* ---- Properties ---- */}
      <div id="properties" className="flex flex-col gap-6">
        <h2 className="text-primary text-xl font-bold md:text-2xl">
          Find your stay in {node.name}.
        </h2>
        {properties.length === 0 && (
          <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center">
            <p>Our first ACOSA properties are coming soon.</p>
          </div>
        )}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((item) => (
            <li key={item.id}>
              <article className="bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
                <div className="relative m-3 aspect-16/11 overflow-hidden rounded-xl">
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
                        ACOSA Approved
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

      {/* ---- Assistance: highlight cards + nearby convenience + WhatsApp CTA ---- */}
      {(highlights.length > 0 || nearby.length > 0 || whatsappHref) && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-4">
            {highlights.length > 0 && (
              <>
                <h2 className="text-primary text-xl font-bold md:text-2xl">
                  Why travellers choose {node.name}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {highlights.map((highlight) => (
                    <div key={highlight.title} className="bg-card rounded-2xl border p-4">
                      <p className="text-primary text-sm font-semibold">{highlight.title}</p>
                      {highlight.detail && (
                        <p className="text-muted-foreground mt-1 text-sm">{highlight.detail}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
            {nearby.length > 0 && (
              <>
                <h3 className="text-primary text-lg font-bold">Nearby convenience</h3>
                <div className="flex flex-wrap gap-2">
                  {nearby.map((item) => (
                    <span
                      key={item}
                      className="bg-muted text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground no-underline"
              >
                <BadgeCheck className="size-4" aria-hidden="true" />
                Need assistance? Message ACOSA
              </a>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
