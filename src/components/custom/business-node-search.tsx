import { useMemo, useState } from "react";
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
};

const PROVINCE_SLUGS = Object.keys(PROVINCES) as ProvinceSlug[];

export const BusinessNodeSearch = ({
  nodes,
  className,
}: BusinessNodeSearchProps) => {
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

  return (
    <div
      data-slot="business-node-search"
      className={cn("flex flex-col gap-8", className)}
    >
      <h2 className="text-center text-xl md:text-2xl lg:text-3xl">
        Business Node Search
      </h2>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 lg:flex-row">
        <Field className="w-full min-w-0 lg:flex-65">
          <Input
            id="business-node-search-input"
            type="search"
            placeholder="Search by node, province or property name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Field>
        <div className="flex min-w-0 flex-col gap-4 lg:flex-35">
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
      </div>
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
            {province && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProvince(null)}
              >
                Clear filter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const BusinessNodeCard = ({ node }: { node: BusinessNodeSearchItem }) => {
  return (
    <li>
      <article className="group bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
        <div className="bg-muted relative aspect-16/10 overflow-hidden">
          <StaticAcosaImage
            {...node.image}
            alt={node.imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="bg-background/90 absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur">
            {provinceLabel(node.province)}
          </span>
          {node.featured && (
            <span className="bg-secondary text-secondary-foreground absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium">
              Popular
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="text-base leading-snug font-semibold">
            <a
              href={`/business-nodes/${node.province}/${node.id}`}
              className="after:absolute after:inset-0"
            >
              {node.name}
            </a>
          </h3>
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
        </div>
      </article>
    </li>
  );
};
