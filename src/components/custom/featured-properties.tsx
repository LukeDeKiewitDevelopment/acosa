// src/components/custom/featured-properties.tsx
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { StaticAcosaImage } from "./image";
import menlynHotelImg from "@/assets/images/properties/menlyn-boutique-hotel/heroImage.jpg";
import sandtonSuitesImg from "@/assets/images/properties/sandton-executive-suites/heroImage.jpg";
import ridgeViewImg from "@/assets/images/properties/ridge-view-serviced-apartments/heroImage.jpg";

/* Static scaffold — data from getFeaturedProperties() (published && featured).
   Fields per card: heroImage (alt: no top-level field on properties —
   fallback = name, same gap as nodes), propertyType (label via
   propertyTypeLabel), acosaApproved.approved (badge conditional),
   name (+id for href → /properties/[id]), shortDescription (clamped).
   Section heading/subheading hardcoded; sample content = real frontmatter. */
export const FeaturedProperties = () => {
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
        {/* mock says "View All Nodes" — confirm: nodes (/business-nodes) or properties (/properties)? */}
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
        {/* Card — extract per-item later */}
        <li>
          <article className="bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
            <div className="relative m-3 aspect-[16/11] overflow-hidden rounded-xl">
              {/* heroImage — alt falls back to name */}
              <StaticAcosaImage
                src={menlynHotelImg.src}
                width={menlynHotelImg.width}
                height={menlynHotelImg.height}
                alt="Menlyn Boutique Hotel"
                className="h-full w-full object-cover"
              />
              {/* propertyType — label via propertyTypeLabel() */}
              <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase">
                Boutique Hotel
              </span>
              {/* acosaApproved.approved — omit when false */}
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase backdrop-blur">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Acosa Approved™
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4 pt-1">
              {/* name — href from id */}
              <h3 className="text-primary text-lg font-bold">
                <a
                  href="/properties/menlyn-boutique-hotel"
                  className="after:absolute after:inset-0"
                >
                  Menlyn Boutique Hotel
                </a>
              </h3>
              {/* shortDescription — clamped */}
              <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
                <MapPin
                  className="text-secondary mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="line-clamp-2">
                  A stylish boutique hotel designed for the modern business
                  traveller, 1.2 km from Menlyn Maine.
                </span>
              </p>
              {/* static affordance — whole card is the link */}
              <span className="border-secondary text-secondary mt-auto inline-flex items-center justify-between rounded-full border px-5 py-2.5 text-sm font-medium">
                View Details <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </article>
        </li>

        <li>
          <article className="bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
            <div className="relative m-3 aspect-[16/11] overflow-hidden rounded-xl">
              <StaticAcosaImage
                src={sandtonSuitesImg.src}
                width={sandtonSuitesImg.width}
                height={sandtonSuitesImg.height}
                alt="Sandton Executive Suites"
                className="h-full w-full object-cover"
              />
              <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase">
                Executive Stay
              </span>
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase backdrop-blur">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Acosa Approved™
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4 pt-1">
              <h3 className="text-primary text-lg font-bold">
                <a
                  href="/properties/sandton-executive-suites"
                  className="after:absolute after:inset-0"
                >
                  Sandton Executive Suites
                </a>
              </h3>
              <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
                <MapPin
                  className="text-secondary mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="line-clamp-2">
                  Serviced executive suites two blocks from the Gautrain, built
                  for consultants on multi-week engagements.
                </span>
              </p>
              <span className="border-secondary text-secondary mt-auto inline-flex items-center justify-between rounded-full border px-5 py-2.5 text-sm font-medium">
                View Details <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </article>
        </li>

        <li>
          <article className="bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md">
            <div className="relative m-3 aspect-[16/11] overflow-hidden rounded-xl">
              <StaticAcosaImage
                src={ridgeViewImg.src}
                width={ridgeViewImg.width}
                height={ridgeViewImg.height}
                alt="Ridge View Serviced Apartments"
                className="h-full w-full object-cover"
              />
              <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase">
                Serviced Apartment
              </span>
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white uppercase backdrop-blur">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Acosa Approved™
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4 pt-1">
              <h3 className="text-primary text-lg font-bold">
                <a
                  href="/properties/ridge-view-serviced-apartments"
                  className="after:absolute after:inset-0"
                >
                  Ridge View Serviced Apartments
                </a>
              </h3>
              <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
                <MapPin
                  className="text-secondary mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="line-clamp-2">
                  Self-catering serviced apartments on Umhlanga Ridge with
                  dedicated workspaces and airport shuttle.
                </span>
              </p>
              <span className="border-secondary text-secondary mt-auto inline-flex items-center justify-between rounded-full border px-5 py-2.5 text-sm font-medium">
                View Details <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </article>
        </li>
      </ul>
    </div>
  );
};
