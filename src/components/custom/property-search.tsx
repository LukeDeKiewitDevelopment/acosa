import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field } from "../ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { StaticAcosaImage } from "./image";
import { PROVINCES, provinceLabel, type ProvinceSlug } from "@/lib/provinces";

export type PropertySearchItem = {
  id: string;
  name: string;
  province: string;
  propertyType: string;
  propertyTypeLabel: string;
  approved: boolean;
  shortDescription: string;
  image: {
    src: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
  };
  imageAlt: string;
};

export type PropertySearchProps = { items: PropertySearchItem[] };

const PROVINCE_SLUGS = Object.keys(PROVINCES) as ProvinceSlug[];

export const PropertySearch = ({ items }: PropertySearchProps) => {
  const [query, setQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<ProvinceSlug | null>(
    null,
  );
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // The canonical PROPERTY_TYPES map lives in content.config.ts, which imports
  // the server-only `astro:content` module and so cannot be pulled into a
  // client island. Each item already carries its type slug + display label
  // (resolved server-side), so derive the type-filter options from the data.
  const { typeSlugs, typeLabels } = useMemo(() => {
    const labels = new Map<string, string>();
    for (const item of items) {
      if (!labels.has(item.propertyType)) {
        labels.set(item.propertyType, item.propertyTypeLabel);
      }
    }
    const entries = [...labels.entries()].sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
    return {
      typeSlugs: entries.map(([slug]) => slug),
      typeLabels: Object.fromEntries(entries) as Record<string, string>,
    };
  }, [items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((item) => {
        if (selectedProvince && item.province !== selectedProvince) {
          return false;
        }
        if (selectedType && item.propertyType !== selectedType) {
          return false;
        }
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.propertyTypeLabel.toLowerCase().includes(q) ||
          provinceLabel(item.province).toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (a.approved !== b.approved) return a.approved ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [items, query, selectedProvince, selectedType]);

  const hasActiveFilters =
    query.trim() !== "" || selectedProvince !== null || selectedType !== null;

  const clearFilters = () => {
    setQuery("");
    setSelectedProvince(null);
    setSelectedType(null);
  };

  return (
    <div data-slot="property-search" className="flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 lg:flex-row">
        <Field className="w-full min-w-0 lg:flex-2">
          <Input
            id="property-search-input"
            type="search"
            placeholder="Search by property, province or type..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Field>
        <div className="min-w-0 lg:flex-1">
          <Combobox
            items={PROVINCE_SLUGS}
            value={selectedProvince}
            onValueChange={(value) => setSelectedProvince(value)}
            itemToStringLabel={(slug) => provinceLabel(slug)}
          >
            <ComboboxInput placeholder="All Provinces" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {provinceLabel(item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div className="min-w-0 lg:flex-1">
          <Combobox
            items={typeSlugs}
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
            itemToStringLabel={(slug) => typeLabels[slug]}
          >
            <ComboboxInput placeholder="All Types" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {typeLabels[item]}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
      <Separator />
      <div data-slot="property-search-results">
        {results.length > 0 ? (
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {results.map((item) => (
              <PropertyCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
            <p>
              {items.length === 0
                ? "Our first ACOSA properties are coming soon."
                : "No properties match your search."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PropertyCard = ({ item }: { item: PropertySearchItem }) => {
  return (
    <li>
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
              className="after:absolute after:inset-0"
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
              <span className="line-clamp-2">{item.shortDescription}</span>
            </p>
          )}
          <span className="border-secondary text-secondary mt-auto inline-flex items-center justify-between rounded-full border px-5 py-2.5 text-sm font-medium">
            View Details <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </article>
    </li>
  );
};
