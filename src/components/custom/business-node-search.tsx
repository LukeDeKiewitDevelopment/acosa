import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type BusinessNodeSearchProvince = {
  slug: string;
  label: string;
  nodeCount: number;
};

export type BusinessNodeSearchSuggestion = {
  slug: string;
  name: string;
  url: string;
  provinceLabel: string;
};

export type BusinessNodeSearchProps = {
  /** Provinces that have at least one business node, for the area filter. */
  provinces: BusinessNodeSearchProvince[];
  /** Shown before the search index has loaded / while the query is empty. */
  popularNodes?: BusinessNodeSearchSuggestion[];
  className?: string;
};

type SearchNode = {
  slug: string;
  name: string;
  url: string;
  province: string;
  provinceLabel: string;
  featured: boolean;
};

type SearchProperty = {
  slug: string;
  name: string;
  url: string;
  province: string;
  provinceLabel: string;
  nodeLabel: string;
  propertyTypeLabel: string;
};

type SearchIndex = {
  nodes: SearchNode[];
  properties: SearchProperty[];
};

type ResultRow = {
  type: "node" | "property";
  slug: string;
  name: string;
  url: string;
  meta: string;
};

const MAX_NODE_RESULTS = 5;
const MAX_PROPERTY_RESULTS = 6;

export const BusinessNodeSearch = ({
  provinces,
  popularNodes = [],
  className,
}: BusinessNodeSearchProps) => {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("all");
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/search.json")
      .then((res) => res.json())
      .then((data: SearchIndex) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query, province]);

  const selectedProvinceLabel = useMemo(
    () => provinces.find((p) => p.slug === province)?.label,
    [provinces, province],
  );

  const isEmptyQuery = query.trim().length === 0;

  const results: ResultRow[] = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      const suggestions = index
        ? index.nodes.filter(
            (n) => n.featured && (province === "all" || n.province === province),
          )
        : popularNodes;
      return suggestions.slice(0, MAX_NODE_RESULTS).map((n) => ({
        type: "node" as const,
        slug: n.slug,
        name: n.name,
        url: n.url,
        meta: n.provinceLabel,
      }));
    }

    if (!index) return [];

    const matches = (haystacks: string[]) =>
      haystacks.some((value) => value.toLowerCase().includes(q));

    const nodeMatches: ResultRow[] = index.nodes
      .filter((n) => province === "all" || n.province === province)
      .filter((n) => matches([n.name, n.provinceLabel]))
      .slice(0, MAX_NODE_RESULTS)
      .map((n) => ({
        type: "node",
        slug: n.slug,
        name: n.name,
        url: n.url,
        meta: n.provinceLabel,
      }));

    const propertyMatches: ResultRow[] = index.properties
      .filter((p) => province === "all" || p.province === province)
      .filter((p) => matches([p.name, p.nodeLabel, p.provinceLabel]))
      .slice(0, MAX_PROPERTY_RESULTS)
      .map((p) => ({
        type: "property",
        slug: p.slug,
        name: p.name,
        url: p.url,
        meta: `${p.nodeLabel} · ${p.propertyTypeLabel}`,
      }));

    return [...nodeMatches, ...propertyMatches];
  }, [query, province, index, popularNodes]);

  const showNoResults = !isEmptyQuery && index !== null && results.length === 0;

  const navigateTo = (url: string) => {
    window.location.href = url;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Escape") {
      setOpen(false);
      event.currentTarget.blur();
    } else if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      navigateTo(results[activeIndex].url);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = results[activeIndex] ?? results[0];
    if (target) {
      navigateTo(target.url);
    } else {
      setOpen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative mx-auto w-full max-w-2xl", className)}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-3xl bg-card p-2 shadow-2xl ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:gap-1 sm:rounded-4xl sm:p-1.5"
      >
        <div className="flex flex-1 items-center gap-2 ps-3">
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search by area, suburb or property name…"
            aria-label="Search by area, suburb or property name"
            role="combobox"
            aria-expanded={open}
            aria-controls="business-node-search-results"
            aria-activedescendant={
              activeIndex >= 0 ? `business-node-search-option-${activeIndex}` : undefined
            }
            autoComplete="off"
            className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          {query && (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setQuery("")}
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-1 justify-between gap-1.5 text-xs font-medium sm:flex-none"
              >
                {selectedProvinceLabel ?? "All Areas"}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onSelect={() => {
                  setProvince("all");
                  setOpen(true);
                }}
              >
                All Areas
              </DropdownMenuItem>
              {provinces.map((p) => (
                <DropdownMenuItem
                  key={p.slug}
                  onSelect={() => {
                    setProvince(p.slug);
                    setOpen(true);
                  }}
                >
                  {p.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="shrink-0 gap-1.5 px-5"
          >
            Search
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>

      {open && (
        <div
          id="business-node-search-results"
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-2xl bg-popover p-2 text-popover-foreground shadow-2xl ring-1 ring-foreground/5"
        >
          {!index && (
            <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading business nodes…
            </div>
          )}

          {index && isEmptyQuery && results.length > 0 && (
            <p className="px-3 pt-1 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Popular business nodes
            </p>
          )}

          {results.map((result, i) => (
            <a
              key={`${result.type}-${result.slug}`}
              id={`business-node-search-option-${i}`}
              href={result.url}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition-colors",
                i === activeIndex ? "bg-muted text-foreground" : "hover:bg-muted",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                {result.type === "node" ? (
                  <MapPin className="size-4" />
                ) : (
                  <Building2 className="size-4" />
                )}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{result.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {result.meta}
                </span>
              </span>
            </a>
          ))}

          {showNoResults && (
            <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                No matches for "{query.trim()}".
              </p>
              <a
                href="/business-nodes"
                className="text-sm font-medium no-underline hover:underline"
              >
                Browse all business nodes
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
