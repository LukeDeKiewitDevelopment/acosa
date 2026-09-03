// src/components/custom/owner-cta.tsx
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface OwnerCtaProps {
  heading: string;
  body: string;
  buttonLabel: string;
  secondButtonLabel: string;
  primaryHref?: string;
  secondaryHref?: string;
}

export const OwnerCta = ({
  heading,
  body,
  buttonLabel,
  secondButtonLabel,
  primaryHref = "/list-your-property",
  secondaryHref = "/list-your-property#listing-value",
}: OwnerCtaProps) => {
  if (!heading && !body && !buttonLabel) return null;

  return (
    <div
      data-slot="owner-cta"
      className="flex flex-col items-center gap-6 rounded-none px-6 py-16 text-center"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
          {heading}
        </h2>
        {body && <p className="text-sm md:text-base">{body}</p>}
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {buttonLabel && (
          <Button asChild variant="secondary">
            <a href={primaryHref} className="no-underline">
              {buttonLabel} <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        )}

        {secondButtonLabel && (
          <Button asChild variant="outline">
            <a href={secondaryHref} className="no-underline">
              {secondButtonLabel} <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
