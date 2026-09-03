// src/components/custom/node-directory.tsx
export type DirectoryNode = {
  id: string;
  name: string;
  province: string;
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
          <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.nodes.map((node) => (
              <li key={node.id}>
                <a
                  href={`/business-nodes/${node.province}/${node.id}`}
                  className="text-primary border-border flex items-center justify-between rounded-lg border p-4 font-semibold no-underline hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span>Explore {node.name}</span>
                  <span aria-hidden="true">-&gt;</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
