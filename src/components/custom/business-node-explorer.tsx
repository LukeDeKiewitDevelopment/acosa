// CLIENT ISLAND — mount with client:visible / client:load (MapLibre needs JS).
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerLabel,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";
import { nodeStatusLabel } from "./node-chooser";

export type BusinessNodeExplorerItem = {
  id: string;
  name: string;
  city: string;
  href: string;
  propertyCount: number;
  longitude?: number;
  latitude?: number;
};

/* Business Nodes, Creative Direction Blueprint Page 02: the map is the
   central functional feature, and its relationship with the node list is
   explicit. Hovering or focusing a node highlights its marker (and vice
   versa), and selecting either opens that node's page. On mobile the list
   comes first as the straightforward alternative to a small map. */
export const BusinessNodeExplorer = ({
  nodes,
}: {
  nodes: BusinessNodeExplorerItem[];
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const mapped = nodes.filter(
    (node) => node.longitude !== undefined && node.latitude !== undefined,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
      <div className="order-2 flex flex-col gap-3 lg:order-1">
        <div className="border-border bg-muted relative h-80 w-full overflow-hidden rounded-xl border sm:h-104 lg:h-[34rem]">
          <Map
            theme="light"
            center={[28.16, -25.92]}
            zoom={8.7}
            maxZoom={14}
            minZoom={7}
            cooperativeGestures
          >
            <MapControls position="top-right" />
            {mapped.map((node) => {
              const active = activeId === node.id;
              const live = node.propertyCount > 0;
              return (
                <MapMarker
                  key={node.id}
                  longitude={node.longitude!}
                  latitude={node.latitude!}
                  onClick={() => {
                    window.location.href = node.href;
                  }}
                  onMouseEnter={() => setActiveId(node.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <MarkerContent
                    className={cn(
                      "transition-transform duration-200",
                      active && "z-10 scale-110",
                    )}
                  >
                    <span
                      className={cn(
                        "block size-4 rounded-full border-[3px] border-white shadow-[0_2px_8px_rgb(5_10_60/0.45)] transition-colors",
                        active || live ? "bg-gold" : "bg-navy",
                      )}
                    />
                    <MarkerLabel
                      position="top"
                      className={cn(
                        "mb-1.5 rounded-md border px-2 py-1 font-sans text-[0.6875rem] font-semibold shadow-sm transition-colors",
                        active
                          ? "border-navy bg-navy text-white"
                          : "border-border text-navy bg-white",
                      )}
                    >
                      {node.name}
                    </MarkerLabel>
                  </MarkerContent>
                </MapMarker>
              );
            })}
          </Map>
        </div>
        <p className="type-emphasis">
          Gold markers show business nodes with live ACOSA accommodation. Select
          a marker or a business node to view accommodation in that area.
        </p>
      </div>

      <nav
        aria-label="Business nodes"
        className="relative z-10 order-1 lg:order-2"
      >
        <ul role="list" className="flex flex-col gap-2">
          {nodes.map((node) => {
            const active = activeId === node.id;
            const live = node.propertyCount > 0;
            return (
              <li key={node.id}>
                <a
                  href={node.href}
                  data-acosa-track="business_node_click"
                  onMouseEnter={() => setActiveId(node.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(node.id)}
                  onBlur={() => setActiveId(null)}
                  className={cn(
                    "group focus-visible:ring-ring flex items-center justify-between gap-4 rounded-xl border bg-white px-4 py-3.5 no-underline transition-[border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    active
                      ? "border-navy shadow-[0_12px_30px_-20px_rgb(5_10_60/0.5)]"
                      : "border-border",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        live ? "bg-gold" : "bg-sage",
                      )}
                    />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-heading text-foreground text-[0.9375rem] font-semibold">
                        {node.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {node.city} · {nodeStatusLabel(node.propertyCount)}
                      </span>
                    </span>
                  </span>
                  <ArrowRight
                    className="text-foreground/50 group-hover:text-foreground size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
