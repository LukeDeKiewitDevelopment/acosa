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
                <p className="type-body">
                  Need accommodation in {node.name} now? ACOSA can help you
                  explore suitable options.
                </p>
              </div>
              {whatsappHref && (
                <CtaLink
                  label="Ask ACOSA"
                  href={whatsappHref}
                  variant="secondary"
                  icon="whatsapp"
                  external={whatsappHref.startsWith("http")}
                  trackingKey="node_ask_acosa_click"
                  className="shrink-0"
                />
              )}
            </div>
          )}
        </div>
      </Section>

      {/* ---- Business Location ---- */}
      <Section tone="warm">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <h2 className="type-h2">Working in {node.name}?</h2>
            <div className="prose prose-sm text-muted-foreground md:prose-base max-w-none [&_h1]:hidden [&_p]:mb-4 [&_p]:leading-relaxed">
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
              />
            )}
          </div>

          <div className="flex flex-col gap-10">
            {highlights.length > 0 && (
              <div className="flex flex-col gap-4">
                <p className="eyebrow">Why travellers choose {node.name}</p>
                <ul className="divide-sage border-sage flex flex-col divide-y border-y">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight.title}
                      className="flex flex-col gap-1 py-4"
                    >
                      <p className="font-heading text-foreground text-base font-semibold">
                        {highlight.title}
                      </p>
                      {highlight.detail && (
                        <p className="type-small">{highlight.detail}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {nearby.length > 0 && (
              <div className="flex flex-col gap-4">
                <p className="eyebrow">Nearby convenience</p>
                <ul className="flex flex-wrap gap-2">
                  {nearby.map((item) => {
                    const Icon = tagIcon(item.icon);
                    return (
                      <li
                        key={item.name}
                        className="bg-card text-foreground/85 border-border inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
                      >
                        <Icon
                          className="text-gold-ink size-4 shrink-0"
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
      </Section>

      {/* ---- Assistance ---- */}
      {whatsappHref && properties.length > 0 && (
        <Section spacing="tight">
          <div className="border-border flex flex-col gap-5 border-y py-10 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="type-h3">Need assistance?</h2>
              <p className="type-body">
                Tell ACOSA where you need to be and what matters for the stay.
              </p>
            </div>
            <CtaLink
              label="Need assistance? Message ACOSA"
              href={whatsappHref}
              variant="secondary"
              icon="whatsapp"
              external={whatsappHref.startsWith("http")}
              trackingKey="node_assistance_click"
              className="shrink-0"
            />
          </div>
        </Section>
      )}
    </>
  );
};
