import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeatureListItem = {
  title?: string;
  detail?: string;
  text: string;
};

export type FeatureListProps = {
  items: FeatureListItem[];
  className?: string;
};

export function FeatureList({ items, className }: FeatureListProps) {
  return (
    <ul className={cn("grid gap-3 text-left sm:grid-cols-2", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className="bg-card flex items-start gap-3 rounded-lg border p-4 text-sm"
        >
          <span className="bg-secondary/10 text-secondary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
            <Check className="size-3" aria-hidden="true" />
          </span>
          <div>
            {item.title && (
              <p className="text-primary font-semibold">{item.title}</p>
            )}
            <p className={cn(item.title && "text-muted-foreground mt-0.5")}>
              {item.text}
            </p>
            {item.detail && (
              <p className="text-muted-foreground mt-0.5 text-sm">{item.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
