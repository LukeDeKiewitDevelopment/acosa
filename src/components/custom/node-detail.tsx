// src/components/custom/node-detail.tsx
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, ExternalLink, MapPin } from "lucide-react";
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";
import type { FeaturedPropertyItem } from "./featured-properties";

/* BUSINESS NODE DETAIL per ACOSA_BRIEF: Hero, Node Description, Map,
   Property Grid, Business Information, Nearby Convenience (page-level
   CTA/footer live in the .astro page).
   Data sources per section:
   - Hero: heroImage/imageAlt, name, city, province (label)
   - Description: node markdoc body — rendered by the page via <Content />,
     passed in as children
   - Map: mapUrl (Google share link) → external link card; omitted when empty
   - Property Grid: properties where businessNode.id === node.id, reusing
     the FeaturedProperties card language
   - Business Information: businessHighlights (title + detail, full detail
     shown here unlike homepage chips)
   - Nearby Convenience: DERIVED — union of this node's properties'
     nearbyConvenience tags (no node-level field exists) */
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
  children?: ReactNode;
};

export const NodeDetail = ({
  node,
  properties,
  highlights,
  nearby,
  children,
}: NodeDetailProps) => {
  return (
    <div data-slot="node-detail" className="flex flex-col gap-12">
      {/* ---- Hero ---- */}
      <div className="relative overflow-hidden rounded-3xl">
        <StaticAcosaImage
          {...node.image}
          alt={node.imageAlt}
          className="h-64 w-full object-cover md:h-80 lg:h-96"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-white md:p-8">
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
            {node.name}
          </h1>
          {/* city + province label */}
          <p className="flex items-center gap-1.5 text-sm text-white/80 md:text-base">
            <MapPin className="size-4" aria-hidden="true" />
            {node.city
              ? `${node.city}, ${node.provinceLabel}`
              : node.provinceLabel}
          </p>
        </div>
      </div>

      {/* ---- Node Description (markdoc children) + Map ---- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="prose prose-sm text-muted-foreground md:prose-base max-w-none">
          {children}
        </div>
        {node.mapUrl && (
          <a
            href={node.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card text-card-foreground flex h-fit items-center justify-between gap-3 rounded-xl border p-4 text-sm font-medium no-underline shadow-sm"
          >
            <span className="flex items-center gap-2">
              <MapPin className="text-secondary size-5" aria-hidden="true" />
              View {node.name} on Google Maps
            </span>
            <ExternalLink
              className="text-muted-foreground size-4"
              aria-hidden="true"
            />
          </a>
        )}
      </div>

      {/* ---- Property Grid — FeaturedProperties card language ---- */}
      <div className="flex flex-col gap-6">
        <h2 className="text-primary text-xl font-bold md:text-2xl">
          Stays in {node.name}
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

      {/* ---- Business Information: businessHighlights, full detail ---- */}
      {highlights.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-primary text-xl font-bold md:text-2xl">
            Business Information
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="bg-card text-card-foreground flex flex-col gap-1 rounded-xl border p-4 shadow-sm"
              >
                <dt className="text-primary text-sm font-semibold">
                  {highlight.title}
                </dt>
                {highlight.detail && (
                  <dd className="text-muted-foreground text-sm">
                    {highlight.detail}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* ---- Nearby Convenience: DERIVED from this node's properties ---- */}
      {nearby.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-primary text-xl font-bold md:text-2xl">
            Nearby Convenience
          </h2>
          <ul role="list" className="flex flex-wrap gap-2">
            {nearby.map((name) => (
              <li
                key={name}
                className="bg-muted text-muted-foreground rounded-full px-3 py-1.5 text-sm"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
