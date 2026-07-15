// src/components/custom/trust-strip.tsx
import { cn } from "@/lib/utils";
import { BriefcaseBusiness, Shield, MapPin, LifeBuoy } from "lucide-react";

/* Static scaffold — data will come from home singleton: trustStrip[]
   Fields per item: icon (lucide name, text), title, detail */

export type TrustStripProps = {
  className?: string;
};

export const TrustStrip = ({ className }: TrustStripProps) => {
  return (
    <ul
      role="list"
      className={cn("grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {/* Item — icon from trustStrip[].icon, title, detail */}
      <li className="flex items-start gap-4">
        <span className="bg-secondary/10 text-secondary flex size-12 shrink-0 items-center justify-center rounded-xl">
          <BriefcaseBusiness className="size-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-primary text-sm font-semibold">
            Curated for Business
          </h3>
          <p className="text-muted-foreground text-sm">
            Every stay is chosen for business travellers.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-4">
        <span className="bg-secondary/10 text-secondary flex size-12 shrink-0 items-center justify-center rounded-xl">
          <Shield className="size-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-primary text-sm font-semibold">
            Quality You Can Trust
          </h3>
          <p className="text-muted-foreground text-sm">
            We check for reliability, safety, amenities.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-4">
        <span className="bg-secondary/10 text-secondary flex size-12 shrink-0 items-center justify-center rounded-xl">
          <MapPin className="size-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-primary text-sm font-semibold">
            Key Business Locations
          </h3>
          <p className="text-muted-foreground text-sm">
            Stay close to where business happens.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-4">
        <span className="bg-secondary/10 text-secondary flex size-12 shrink-0 items-center justify-center rounded-xl">
          <LifeBuoy className="size-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-primary text-sm font-semibold">Support Local</h3>
          <p className="text-muted-foreground text-sm">
            Supporting Independent Hosts.
          </p>
        </div>
      </li>
    </ul>
  );
};
