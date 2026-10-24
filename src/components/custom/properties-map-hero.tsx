import { ArrowRight } from "lucide-react";
import { SA_MAP_HEIGHT, SA_MAP_WIDTH, projectToSaMap } from "@/lib/sa-map";
import { SaMap } from "./map-graphics";
import { TextLink } from "./text-link";

export type MapHeroNode = {
  id: string;
  name: string;
  href: string;
  propertyCount: number;
  longitude?: number;
  latitude?: number;
};

type PropertiesMapHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  regionLabel: string;
  nodes: MapHeroNode[];
  propertyCount: number;
};

// Position on the SaMap overlay as a percentage (SaMap pads its viewBox by 10).
const toPercent = (longitude: number, latitude: number) => {
  const { x, y } = projectToSaMap(longitude, latitude);
  return {
    left: `${((x + 10) / (SA_MAP_WIDTH + 20)) * 100}%`,
    top: `${((y + 10) / (SA_MAP_HEIGHT + 20)) * 100}%`,
  };
};

/* Properties hero: South Africa with the active region marked. Nodes in one
   province sit within a few pixels of each other at national scale, so the
   map shows one region marker and a callout listing its live nodes. */
export const PropertiesMapHero = ({
  eyebrow,
  title,
  lead,
  regionLabel,
  nodes,
  propertyCount,
}: PropertiesMapHeroProps) => {
  const mapped = nodes.filter(
    (node) => node.longitude !== undefined && node.latitude !== undefined,
  );
  const live = nodes.filter((node) => node.propertyCount > 0);
  const centre =
    mapped.length > 0
      ? toPercent(
          mapped.reduce((sum, n) => sum + n.longitude!, 0) / mapped.length,
          mapped.reduce((sum, n) => sum + n.latitude!, 0) / mapped.length,
        )
      : null;

  const callout = (
    <div className="bg-card text-card-foreground border-border w-full rounded-xl border p-5 shadow-[0_24px_50px_-28px_rgb(0_0_0/0.6)] lg:w-64">
      <p className="eyebrow-accent">{regionLabel}</p>
      <p className="text-muted-foreground mt-2 text-xs">
        {nodes.length} business {nodes.length === 1 ? "node" : "nodes"} ·{" "}
        {live.length} with live accommodation
      </p>
      {live.length > 0 && (
        <ul className="border-border mt-4 flex flex-col border-t">
          {live.map((node) => (
            <li key={node.id}>
              <a
                href={node.href}
                data-acosa-track="properties_map_node_click"
                className="group text-foreground hover:text-gold focus-visible:outline-ring border-border flex items-center justify-between gap-3 border-b py-2.5 text-sm font-semibold no-underline transition-colors focus-visible:outline-2"
              >
                {node.name}
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  {node.propertyCount}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section className="surface-navy relative isolate overflow-hidden">
      <div className="container-page grid items-center gap-10 py-14 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-20">
        <div className="flex max-w-xl flex-col gap-5">
          <p className="eyebrow-accent">{eyebrow}</p>
          <h1 className="type-h1">{title}</h1>
          <p className="type-lead">{lead}</p>
          <dl className="border-border mt-2 grid max-w-sm grid-cols-2 border-t pt-6">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground order-last text-xs">
                Approved {propertyCount === 1 ? "property" : "properties"}
              </dt>
              <dd className="font-heading text-4xl font-semibold">
                {propertyCount}
              </dd>
            </div>
            <div className="border-border flex flex-col gap-1 border-l pl-6">
              <dt className="text-muted-foreground order-last text-xs">
                Business nodes
              </dt>
              <dd className="font-heading text-4xl font-semibold">
                {nodes.length}
              </dd>
            </div>
          </dl>
          <TextLink
            label="Explore Business Nodes"
            href="/business-nodes"
            className="mt-2"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="relative mx-auto w-full max-w-xl">
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
                <div
                  className="absolute hidden -translate-y-1/2 lg:block"
                  style={{
                    top: centre.top,
                    right: `calc(100% - ${centre.left} + 2.5rem)`,
                  }}
                >
                  {callout}
                </div>
              </>
            )}
          </div>
          <div className="lg:hidden">{callout}</div>
        </div>
      </div>
    </section>
  );
};
