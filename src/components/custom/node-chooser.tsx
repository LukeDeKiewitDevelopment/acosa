import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeChooserItem = {
  id: string;
  name: string;
  city: string;
  href: string;
  propertyCount: number;
};

export function nodeStatusLabel(count: number) {
  if (count === 0) return "Growing network";
  return `${count} ACOSA ${count === 1 ? "property" : "properties"}`;
}

/* Typographic node selection: each node is a discrete, clearly clickable
   choice that leads to accommodation in that area. */
export const NodeChooser = ({
  items,
  className,
}: {
  items: NodeChooserItem[];
  className?: string;
}) => {
  if (items.length === 0) return null;
  return (
    <ul
      role="list"
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((node) => {
        const live = node.propertyCount > 0;
        return (
          <li key={node.id}>
            <a
              href={node.href}
              data-acosa-track="business_node_click"
              className="group bg-card focus-visible:ring-ring border-border hover:border-foreground/40 flex h-full items-center justify-between gap-4 rounded-xl border px-5 py-4 no-underline transition-[border-color,box-shadow] duration-200 hover:shadow-[0_12px_30px_-20px_rgb(5_10_60/0.4)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-heading text-foreground text-base font-semibold">
                  {node.name}
                </span>
                <span className="text-muted-foreground flex items-center gap-2 text-xs">
                  {node.city}
                  <span aria-hidden="true">·</span>
                  <span className={cn(live && "text-gold-ink font-semibold")}>
                    {nodeStatusLabel(node.propertyCount)}
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
  );
};
