import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  ArrowRight,
  ArrowRightIcon,
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
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { StaticAcosaImage } from "./image";

export type BusinessNodeSearchProps = {
  className?: string;
};

const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export const BusinessNodeSearch = ({}: BusinessNodeSearchProps) => {
  return (
    <div data-slot="business-node-search" className="flex flex-col gap-8">
      <h2 className="text-center text-xl md:text-2xl lg:text-3xl">
        Business Node Search
      </h2>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 lg:flex-row">
        <Field className="w-full min-w-0 lg:flex-65">
          <Input
            id="business-node-search-input"
            type="search"
            placeholder="Search by province or property name..."
          />
        </Field>
        <div className="flex min-w-0 flex-col gap-4 lg:flex-35">
          <Combobox items={provinces}>
            <ComboboxInput placeholder="All Provinces" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
      <Separator />
      <div data-slot="business-node-search-results">
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Card — extract to <BusinessNodeCard /> later.
          Fields: heroImage, province, featured, name (+slug), businessHighlights[].title */}
          <li>
            <article className="group bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
              <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                {/* heroImage */}
                <StaticAcosaImage
                  src="/images/nodes/sandton.jpg"
                  alt="Sandton"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* province (label) */}
                <span className="bg-background/90 absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur">
                  Gauteng
                </span>
                {/* featured — omit this span when false */}
                <span className="bg-secondary text-secondary-foreground absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium">
                  Popular
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                {/* name — href from slug */}
                <h3 className="text-base leading-snug font-semibold">
                  <a href="#" className="after:absolute after:inset-0">
                    Sandton
                  </a>
                </h3>
                {/* businessHighlights[].title (first 2) */}
                <ul className="flex flex-wrap gap-1.5">
                  <li className="bg-muted text-muted-foreground line-clamp-1 max-w-full rounded-md px-2 py-0.5 text-xs">
                    Sandton CBD
                  </li>
                  <li className="bg-muted text-muted-foreground line-clamp-1 max-w-full rounded-md px-2 py-0.5 text-xs">
                    Gautrain access
                  </li>
                </ul>
              </div>
            </article>
          </li>

          {/* Variant: not featured, no highlights (both optional in schema) */}
          <li>
            <article className="group bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
              <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                <StaticAcosaImage
                  src="/images/nodes/umhlanga-ridge.jpg"
                  alt="Umhlanga Ridge"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="bg-background/90 absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur">
                  KwaZulu-Natal
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="text-base leading-snug font-semibold">
                  <a href="#" className="after:absolute after:inset-0">
                    Umhlanga Ridge
                  </a>
                </h3>
              </div>
            </article>
          </li>

          {/* Variant: featured, one long highlight (clamped) */}
          <li>
            <article className="group bg-card text-card-foreground relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
              <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                <StaticAcosaImage
                  src="/images/nodes/century-city.jpg"
                  alt="Century City"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="bg-background/90 absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur">
                  Western Cape
                </span>
                <span className="bg-secondary text-secondary-foreground absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium">
                  Popular
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="text-base leading-snug font-semibold">
                  <a href="#" className="after:absolute after:inset-0">
                    Century City
                  </a>
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  <li className="bg-muted text-muted-foreground line-clamp-1 max-w-full rounded-md px-2 py-0.5 text-xs">
                    Canal Walk and surrounding corporate precinct
                  </li>
                </ul>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </div>
  );
};
