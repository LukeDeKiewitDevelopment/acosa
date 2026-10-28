import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { tagIcon, type IconTag } from "@/lib/tag-icons";
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";

/* One property card everywhere (Home, Properties, Business Node pages).
   Per the brief: consistent image ratio, then the property name, location,
   business-relevant features and a clear View Property action. */
export type PropertyCardItem = {
  id: string;
  name: string;
  propertyTypeLabel: string;
  businessNodeLabel: string;
  provinceLabel: string;
  approved: boolean;
  shortDescription: string;
  essentials: IconTag[];
  image: ResolvedAcosaImage;
  imageAlt: string;
};

type PropertyCardProps = {
  item: PropertyCardItem;
  /** "feature": wide layout for when only one or two listings are shown. */
  layout?: "stack" | "feature";
  headingLevel?: "h2" | "h3";
  className?: string;
};

/* The one ACOSA Approved mark used across cards and profiles. No score. */
export const ApprovedBadge = ({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) => {
  const classes = cn(
    "bg-card text-navy inline-flex w-fit items-center gap-1.5 rounded-md border border-gold/50 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase no-underline",
    href && "transition-colors hover:border-gold",
    className,
  );
  const content = (
    <>
      <BadgeCheck className="text-gold-ink size-4" aria-hidden="true" />
      ACOSA Approved
    </>
  );
  return href ? (
    <a href={href} className={classes} title="What does ACOSA Approved mean?">
      {content}
    </a>
  ) : (
    <span className={classes}>{content}</span>
  );
};

export const PropertyCard = ({
  item,
  layout = "stack",
  headingLevel: Heading = "h3",
  className,
}: PropertyCardProps) => {
  const href = `/properties/${item.id}`;
  const location = [item.businessNodeLabel, item.provinceLabel]
    .filter(Boolean)
    .join(", ");
  const isFeature = layout === "feature";
  const essentials = item.essentials.slice(0, isFeature ? 6 : 3);

  return (
    <article
      className={cn(
        "group bg-card text-card-foreground border-border relative flex h-full flex-col overflow-hidden rounded-xl border transition-shadow duration-300 focus-within:shadow-[0_18px_40px_-24px_rgb(5_10_60/0.35)] hover:shadow-[0_18px_40px_-24px_rgb(5_10_60/0.35)]",
        isFeature && "md:grid md:grid-cols-[1.15fr_1fr]",
        className,
      )}
    >
      <div
        className={cn(
          "bg-muted relative aspect-4/3 overflow-hidden",
          isFeature && "md:aspect-auto md:min-h-[26rem]",
        )}
      >
        <StaticAcosaImage
          {...item.image}
          alt={item.imageAlt}
          className="absolute inset-0 h-full w-full max-w-none object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {item.approved && (
          <div className="absolute top-3 left-3">
            <ApprovedBadge className="border-transparent shadow-sm" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-4 p-5 sm:p-6",
          isFeature && "md:justify-center md:gap-5 md:p-10",
        )}
      >
        <div className="flex flex-col gap-2">
          <p className="eyebrow">{item.propertyTypeLabel}</p>
          <Heading
            className={cn(isFeature ? "type-h2" : "type-h3", "text-foreground")}
          >
            <a
              href={href}
              className="no-underline after:absolute after:inset-0 after:z-10 focus-visible:outline-none"
              data-acosa-track="property_card_click"
              data-property-id={item.id}
              data-property-name={item.name}
            >
              {item.name}
            </a>
          </Heading>
          {location && (
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {location}
            </p>
          )}
        </div>

        {isFeature && item.shortDescription && (
          <p className="type-body">{item.shortDescription}</p>
        )}

        {essentials.length > 0 && (
          <ul
            aria-label="Business essentials"
            className="flex flex-wrap gap-1.5"
          >
            {essentials.map((tag) => {
              const Icon = tagIcon(tag.icon);
              return (
                <li
                  key={tag.name}
                  className="bg-muted text-foreground/85 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
                >
                  <Icon className="text-gold-ink size-3.5" aria-hidden="true" />
                  {tag.name}
                </li>
              );
            })}
          </ul>
        )}

        <span
          className={cn(
            "border-foreground/25 text-foreground group-hover:border-foreground/60 group-hover:bg-foreground/[0.04] group-has-[a:focus-visible]:ring-ring mt-auto inline-flex h-11 items-center justify-between gap-2 rounded-lg border px-4 text-sm font-medium transition-colors group-has-[a:focus-visible]:ring-2 group-has-[a:focus-visible]:ring-offset-2",
            isFeature &&
              "md:bg-gold md:text-navy md:group-hover:bg-gold-hover md:mt-2 md:w-fit md:justify-center md:border-transparent md:px-6 md:group-hover:border-transparent",
          )}
        >
          View Property
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
};

/* Grid that switches to the wide feature layout for a single listing, so
   limited inventory reads as deliberate rather than as an empty directory. */
export const PropertyGrid = ({
  items,
  headingLevel = "h3",
}: {
  items: PropertyCardItem[];
  headingLevel?: "h2" | "h3";
}) => {
  if (items.length === 1) {
    return (
      <PropertyCard
        item={items[0]}
        layout="feature"
        headingLevel={headingLevel}
      />
    );
  }
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <li key={item.id}>
          <PropertyCard item={item} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
};
