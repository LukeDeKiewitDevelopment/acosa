// src/components/custom/node-directory.tsx
import { ArrowRight } from "lucide-react";

export type DirectoryNode = {
  id: string;
  name: string;
  province: string;
  city?: string;
  image?: {
    src: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
  };
  imageAlt?: string;
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
              className="hover:underline no-underline"
            >
              {group.label}
            </a>
          </h2>
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.nodes.map((node) => (
              <li key={node.id}>
                <a
                  href={`/business-nodes/${node.province}/${node.id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {node.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={node.image.src}
                        srcSet={node.image.srcSet}
                        sizes={node.image.sizes}
                        width={node.image.width}
                        height={node.image.height}
                        alt={node.imageAlt || node.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    </div>
                  ) : null}
                  <div className="relative flex items-center justify-between gap-3 p-4 pt-3">
                    <div className="min-w-0">
                      <p className="text-primary text-base font-bold leading-tight">{node.name}</p>
                      {node.city ? (
                        <p className="mt-1 text-xs text-muted-foreground">{node.city}</p>
                      ) : null}
                    </div>
                    <span className="bg-primary/10 text-primary inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
