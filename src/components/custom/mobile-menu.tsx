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
import type { HeaderLogo, NavItem } from "./header";
import { ThemeToggle } from "./theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type MobileMenuProps = { logo?: HeaderLogo; navItems?: NavItem[] };

export const MobileMenu = ({ logo, navItems }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="flex lg:hidden">
        <Button variant="ghost" size="icon-sm">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            {logo ? (
              <>
                <StaticAcosaImage
                  {...logo.light}
                  className="h-8 w-auto dark:hidden"
                />
                <StaticAcosaImage
                  {...logo.dark}
                  className="hidden h-8 w-auto dark:block"
                />
              </>
            ) : (
              <span>Acosa</span>
            )}
          </SheetTitle>
        </SheetHeader>
        <ul className="mx-4 my-2 flex scrollbar-thin flex-col gap-2 overflow-y-auto pr-2">
          <li>
            <Button variant="ghost" size="sm" asChild>
              <a href="/" className="text-xs no-underline">
                Home
              </a>
            </Button>
          </li>
          {navItems &&
            navItems.length > 0 &&
            navItems?.map((navItem, i) => (
              <li key={i}>
                {navItem.subItems && navItem.subItems.length > 0 ? (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full border-0"
                  >
                    <AccordionItem
                      value={navItem.label}
                      className="border-b-0 data-open:bg-transparent"
                    >
                      <AccordionTrigger className="hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-8 w-full items-center justify-between gap-1 rounded-4xl p-0 px-3 py-0 font-sans text-xs font-medium! whitespace-nowrap transition-all outline-none hover:no-underline">
                        {navItem.label}
                      </AccordionTrigger>
                      <AccordionContent className="px-0 py-1 [&_a]:no-underline">
                        <ul className="flex flex-col gap-2 ps-3">
                          {navItem.subItems.map((subItem, i) => (
                            <li key={i}>
                              <a
                                href={subItem.href}
                                className="text-xs hover:underline"
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
                  <Button variant="ghost" size="sm" asChild>
                    <a href={navItem.href} className="text-xs no-underline">
                      {navItem.label}
                    </a>
                  </Button>
                )}
              </li>
            ))}
        </ul>
        <SheetFooter>
          <ThemeToggle className="ml-auto" />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
