import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { StaticAcosaImage } from "./image";
import { isActivePath, type HeaderLogo, type NavItem } from "./header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getCurrentYear } from "@/lib/get-current-year";

export type MobileMenuProps = {
  logo?: HeaderLogo;
  navItems?: NavItem[];
  currentPath?: string;
};

const itemClassName =
  "flex h-12 w-full items-center border-b border-border text-base font-medium text-foreground no-underline";

export const MobileMenu = ({
  logo,
  navItems,
  currentPath,
}: MobileMenuProps) => {
  const currentYear = getCurrentYear();
  return (
    <Sheet>
      <SheetTrigger asChild className="flex xl:hidden">
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-background w-[min(22rem,88vw)]">
        <SheetHeader className="px-5">
          <SheetTitle>
            <a href="/" aria-label="ACOSA home" className="inline-flex">
              {logo ? (
                <StaticAcosaImage
                  loading="lazy"
                  {...logo.light}
                  className="h-9 w-auto"
                />
              ) : (
                <span>ACOSA</span>
              )}
            </a>
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5">
          <ul className="flex flex-col">
            {navItems?.map((navItem) => {
              const active = isActivePath(navItem.href, currentPath);
              return (
                <li key={navItem.href}>
                  {navItem.subItems && navItem.subItems.length > 0 ? (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full rounded-none border-0"
                    >
                      <AccordionItem
                        value={navItem.label}
                        className="border-border border-b"
                      >
                        <AccordionTrigger className="h-12 items-center py-0 font-sans text-base font-medium hover:no-underline">
                          {navItem.label}
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 [&_a]:no-underline">
                          <ul className="flex flex-col gap-3 ps-3">
                            <li>
                              <a
                                href={navItem.href}
                                className="text-sm font-medium"
                              >
                                View all {navItem.label}
                              </a>
                            </li>
                            {navItem.subItems.map((subItem) => (
                              <li key={subItem.href}>
                                <a
                                  href={subItem.href}
                                  className="text-muted-foreground text-sm"
                                >
                                  {subItem.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <a
                      href={navItem.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(itemClassName, active && "text-gold-ink")}
                    >
                      {navItem.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <SheetFooter className="gap-4 px-5 pb-6">
          <Button variant="default" size="lg" asChild className="w-full">
            <a
              href="/business-nodes"
              data-acosa-track="menu_find_accommodation"
            >
              Find Accommodation
            </a>
          </Button>
          <small className="text-muted-foreground text-xs">
            &copy; {currentYear} ACOSA.
          </small>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
