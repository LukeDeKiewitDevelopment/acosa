import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { AcosaImage, type AcosaImageProps } from "./image";
import type { NavItem } from "./header";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type MobileMenuProps = { logo?: AcosaImageProps; navItems?: NavItem[] };

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
              <a href="/">
                <AcosaImage
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  widths={logo.widths}
                  sizes={logo.sizes}
                  format={logo.format}
                  className=""
                />
              </a>
            ) : (
              <a href="/">Acosa</a>
            )}
          </SheetTitle>
        </SheetHeader>
        <ul className="mx-4 my-2 flex flex-col gap-2">
          {navItems &&
            navItems.length > 0 &&
            navItems?.map((navItem, i) => (
              <li key={i}>
                {navItem.subItems && navItem.subItems.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs">
                        {navItem.label}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="start">
                      <DropdownMenuGroup>
                        {navItem.subItems.map((subItem, i) => (
                          <DropdownMenuItem key={i}>
                            <a
                              href={subItem.href}
                              className="text-sm no-underline"
                            >
                              {subItem.label}
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
