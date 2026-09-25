import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StaticAcosaImage, type StaticAcosaImageProps } from "./image";
import { MobileMenu } from "./mobile-menu";

export type HeaderLogo = {
  light: StaticAcosaImageProps;
  dark: StaticAcosaImageProps;
};

export type HeaderProps = {
  logo?: HeaderLogo;
  navItems?: NavItem[];
};
export type NavItem = {
  label: string;
  href: string;
  subItems?: NavSubItem[];
};
export type NavSubItem = {
  label: string;
  href: string;
};

export const Header = ({ logo, navItems }: HeaderProps) => {
  return (
    <header
      data-slot="header"
      className="bg-card text-card-foreground sticky top-0 left-0 z-50 max-w-screen px-4 py-2 shadow-md shadow-black/20 md:px-6 md:py-2.5 lg:px-8 lg:py-3"
    >
      <div
        data-slot="header-content"
        className="flex items-center justify-between gap-4"
      >
        {logo ? (
          <a href="/">
            <StaticAcosaImage
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              className="h-10 w-auto object-contain"
              {...logo.light}
            />
          </a>
        ) : (
          <a href="/">ACOSA</a>
        )}
        <nav data-slot="header-navigation">
          <ul className="hidden items-center gap-2 lg:flex">
            {navItems &&
              navItems.length > 0 &&
              navItems?.map((navItem, i) => (
                <li key={i}>
                  {navItem.subItems && navItem.subItems.length > 0 ? (
                    <div className="border-border/70 flex items-center overflow-hidden rounded-full border bg-transparent">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        type="button"
                        className="hover:bg-muted/80 rounded-none border-0 px-3 text-xs"
                      >
                        <a href={navItem.href} className="text-xs no-underline">
                          {navItem.label}
                        </a>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="border-border/70 hover:bg-muted/80 h-8 rounded-none border-0 border-l px-2 text-xs"
                            aria-label={`Open ${navItem.label} submenu`}
                          >
                            <ChevronDown className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuItem key={`${navItem.href}-all`}>
                              <a
                                href={navItem.href}
                                className="w-full text-sm no-underline"
                              >
                                View all {navItem.label}
                              </a>
                            </DropdownMenuItem>
                            {navItem.subItems.map((subItem) => (
                              <DropdownMenuItem key={subItem.href}>
                                <a
                                  href={subItem.href}
                                  className="w-full text-sm no-underline"
                                >
                                  {subItem.label}
                                </a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
        </nav>
        <div data-slot="header-actions" className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            asChild
            className="hidden lg:inline-flex"
          >
            <a href="/business-nodes" className="text-xs no-underline">
              Find Accommodation
            </a>
          </Button>
          <MobileMenu navItems={navItems} logo={logo} />
        </div>
      </div>
    </header>
  );
};
