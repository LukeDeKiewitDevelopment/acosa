// src/components/custom/property-detail.tsx
import type { ReactNode } from "react";
import {
  BadgeCheck,
  CircleCheck,
  ExternalLink,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { resolveIcon } from "@/lib/lucide";

/* PROPERTY PAGE per ACOSA_BRIEF: Property Overview, Business Traveller
   Essentials™, Acosa Approved™, Facilities, Nearby Convenience, Map,
   Testimonials, plus the mock's enquiry sidebar.
   (Gallery is the separate PropertyGallery island, mounted above this
   in the page. CTA/footer are page-level.)
   Data per section:
   - Overview: name, propertyType (label), acosaApproved (approved +
     score; score shown only when > 0), shortDescription,
     longDescription (markdoc — page renders <Content /> as children)
   - Essentials™: essentials tags (name + lucide icon, resolveIcon w/
     CircleCheck fallback)
   - Perfect For: perfectFor tag names
   - Facilities: facilities tag names (check icons per the mock)
   - Nearby Convenience: nearbyConvenience tag names
   - Map: location.address + location.mapUrl → external link card,
     each omitted when empty
   - Testimonials: published testimonials where property === this id,
     with per-review star rating (rating 0 = hidden); no aggregate UI
   - Sidebar: contact.whatsapp (required; wa.me link), contact.phone
     (omitted when empty), contact.email. "Send Enquiry" targets the
     contact page until an enquiry form exists. */
export type PropertyDetailProperty = {
  name: string;
  propertyTypeLabel: string;
  approved: boolean;
  score: number;
  shortDescription: string;
  address: string;
  mapUrl: string;
  whatsapp: string;
  phone: string;
  email: string;
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
  perfectFor: string[];
  facilities: string[];
  nearby: string[];
  testimonials: PropertyDetailTestimonial[];
  children?: ReactNode;
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
  return (
    <div
      data-slot="property-detail"
      className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]"
    >
      {/* ==================== main column ==================== */}
      <div className="flex flex-col gap-10">
        {/* ---- Overview header ---- */}
        <div className="flex flex-col gap-4">
          <h1 className="text-primary text-2xl font-bold md:text-3xl">
            {property.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {/* propertyType label */}
            <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase">
              {property.propertyTypeLabel}
            </span>
            {/* acosaApproved: approved + score — omit both when false */}
            {property.approved && (
              <span className="border-secondary text-secondary inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Acosa Approved™
                {property.score > 0 && ` ${property.score}%`}
              </span>
            )}
            {/* shortDescription */}
            {property.shortDescription && (
              <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                <MapPin
                  className="text-secondary size-4"
                  aria-hidden="true"
                />
                {property.shortDescription}
              </span>
            )}
          </div>
        </div>

        {/* ---- Business Traveller Essentials™: tag name + icon ---- */}
        {essentials.length > 0 && (
          <ul
            role="list"
            className="border-y-border grid grid-cols-2 gap-4 border-y py-5 sm:grid-cols-4"
          >
            {essentials.map((tag) => {
              const Icon = resolveIcon(tag.icon, CircleCheck);
              return (
                <li
                  key={tag.name}
                  className="text-muted-foreground flex flex-col items-center gap-1.5 text-center text-xs font-medium"
                >
                  <Icon className="text-primary size-5" aria-hidden="true" />
                  {tag.name}
                </li>
              );
            })}
          </ul>
        )}

        {/* ---- About: longDescription markdoc children ---- */}
        <div className="flex flex-col gap-3">
          <h2 className="text-primary text-xl font-bold">
            About This Property
          </h2>
          <div className="prose prose-sm text-muted-foreground max-w-none md:prose-base">
            {children}
          </div>
        </div>

        {/* ---- Perfect For: tag names ---- */}
        {perfectFor.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-primary text-xl font-bold">Perfect For</h2>
            <ul role="list" className="flex flex-wrap gap-2">
              {perfectFor.map((name) => (
                <li
                  key={name}
                  className="bg-card text-card-foreground rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide uppercase"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---- Facilities: tag names, check icons ---- */}
        {facilities.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-primary text-xl font-bold">Facilities</h2>
            <ul
              role="list"
              className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
            >
              {facilities.map((name) => (
                <li
                  key={name}
                  className="text-muted-foreground flex items-center gap-2 text-sm"
                >
                  <CircleCheck
                    className="text-secondary size-4.5 shrink-0"
                    aria-hidden="true"
                  />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---- Nearby Convenience: tag names ---- */}
        {nearby.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-primary text-xl font-bold">
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

        {/* ---- Location: address + mapUrl link card ---- */}
        <div className="flex flex-col gap-3">
          <h2 className="text-primary text-xl font-bold">Location</h2>
          {property.address && (
            <p className="text-muted-foreground text-sm">{property.address}</p>
          )}
          {property.mapUrl && (
            <a
              href={property.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card text-card-foreground flex w-fit items-center gap-2 rounded-xl border p-4 text-sm font-medium shadow-sm"
            >
              <MapPin className="text-secondary size-5" aria-hidden="true" />
              View on Google Maps
              <ExternalLink
                className="text-muted-foreground size-4"
                aria-hidden="true"
              />
            </a>
          )}
        </div>

        {/* ---- Testimonials: property-linked, published ---- */}
        {testimonials.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-primary text-xl font-bold">Reviews</h2>
            {testimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.reviewer}-${index}`}
                className="bg-card text-card-foreground flex flex-col gap-3 rounded-2xl border p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* reviewer */}
                  <h3 className="text-primary text-sm font-semibold">
                    {testimonial.reviewer}
                  </h3>
                  {/* rating (1–5); omit the row when rating is 0 */}
                  {testimonial.rating > 0 && (
                    <span
                      className="text-secondary flex items-center gap-0.5"
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
                </div>
                {/* review */}
                <p className="text-muted-foreground text-sm">
                  {testimonial.review}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ==================== enquiry sidebar ==================== */}
      <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-24">
        <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-2xl border p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-primary text-lg font-bold">
              Make An Enquiry
            </h2>
            <p className="text-muted-foreground text-sm">
              Send an enquiry directly to the property.
            </p>
          </div>
          {/* enquiry form does not exist yet → contact page */}
          <a
            href="/contact"
            className="bg-secondary text-secondary-foreground inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            Send Enquiry
          </a>
          {/* contact.whatsapp (required) → wa.me link */}
          <a
            href={`https://wa.me/${property.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white"
          >
            WhatsApp
          </a>
          {/* contact.phone — omit when empty */}
          {property.phone && (
            <a
              href={`tel:${property.phone.replace(/\s/g, "")}`}
              className="border-secondary text-secondary inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium"
            >
              <Phone className="size-4" aria-hidden="true" />
              {property.phone}
            </a>
          )}
        </div>
      </aside>
    </div>
  );
};
