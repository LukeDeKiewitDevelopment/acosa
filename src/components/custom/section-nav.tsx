// CLIENT ISLAND — mount with client:load (scroll tracking needs JS).
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SectionNavItem = { id: string; label: string };

/* Sticky in-page navigation for long pages: highlights the section in view
   and shows reading progress. Plain anchor links, so it works without JS. */
export const SectionNav = ({ items }: { items: SectionNavItem[] }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the active link visible in the horizontally scrolling strip (mobile).
  useEffect(() => {
    const list = listRef.current;
    const link = activeId
      ? list?.querySelector<HTMLElement>(`a[href="#${activeId}"]`)
      : null;
    if (list && link) list.scrollTo({ left: link.offsetLeft - 16 });
  }, [activeId]);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="bg-background/90 supports-backdrop-filter:bg-background/80 border-border sticky top-16 z-30 border-b backdrop-blur lg:top-18"
    >
      <div className="container-page">
        <ul
          ref={listRef}
          className="relative -mx-1 flex [scrollbar-width:none] gap-1 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "focus-visible:outline-ring inline-flex h-9 items-center rounded-lg px-3 text-[0.8125rem] font-medium whitespace-nowrap no-underline transition-colors focus-visible:outline-2",
                    active
                      ? "bg-navy text-white"
                      : "text-foreground/70 hover:bg-foreground/[0.06] hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <span
        aria-hidden="true"
        className="bg-gold absolute bottom-0 left-0 h-0.5 origin-left"
        style={{ width: "100%", transform: `scaleX(${progress})` }}
      />
    </nav>
  );
};
