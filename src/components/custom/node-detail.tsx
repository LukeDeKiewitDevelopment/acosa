// src/components/custom/node-detail.tsx
import type { ReactNode } from "react";
import { PropertyGrid, type PropertyCardItem } from "./property-card";
import { CtaLink } from "./cta-link";
import { SectionHeader } from "./section-header";
import { Section } from "./section";
import { tagIcon, type IconTag } from "@/lib/tag-icons";

/* Business node detail. The page renders the hero; this covers the three
   public sections from the copy master that follow it: Properties,
   Business Location and Assistance. Exploring a node leads to its
   available properties first. */
export type NodeDetailNode = {
  id: string;
  name: string;
  city: string;
  province: string;
  provinceLabel: string;
  mapUrl: string;
  workingSectionBackground: string;
};

export type NodeDetailHighlight = {
  title: string;
  detail: string;
};

export type NodeDetailProps = {
  node: NodeDetailNode;
  properties: PropertyCardItem[];
  highlights: NodeDetailHighlight[];
  nearby: IconTag[];
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
    <>
      {/* ---- Properties ---- */}
      <Section id="properties">
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow={`${node.name}, ${node.provinceLabel}`}
            title={`Find your stay in ${node.name}.`}
          />
          {properties.length > 0 ? (
            <PropertyGrid items={properties} />
          ) : (
            <div className="surface-warm border-border flex flex-col items-start gap-5 rounded-xl border p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="flex flex-col gap-2">
                <p className="type-h3">
                  Our first ACOSA properties are coming soon.
                </p>
                <p className="type-lead">
                  Need accommodation in {node.name} now? ACOSA can help you
                  explore suitable options.
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ---- Business Location ---- */}
      <Section id="location" tone="navy" className="isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${node.workingSectionBackground}")` }}
        />
        <div
          aria-hidden="true"
          className="from-navy/95 via-navy/90 to-navy/75 absolute inset-0 z-[1] bg-linear-to-r"
        />
        <div className="relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <div className="flex flex-col gap-6">
              <h2 className="type-h2 text-white">Working in {node.name}?</h2>
              <div className="prose [&_h2]:font-heading [&_h3]:font-heading max-w-none text-base leading-relaxed text-white/85 md:text-lg [&_h1]:hidden [&_h2]:text-xl [&_h2]:text-white [&_h3]:text-lg [&_h3]:text-white [&_p]:mb-4 [&_p]:text-base [&_p]:leading-relaxed md:[&_p]:text-lg [&_strong]:text-white">
                {children}
              </div>
              {node.mapUrl && (
                <CtaLink
                  label="View on Google Maps"
                  href={node.mapUrl}
                  variant="link"
                  icon="external"
                  external
                  trackingKey="business_node_maps_click"
                  className="text-white"
                />
              )}
            </div>

            <div className="flex flex-col gap-10">
              {highlights.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="eyebrow-accent">
                    Why travellers choose {node.name}
                  </p>
                  <ul className="divide-gold/50 border-gold/50 flex flex-col divide-y border-y">
                    {highlights.map((highlight) => (
                      <li
                        key={highlight.title}
                        className="flex flex-col gap-1 py-4"
                      >
                        <p className="font-heading text-base font-semibold text-white">
                          {highlight.title}
                        </p>
                        {highlight.detail && (
                          <p className="type-small text-white/85">
                            {highlight.detail}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {nearby.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="eyebrow-accent">Nearby convenience</p>
                  <ul className="flex flex-wrap gap-2">
                    {nearby.map((item) => {
                      const Icon = tagIcon(item.icon);
                      return (
                        <li
                          key={item.name}
                          className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white"
                        >
                          <Icon
                            className="text-gold size-4 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="border-gold mt-10 grid gap-6 border-t-2 pt-8 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
            <div className="flex max-w-2xl flex-col gap-2">
              <h2 className="type-h3 text-white">Need assistance?</h2>
              <p className="type-lead text-white/85">
                Tell ACOSA where you need to be and what matters for your stay.
              </p>
            </div>
            {whatsappHref && (
              <CtaLink
                label="Message ACOSA"
                href={whatsappHref}
                variant="secondary"
                icon="whatsapp"
                external={whatsappHref.startsWith("http")}
                trackingKey="node_assistance_click"
                className="shrink-0"
              />
            )}
          </div>
        </div>
      </Section>
    </>
  );
};
