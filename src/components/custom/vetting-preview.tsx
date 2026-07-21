// src/components/custom/vetting-preview.tsx
import { CircleCheck } from "lucide-react";
import { resolveIcon } from "@/lib/lucide";

export type VettingPreviewProps = {
  heading: string;
  body: string;
  essentials: { name: string; icon: string }[];
};

export const VettingPreview = ({
  heading,
  body,
  essentials,
}: VettingPreviewProps) => {
  if (!heading && !body && essentials.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="vetting-preview"
      className="mx-auto flex max-w-3xl flex-col items-center gap-6"
    >
      <div className="flex flex-col gap-3 text-center">
        <h2 className="text-primary text-xl font-bold md:text-2xl lg:text-3xl">
          {heading}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">{body}</p>
      </div>

      <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {essentials.map(({ name, icon }) => {
          const Icon = resolveIcon(icon, CircleCheck);
          return (
            <li
              key={name}
              className="bg-card text-card-foreground flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium shadow-sm"
            >
              <Icon
                className="text-primary size-5 shrink-0"
                aria-hidden="true"
              />
              {name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
