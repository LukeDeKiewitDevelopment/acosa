// src/components/custom/trust-strip.tsx
import { Dot } from "lucide-react";
import { resolveIcon } from "@/lib/lucide";

export type TrustIconsItem = {
  icon: string;
  title: string;
  detail: string;
};

export type TrustIconsProps = {
  items: TrustIconsItem[];
};

export const TrustIcons = ({ items }: TrustIconsProps) => {
  if (items.length === 0) return null;

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => {
        const Icon = resolveIcon(item.icon, Dot);
        return (
          <li key={item.title} className="flex items-start gap-4">
            <span className="bg-secondary/10 text-secondary flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-primary text-sm font-semibold">
                {item.title}
              </h3>
              {item.detail && (
                <p className="text-muted-foreground text-sm">{item.detail}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
