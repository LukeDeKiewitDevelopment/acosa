// src/components/custom/popular-nodes.tsx
import { StaticAcosaImage, type ResolvedAcosaImage } from "./image";

export type PopularNodeItem = {
  id: string;
  name: string;
  city: string;
  province: string;
  image: ResolvedAcosaImage;
  imageAlt: string;
};

export const NodeCard = ({
  id,
  name,
  city,
  province,
  image,
  imageAlt,
}: PopularNodeItem) => {
  return (
    <a
      href={`/business-nodes/${province}/${id}`}
      className="group relative block aspect-3/4 overflow-hidden rounded-2xl"
    >
      <StaticAcosaImage
        {...image}
        alt={imageAlt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
      />
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4 text-white">
        <span className="text-lg font-bold">{name}</span>
        {city && <span className="text-sm text-white/80">{city}</span>}
      </span>
    </a>
  );
};

export const PopularNodes = ({ items }: { items: PopularNodeItem[] }) => {
  if (items.length === 0) return null;

  return (
    <div data-slot="popular-nodes" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-primary text-xl font-bold md:text-2xl lg:text-3xl">
          Popular Business Nodes
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Curated accommodation close to South Africa's key corporate hubs.
        </p>
      </div>

      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map((item) => (
          <li key={item.id}>
            <NodeCard {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
