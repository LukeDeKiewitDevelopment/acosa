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
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-4xl mx-auto">
        <Field className="w-full lg:flex-65 min-w-0">
          <Input
            id="business-node-search-input"
            type="search"
            placeholder="Search by province or property name..."
          />
        </Field>
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-35 min-w-0">
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
          <Button className="bg-secondary text-secondary-foreground w-full lg:w-auto">
            Search <ArrowRightIcon />
          </Button>
        </div>
      </div>
      <Separator />
      <div data-slot="business-node-search-results"></div>
    </div>
  );
};
