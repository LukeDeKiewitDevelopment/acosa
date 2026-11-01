import { PropertiesNodeMap } from "./properties-node-map";
import { TextLink } from "./text-link";

import type { MapHeroNode } from "./properties-node-map";

type PropertiesMapHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  regionLabel: string;
  nodes: MapHeroNode[];
  propertyCount: number;
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

        <PropertiesNodeMap nodes={nodes} regionLabel={regionLabel} />
      </div>
    </section>
  );
};
