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
      {items.map((item, index) => {
        const title = item.title?.trim();
        const detail = item.detail?.trim();
        const text = item.text?.trim();

        const bodyText =
          detail && detail !== title
            ? detail
            : text && text !== title
              ? text
              : null;

        return (
          <li
            key={`${title ?? text ?? item.detail ?? "feature"}-${index}`}
            className="bg-card flex items-start gap-3 rounded-lg border p-4 text-sm"
          >
            <span className="bg-secondary/10 text-secondary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
              <Check className="size-3" aria-hidden="true" />
            </span>
            <div>
              {title && <p className="text-primary font-semibold">{title}</p>}
              {bodyText && (
                <p className={cn(title && "text-muted-foreground mt-0.5")}>
                  {bodyText}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
