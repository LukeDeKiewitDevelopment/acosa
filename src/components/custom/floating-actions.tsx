import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import clsx from "clsx";
import { ArrowUp, MessageCircle } from "lucide-react";

export type FloatingActionsProps = {
  whatsappHref?: string;
  whatsappLabel?: string;
};

/* Navy rather than gold: this control sits on every page, and gold is kept
   for each section's primary action (Creative Direction Blueprint §4).
   Same Lucide icon as every other WhatsApp action on the site. On small
   screens it appears once the visitor scrolls past the hero, so it never
   sits on top of the hero's full-width buttons. */
export const FloatingActions = ({
  whatsappHref,
  whatsappLabel,
}: FloatingActionsProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [backToTopOverNavy, setBackToTopOverNavy] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showBackToTop = scrollY > 600;
  const pastHero = scrollY > 480;
  const isExternal = Boolean(whatsappHref?.startsWith("http"));

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-2 md:right-6 md:bottom-6">
      <Button
        data-slot="back-to-top"
        size="icon-lg"
        variant="outline"
        disabled={!showBackToTop}
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onPointerMove={(event) => {
          const { clientX, clientY } = event;
          const overNavy = Array.from(
            document.querySelectorAll<HTMLElement>(".surface-navy"),
          ).some((section) => {
            const rect = section.getBoundingClientRect();
            return (
              clientX >= rect.left &&
              clientX <= rect.right &&
              clientY >= rect.top &&
              clientY <= rect.bottom
            );
          });
          setBackToTopOverNavy(overNavy);
        }}
        onPointerLeave={() => setBackToTopOverNavy(false)}
        className={clsx(
          "bg-card size-11 shadow-md shadow-black/10 transition-opacity duration-200 md:size-12",
          backToTopOverNavy &&
            "hover:border-transparent! hover:bg-transparent! hover:text-white! hover:shadow-none!",
          !showBackToTop && "pointer-events-none opacity-0!",
        )}
      >
        <ArrowUp className="size-5" />
        <span className="sr-only">Scroll back to top</span>
      </Button>
      {whatsappHref && (
        <Button
          data-slot="floating-whatsapp"
          size="icon-lg"
          variant="secondary"
          className={clsx(
            "size-11 shadow-md shadow-black/20 transition-opacity duration-200 md:size-12",
            !pastHero && "max-md:pointer-events-none max-md:opacity-0",
          )}
          asChild
        >
          <a
            href={whatsappHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            aria-label={whatsappLabel}
            title={whatsappLabel}
            data-acosa-track="floating_whatsapp_click"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
          </a>
        </Button>
      )}
    </div>
  );
};
