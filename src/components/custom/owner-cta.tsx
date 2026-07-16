// src/components/custom/owner-cta.tsx
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

/* Static scaffold — data from home singleton: ownerCta.heading, .body,
   .buttonLabel (primary button text). GAP: the mock has TWO buttons but
   the schema has one buttonLabel — second button label is hardcoded
   pending a schema decision. Hrefs are "#" until destinations are
   decided (/list-your-property exists as the likely primary target).
   Full-bleed navy band = bg-primary. */
export const OwnerCta = () => {
  return (
    <div
      data-slot="owner-cta"
      className="bg-primary text-primary-foreground flex flex-col items-center gap-6 rounded-none px-6 py-16 text-center"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        {/* ownerCta.heading */}
        <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
          Own A Guesthouse Or Executive Stay?
        </h2>
        {/* ownerCta.body */}
        <p className="text-sm text-white/70 md:text-base">
          List your property on Acosa and connect with South Africa&apos;s
          professional corporate travellers.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {/* ownerCta.buttonLabel — primary */}

        <Button asChild variant="secondary">
          <a href="#" className="no-underline">
            List Your Property <ArrowRight aria-hidden="true" />
          </a>
        </Button>

        {/* second button — NO schema field yet (see header comment) */}

        <Button asChild variant="outline">
          <a href="#" className="no-underline">
            Learn About Listing <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  );
};
