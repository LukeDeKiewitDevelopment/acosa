import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { provinceLabel } from "@/lib/provinces";
import { matchesPropertySearchQuery } from "@/lib/property-search";
import { cn } from "@/lib/utils";
import { PropertyGrid, type PropertyCardItem } from "./property-card";

export type PropertySearchItem = PropertyCardItem & {
  province: string;
  businessNode: string;
  propertyType: string;
  locationAddress: string;
};

export type PropertySearchBusinessNode = {
  id: string;
  name: string;
};

export type PropertySearchProps = {
  items: PropertySearchItem[];
  businessNodes?: PropertySearchBusinessNode[];
};

type Option = { value: string; label: string };

function uniqueOptions(entries: [string, string][]): Option[] {
  const map = new Map(entries);
  return [...map.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

const fieldLabelClassName =
  "text-muted-foreground px-4 pt-3 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase";

const FilterSelect = ({
  id,
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: Option[];
}) => (
  <div className="relative flex min-w-0 flex-col">
    <label htmlFor={id} className={fieldLabelClassName}>
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="text-foreground h-11 w-full cursor-pointer appearance-none bg-transparent pr-10 pl-4 text-[0.9375rem] outline-none"
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown
      className="text-foreground/60 pointer-events-none absolute right-4 bottom-3.5 size-4"
      aria-hidden="true"
    />
  </div>
);

/* Properties, Creative Direction Blueprint Page 03: search and filter
   controls as one cohesive bar rather than competing fields and buttons,
   over genuine property cards. Filtering is instant, so there is no
   separate submit button to compete with. */
export const PropertySearch = ({
  items,
  businessNodes = [],
}: PropertySearchProps) => {
  const [query, setQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedBusinessNode, setSelectedBusinessNode] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Deep links: /properties?q=centurion or ?node=centurion
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const node = params.get("node");
    if (q) setQuery(q);
    if (node) setSelectedBusinessNode(node);
  }, []);

  const nodeOptions = useMemo(
    () =>
      uniqueOptions([
        ...businessNodes.map((node): [string, string] => [node.id, node.name]),
        ...items.map((item): [string, string] => [
          item.businessNode,
          item.businessNodeLabel,
        ]),
      ]),
    [businessNodes, items],
  );
  const typeOptions = useMemo(
    () =>
      uniqueOptions(
        items.map((item): [string, string] => [
          item.propertyType,
          item.propertyTypeLabel,
        ]),
      ),
    [items],
  );
  const provinceOptions = useMemo(
    () =>
      uniqueOptions(
        items.map((item): [string, string] => [
          item.province,
          provinceLabel(item.province),
        ]),
      ),
    [items],
  );
  // A province filter only earns its place once listings span provinces.
  const showProvince = provinceOptions.length > 1;

  const results = useMemo(() => {
    return items
      .filter((item) => {
        if (selectedProvince && item.province !== selectedProvince)
          return false;
        if (
          selectedBusinessNode &&
          item.businessNode !== selectedBusinessNode
        ) {
          return false;
        }
        if (selectedType && item.propertyType !== selectedType) return false;
        return matchesPropertySearchQuery(
          { ...item, provinceLabel: provinceLabel(item.province) },
          query,
        );
      })
      .sort((a, b) => {
        if (a.approved !== b.approved) return a.approved ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [items, query, selectedProvince, selectedBusinessNode, selectedType]);

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedProvince !== "" ||
    selectedBusinessNode !== "" ||
    selectedType !== "";

  const clearFilters = () => {
    setQuery("");
    setSelectedProvince("");
    setSelectedBusinessNode("");
    setSelectedType("");
  };

  return (
    <div data-slot="property-search" className="flex flex-col gap-8">
      <form
        role="search"
        aria-label="Search properties"
        onSubmit={(event) => event.preventDefault()}
        className={cn(
          "bg-card divide-border border-border focus-within:border-foreground/40 grid grid-cols-1 divide-y overflow-hidden rounded-xl border shadow-[0_18px_40px_-30px_rgb(5_10_60/0.35)] lg:divide-x lg:divide-y-0",
          showProvince
            ? "lg:grid-cols-[1.6fr_1fr_1fr_1fr]"
            : "lg:grid-cols-[1.8fr_1fr_1fr]",
        )}
      >
        <div className="relative flex min-w-0 flex-col">
          <label
            htmlFor="property-search-input"
            className={fieldLabelClassName}
          >
            Search
          </label>
          <div className="relative">
            <Search
              className="text-foreground/50 pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              id="property-search-input"
              type="search"
              placeholder="Property name, area or address"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="text-foreground placeholder:text-muted-foreground/80 h-11 w-full bg-transparent pr-4 pl-10 text-[0.9375rem] outline-none [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
        </div>
        <FilterSelect
          id="property-node-filter"
          label="Business node"
          value={selectedBusinessNode}
          onChange={setSelectedBusinessNode}
          allLabel="All business nodes"
          options={nodeOptions}
        />
        <FilterSelect
          id="property-type-filter"
          label="Property type"
          value={selectedType}
          onChange={setSelectedType}
          allLabel="All types"
          options={typeOptions}
        />
        {showProvince && (
          <FilterSelect
            id="property-province-filter"
            label="Province"
            value={selectedProvince}
            onChange={setSelectedProvince}
            allLabel="All provinces"
            options={provinceOptions}
          />
        )}
      </form>

      <div className="flex min-h-9 items-center justify-between gap-4">
        <p className="type-small" aria-live="polite">
          {results.length === 1 ? "1 property" : `${results.length} properties`}
          {hasActiveFilters && " match your search"}
        </p>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>

      <div data-slot="property-search-results">
        {results.length > 0 ? (
          <PropertyGrid items={results} headingLevel="h2" />
        ) : (
          <div className="surface-warm border-border flex flex-col items-center gap-4 rounded-xl border px-6 py-14 text-center">
            <p className="type-h3">
              {items.length === 0
                ? "Our first ACOSA properties are coming soon."
                : "No properties match your search."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
