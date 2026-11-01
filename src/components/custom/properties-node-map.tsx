import { ArrowRight, ChevronDown } from "lucide-react";
import { SA_MAP_HEIGHT, SA_MAP_WIDTH, projectToSaMap } from "@/lib/sa-map";
import { SaMap } from "./map-graphics";

export type MapHeroNode = {
  id: string;
  name: string;
  href: string;
  propertyCount: number;
  longitude?: number;
  latitude?: number;
};

type PropertiesNodeMapProps = {
  nodes: MapHeroNode[];
  regionLabel: string;
  compact?: boolean;
};

const toPercent = (longitude: number, latitude: number) => {
  const { x, y } = projectToSaMap(longitude, latitude);
  return {
    left: `${((x + 28) / (SA_MAP_WIDTH + 56)) * 100}%`,
    top: `${((y + 28) / (SA_MAP_HEIGHT + 56)) * 100}%`,
  };
};

export const PropertiesNodeMap = ({
  nodes,
  regionLabel,
  compact = false,
}: PropertiesNodeMapProps) => {
  const mapped = nodes.filter(
    (node) => node.longitude !== undefined && node.latitude !== undefined,
  );
  const visibleNodes = compact
    ? nodes
    : nodes.filter((node) => node.propertyCount > 0);
  const liveCount = nodes.filter((node) => node.propertyCount > 0).length;
  const centre =
    mapped.length > 0
      ? toPercent(
          mapped.reduce((sum, node) => sum + node.longitude!, 0) /
            mapped.length,
          mapped.reduce((sum, node) => sum + node.latitude!, 0) / mapped.length,
        )
      : null;

  const nodeLinks = visibleNodes.map((node) => (
    <li key={node.id}>
      <a
        href={node.href}
        data-acosa-track="properties_map_node_click"
        className="group text-foreground hover:text-gold focus-visible:outline-ring border-border flex items-center justify-between gap-3 border-b py-2.5 text-sm font-semibold no-underline transition-colors focus-visible:outline-2"
      >
        {node.name}
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          {node.propertyCount > 0 && node.propertyCount}
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </a>
    </li>
  ));

  const callout = (
    <div className="bg-card text-card-foreground border-border w-full rounded-xl border p-5 shadow-[0_24px_50px_-28px_rgb(0_0_0/0.6)] lg:w-64">
      <p className="eyebrow-accent">{regionLabel}</p>
      <p className="text-muted-foreground mt-2 text-xs">
        {nodes.length} business {nodes.length === 1 ? "node" : "nodes"} ·{" "}
        {liveCount} with live accommodation
      </p>
      {visibleNodes.length > 0 && (
        <ul className="border-border mt-4 flex flex-col border-t">
          {nodeLinks}
        </ul>
      )}
    </div>
  );

  return (
    <div
      role="group"
      aria-label={`South Africa map highlighting ${regionLabel} business nodes`}
      className={
        compact
          ? "bg-navy text-ivory flex w-full flex-col gap-2 p-2"
          : "flex flex-col gap-5"
      }
    >
      <div
        className={
          compact
            ? "relative mx-auto aspect-[1.1/1] w-full"
            : "relative mx-auto w-full max-w-xl"
        }
      >
        <SaMap className="text-ivory" />
        {centre && (
          <>
            <span
              aria-hidden="true"
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={centre}
            >
              <span className="acosa-reach-pulse border-gold absolute inset-0 m-auto block size-5 rounded-full border-2" />
              <span className="bg-gold relative block size-5 rounded-full border-[3px] border-white shadow-[0_0_0_6px_rgb(213_141_5/0.25)]" />
            </span>
            {!compact && (
              <div
                className="absolute hidden -translate-y-1/2 lg:block"
                style={{
                  top: centre.top,
                  right: `calc(100% - ${centre.left} + 2.5rem)`,
                }}
              >
                {callout}
              </div>
            )}
          </>
        )}
      </div>
      {compact ? (
        <details className="group border-border bg-card text-card-foreground rounded-lg border [&_summary::-webkit-details-marker]:hidden">
          <summary className="text-foreground focus-visible:outline-ring flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold focus-visible:outline-2">
            <span>
              Explore {nodes.length} {regionLabel} business{" "}
              {nodes.length === 1 ? "node" : "nodes"}
            </span>
            <ChevronDown
              className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          {visibleNodes.length > 0 && (
            <ul className="border-border flex max-h-40 flex-col overflow-y-auto border-t px-3">
              {nodeLinks}
            </ul>
          )}
        </details>
      ) : (
        <div className="lg:hidden">{callout}</div>
      )}
    </div>
  );
};
