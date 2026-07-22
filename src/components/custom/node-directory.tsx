// src/components/custom/node-directory.tsx
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";

export type DirectoryNode = {
  id: string;
  name: string;
  city: string;
  province: string;
  image: ResolvedAcosaImage;
  imageAlt: string;
};

export type DirectoryGroup = {
  slug: string;
  label: string;
  nodeCount: number;
  nodes: DirectoryNode[];
};

export const NodeDirectory = ({ groups }: { groups: DirectoryGroup[] }) => {
  if (groups.length === 0) return null;

  return (
    <div data-slot="node-directory" className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.slug} className="flex flex-col gap-6">
          <h2 className="text-primary flex items-baseline gap-2 text-lg font-bold md:text-xl">
            <a
              href={`/business-nodes/${group.slug}`}
              className="hover:underline"
            >
              {group.label}
            </a>
            <span className="text-muted-foreground text-sm font-normal">
              {group.nodeCount} {group.nodeCount === 1 ? "node" : "nodes"}
            </span>
          </h2>
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {group.nodes.map((node) => (
              <li key={node.id}>
                <a
                  href={`/business-nodes/${node.province}/${node.id}`}
                  className="group relative block aspect-3/4 overflow-hidden rounded-2xl"
                >
                  <StaticAcosaImage
                    {...node.image}
                    alt={node.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4 text-white">
                    <span className="text-lg font-bold">{node.name}</span>
                    {node.city && (
                      <span className="text-sm text-white/80">{node.city}</span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
