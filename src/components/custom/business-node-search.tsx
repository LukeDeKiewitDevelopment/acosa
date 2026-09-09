import { useMemo, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";
import { PROVINCES, provinceLabel, type ProvinceSlug } from "@/lib/provinces";

export type BusinessNodeSearchItem = {
  id: string;
  name: string;
  province: ProvinceSlug;
  featured: boolean;
  image: ResolvedAcosaImage;
  imageAlt: string;
  highlights: string[];
  propertyNames: string[];
};

export type BusinessNodeSearchProps = {
  nodes: BusinessNodeSearchItem[];
  className?: string;
  showHeader?: boolean;
};

const PROVINCE_SLUGS = Object.keys(PROVINCES) as ProvinceSlug[];

export const BusinessNodeSearch = ({
  nodes,
  className,
  showHeader = true,
}: BusinessNodeSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState<ProvinceSlug | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nodes
      .filter((node) => {
        if (province && node.province !== province) return false;
        if (!q) return true;
        return (
          node.name.toLowerCase().includes(q) ||
          provinceLabel(node.province).toLowerCase().includes(q) ||
          node.propertyNames.some((name) => name.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [nodes, query, province]);

  const clearFilters = () => {
    setInputValue("");
    setQuery("");
    setProvince(null);
  };

  return (
    <div
      data-slot="business-node-search"
      className={cn("flex flex-col gap-8", className)}
    >
      {showHeader && (
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl">
          Business Node Search
        </h2>
      )}
      <form
        className="mx-auto flex w-full max-w-5xl flex-col gap-4 lg:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(inputValue);
        }}
      >
        <Field className="w-full min-w-0 lg:flex-2">
          <Input
            id="business-node-search-input"
            type="search"
            placeholder="Search by node, province or property name..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </Field>
        <Button type="submit" className="h-11 shrink-0 px-6" aria-label="Search business nodes">
          <Search className="size-4" aria-hidden="true" />
          Search
        </Button>
        <div className="min-w-0 lg:w-[220px]">
          <Combobox
            items={PROVINCE_SLUGS}
            value={province}
            onValueChange={(value) => setProvince(value)}
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
      </form>
      <Separator />
      <div data-slot="business-node-search-results">
        {results.length > 0 ? (
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {results.map((node) => (
              <BusinessNodeCard key={node.id} node={node} />
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
            <p>No business nodes match your search.</p>
            {(province || query.trim() !== "") && (
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

export const BusinessNodeCard = ({ node }: { node: BusinessNodeSearchItem }) => {
  const nodeHref = `/business-nodes/${node.province}/${node.id}`;

  return (
    <li>
      <article className="group bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-16/11 overflow-hidden">
          <StaticAcosaImage
            {...node.image}
            alt={node.imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <span className="bg-background/85 text-foreground rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase backdrop-blur-sm">
              {provinceLabel(node.province)}
            </span>
            {node.featured && (
              <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide">
                Popular
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-primary text-lg font-bold leading-snug">
              <a href={nodeHref} className="no-underline">
                {node.name}
              </a>
            </h3>
          </div>
          <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
            <MapPin className="text-secondary mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{provinceLabel(node.province)}</span>
          </p>
          {node.highlights.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {node.highlights.slice(0, 2).map((highlight) => (
                <li
                  key={highlight}
                  className="bg-muted text-muted-foreground line-clamp-1 max-w-full rounded-md px-2 py-0.5 text-xs"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          )}
          <a
            href={nodeHref}
            className="text-secondary mt-auto inline-flex items-center justify-between rounded-full border border-secondary px-4 py-2.5 text-sm font-medium no-underline"
          >
            View properties
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </article>
    </li>
  );
};
