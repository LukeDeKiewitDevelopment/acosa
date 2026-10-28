// src/components/custom/property-detail.tsx
import type { ReactNode } from "react";
import { ArrowDown, MapPin, Star } from "lucide-react";
import { tagIcon } from "@/lib/tag-icons";
import { mailtoLink, whatsappLink } from "@/lib/content";
import { propertyEnquiryWhatsappMessage } from "@/lib/property-search";
import { CtaLink } from "./cta-link";
import { ApprovedBadge } from "./property-card";
import { SaMap, type SaMapPin } from "./map-graphics";

/* Individual property profile, Creative Direction Blueprint Page 04:
   1. Photography (PropertyGallery, mounted above this by the page)
   2. Identity and suitability: name, location, ACOSA Approved, key attributes
   3. Practical proof: facilities, workspace, convenience, map
   4. Enquiry: direct property contact, clearly identified and kept
      separate from contacting ACOSA.
   ACOSA Approved is shown without a numerical score; no public scoring
   model has been approved. */
export type PropertyDetailProperty = {
  id: string;
  name: string;
  propertyTypeLabel: string;
  businessNodeLabel: string;
  provinceLabel: string;
  approved: boolean;
  shortDescription: string;
  address: string;
  mapUrl: string;
  whatsapp: string;
  phone: string;
  email: string;
  website?: string;
  /** The property's business node, pinned on the location map. */
  mapPin?: SaMapPin;
};

export type PropertyDetailTag = {
  name: string;
  icon: string;
};

export type PropertyDetailTestimonial = {
  reviewer: string;
  review: string;
  rating: number;
};

export type PropertyDetailProps = {
  property: PropertyDetailProperty;
  essentials: PropertyDetailTag[];
  perfectFor: PropertyDetailTag[];
  facilities: PropertyDetailTag[];
  nearby: PropertyDetailTag[];
  testimonials: PropertyDetailTestimonial[];
  children?: ReactNode;
};

const DetailBlock = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="border-border grid gap-5 border-t pt-8 md:grid-cols-[11rem_1fr] md:gap-10">
    <h2 className="type-h3">{title}</h2>
    <div className="min-w-0">{children}</div>
  </section>
);

const Chip = ({ tag }: { tag: PropertyDetailTag }) => {
  const Icon = tagIcon(tag.icon);
  return (
    <li className="bg-card text-foreground/85 border-border inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
      <Icon className="text-gold-ink size-4 shrink-0" aria-hidden="true" />
      {tag.name}
    </li>
  );
};

export const PropertyDetail = ({
  property,
  essentials,
  perfectFor,
  facilities,
  nearby,
  testimonials,
  children,
}: PropertyDetailProps) => {
  const location = [property.businessNodeLabel, property.provinceLabel]
    .filter(Boolean)
    .join(", ");
  const whatsappHref = property.whatsapp
    ? whatsappLink(
        property.whatsapp,
        propertyEnquiryWhatsappMessage(property.name),
      )
    : "";
  const emailHref = property.email
    ? mailtoLink(property.email, `Enquiry via ACOSA: ${property.name}`)
    : "";
  const tracking = { propertyId: property.id, propertyName: property.name };

  return (
    <div
      data-slot="property-detail"
      data-property-page="true"
      data-property-id={property.id}
      data-property-name={property.name}
      className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16"
    >
      {/* ==================== main column ==================== */}
      <div className="flex flex-col gap-10">
        {/* ---- 2. Identity and suitability ---- */}
        <header className="flex flex-col gap-5">
          <p className="eyebrow">{property.propertyTypeLabel}</p>
          <h1 className="type-h1">{property.name}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {location && (
              <p className="text-foreground/85 inline-flex items-center gap-1.5 text-[0.9375rem]">
                <MapPin className="size-4" aria-hidden="true" />
                {location}
              </p>
            )}
            {property.approved && (
              <ApprovedBadge href="/why-acosa#acosa-approved" />
            )}
          </div>
          {property.shortDescription && (
            <p className="type-lead max-w-2xl">{property.shortDescription}</p>
          )}
          <a
            href="#enquire"
            className="text-foreground inline-flex w-fit items-center gap-2 text-sm font-semibold no-underline lg:hidden"
          >
            <span className="decoration-gold underline decoration-2 underline-offset-[6px]">
              Enquire directly with the property
            </span>
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </header>

        {/* ---- Key business attributes ---- */}
        {essentials.length > 0 && (
          <ul
            aria-label="Business traveller essentials"
            className="bg-card border-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-3"
          >
            {essentials.map((tag) => {
              const Icon = tagIcon(tag.icon);
              return (
                <li
                  key={tag.name}
                  className="outline-border text-foreground flex items-center gap-3 px-4 py-4 text-sm font-medium outline-1"
                >
                  <Icon
                    className="text-gold-ink size-5 shrink-0"
                    aria-hidden="true"
                  />
                  {tag.name}
                </li>
              );
            })}
          </ul>
        )}

        {/* ---- About ---- */}
        <DetailBlock title="About this property">
          <div className="prose prose-sm text-muted-foreground md:prose-base max-w-none [&_p]:mb-4 [&_p]:text-[0.9375rem] [&_p]:leading-relaxed">
            {children}
          </div>
        </DetailBlock>

        {/* ---- 3. Practical proof ---- */}
        {facilities.length > 0 && (
          <DetailBlock title="Facilities">
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {facilities.map((tag) => {
                const Icon = tagIcon(tag.icon);
                return (
                  <li
                    key={tag.name}
                    className="text-foreground/90 flex items-center gap-3 text-[0.9375rem]"
                  >
                    <Icon
                      className="text-gold-ink size-5 shrink-0"
                      aria-hidden="true"
                    />
                    {tag.name}
                  </li>
                );
              })}
            </ul>
          </DetailBlock>
        )}

        {perfectFor.length > 0 && (
          <DetailBlock title="Perfect for">
            <ul className="flex flex-wrap gap-2">
              {perfectFor.map((tag) => (
                <Chip key={tag.name} tag={tag} />
              ))}
            </ul>
          </DetailBlock>
        )}

        {nearby.length > 0 && (
          <DetailBlock title="Nearby convenience">
            <ul className="flex flex-wrap gap-2">
              {nearby.map((tag) => (
                <Chip key={tag.name} tag={tag} />
              ))}
            </ul>
          </DetailBlock>
        )}

        {(property.address || property.mapUrl) && (
          <DetailBlock title="Location">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              {property.mapPin && (
                <figure className="surface-warm border-border order-last w-full max-w-56 shrink-0 rounded-xl border p-3 sm:order-none">
                  <SaMap pins={[property.mapPin]} className="text-navy" />
                  {property.mapPin.label && (
                    <figcaption className="text-muted-foreground mt-1 text-center text-xs">
                      {property.mapPin.label}, South Africa
                    </figcaption>
                  )}
                </figure>
              )}
              <div className="flex flex-col gap-4 sm:order-first">
                {property.address && (
                  <p className="text-foreground/90 flex items-start gap-2 text-[0.9375rem]">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {property.address}
                  </p>
                )}
                {property.mapUrl && (
                  <CtaLink
                    label="View on Google Maps"
                    href={property.mapUrl}
                    variant="link"
                    icon="external"
                    external
                    trackingKey="property_maps_click"
                    {...tracking}
                  />
                )}
              </div>
            </div>
          </DetailBlock>
        )}

        {testimonials.length > 0 && (
          <DetailBlock title="Guest reviews">
            <div className="flex flex-col gap-4">
              {testimonials.map((testimonial, index) => (
                <figure
                  key={`${testimonial.reviewer}-${index}`}
                  className="bg-card border-border flex flex-col gap-3 rounded-xl border p-6"
                >
                  {testimonial.rating > 0 && (
                    <span
                      className="text-gold flex items-center gap-0.5"
                      role="img"
                      aria-label={`Rated ${testimonial.rating} out of 5`}
                    >
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-current"
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                  )}
                  <blockquote className="text-foreground/90 text-[0.9375rem] leading-relaxed">
                    {testimonial.review}
                  </blockquote>
                  <figcaption className="text-muted-foreground text-sm font-semibold">
                    {testimonial.reviewer}
                  </figcaption>
                </figure>
              ))}
            </div>
          </DetailBlock>
        )}
      </div>

      {/* ==================== 4. Enquiry ==================== */}
      <aside
        id="enquire"
        className="flex h-fit flex-col gap-4 lg:sticky lg:top-24"
      >
        <div className="bg-card border-border flex flex-col gap-6 rounded-xl border p-6 shadow-[0_24px_50px_-34px_rgb(5_10_60/0.45)] md:p-7">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Direct enquiry</p>
            <h2 className="type-h3">Enquire with {property.name}</h2>
            <p className="type-small">
              Your enquiry goes directly to the property, not to ACOSA.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {emailHref && (
              <CtaLink
                label="Email the property"
                href={emailHref}
                variant="primary"
                icon="email"
                trackingKey="property_email_click"
                className="w-full"
                {...tracking}
              />
            )}
            {whatsappHref && (
              <CtaLink
                label="WhatsApp the property"
                href={whatsappHref}
                variant={emailHref ? "secondary" : "primary"}
                icon="whatsapp"
                external
                trackingKey="property_whatsapp_click"
                className="w-full"
                {...tracking}
              />
            )}
            {property.phone && (
              <CtaLink
                label={`Call ${property.phone}`}
                href={`tel:${property.phone.replace(/\s/g, "")}`}
                variant="secondary"
                icon="phone"
                trackingKey="property_phone_click"
                className="w-full"
                {...tracking}
              />
            )}
          </div>
          {property.website && (
            <CtaLink
              label="Visit the property website"
              href={property.website}
              variant="link"
              icon="external"
              external
              trackingKey="property_website_click"
              {...tracking}
            />
          )}
        </div>

        {/* Contacting ACOSA, kept visually separate from the property. */}
        <div className="border-border flex flex-col gap-2 rounded-xl border border-dashed p-5">
          <p className="text-foreground text-sm font-semibold">
            Not sure this is the right fit?
          </p>
          <p className="type-small">
            ACOSA can help you compare suitable options.
          </p>
          <CtaLink
            label="Ask ACOSA"
            href="/contact"
            variant="link"
            trackingKey="property_ask_acosa_click"
            className="mt-1 text-sm"
            {...tracking}
          />
        </div>
      </aside>
    </div>
  );
};
