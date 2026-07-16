// src/components/custom/vetting-preview.tsx
import { CircleCheck } from "lucide-react";

export type VettingCriterion = { label: string; score: number };

export type VettingPreviewProps = {
  heading: string;
  body: string;
  essentials: string[];
  headlineScore: number;
  criteria: VettingCriterion[];
  footnote: string;
};

export const VettingPreview = ({
  heading,
  body,
  essentials,
  headlineScore,
  criteria,
  footnote,
}: VettingPreviewProps) => {
  if (!heading && !body && criteria.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="vetting-preview"
      className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-primary text-xl font-bold md:text-2xl lg:text-3xl">
            {heading}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">{body}</p>
        </div>

        <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {essentials.map((name) => (
            <li
              key={name}
              className="bg-card text-card-foreground flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium shadow-sm"
            >
              <CircleCheck
                className="text-primary size-5 shrink-0"
                aria-hidden="true"
              />
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-muted flex flex-col gap-6 rounded-3xl p-8">
        <div className="flex flex-col gap-1">
          <p className="text-secondary-foreground text-4xl font-bold md:text-5xl">
            {headlineScore}%
          </p>
          <p className="text-foreground/80 text-sm font-semibold">
            Acosa Approved™ Score
          </p>
        </div>

        {criteria.length > 0 && (
          <dl className="flex flex-col gap-4">
            {criteria.map(({ label, score }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <dt>{label}</dt>
                  <dd className="font-semibold">{score}%</dd>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={label}
                  className="h-2.5 overflow-hidden rounded-full bg-white/80"
                >
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </dl>
        )}

        {footnote && <p className="text-foreground/80 text-sm">{footnote}</p>}
      </div>
    </div>
  );
};
