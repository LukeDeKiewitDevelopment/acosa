import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { StaticAcosaImage, type StaticAcosaImageProps } from "./image";
import { MobileMenu } from "./mobile-menu";

export type HeaderLogo = {
  light: StaticAcosaImageProps;
  dark: StaticAcosaImageProps;
};

export type HeaderProps = {
  logo?: HeaderLogo;
  navItems?: NavItem[];
  currentPath?: string;
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

export function isActivePath(href: string, currentPath = "") {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

const navLinkClassName =
  "relative inline-flex h-10 items-center px-3 text-[0.8125rem] font-medium text-foreground/75 no-underline transition-colors hover:text-foreground focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-ring xl:px-3.5 xl:text-sm";

/* Active page: a short gold rule, one of gold's few selective highlights. */
const activeIndicator =
  "text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-gold";

export const Header = ({ logo, navItems, currentPath }: HeaderProps) => {
  return (
    <header
      data-slot="header"
      className="bg-background/95 supports-backdrop-filter:bg-background/85 border-border sticky top-0 left-0 z-50 w-full border-b backdrop-blur"
    >
      <div
        data-slot="header-content"
        className="container-page flex h-16 items-center justify-between gap-6 lg:h-18"
      >
        <a href="/" aria-label="ACOSA home" className="shrink-0">
          {logo ? (
            <StaticAcosaImage
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="h-9 w-auto object-contain lg:h-10"
              {...logo.light}
            />
          ) : (
            <span className="font-heading text-xl font-bold">ACOSA</span>
          )}
        </a>
        <nav data-slot="header-navigation" aria-label="Main">
          <ul className="hidden items-center xl:flex">
            {navItems?.map((navItem) => {
              const active = isActivePath(navItem.href, currentPath);
              return (
                <li key={navItem.href}>
                  {navItem.subItems && navItem.subItems.length > 0 ? (
                    <div className="flex items-center">
                      <a
                        href={navItem.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          navLinkClassName,
                          "pr-0.5 xl:pr-0.5",
                          active && activeIndicator,
                        )}
                      >
                        {navItem.label}
                      </a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            type="button"
                            className="text-foreground/60 hover:text-foreground mr-1 size-6"
                            aria-label={`Open ${navItem.label} menu`}
                          >
                            <ChevronDown className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60" align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                              <a
                                href={navItem.href}
                                className="w-full text-sm font-medium no-underline"
                              >
                                View all {navItem.label}
                              </a>
                            </DropdownMenuItem>
                            {navItem.subItems.map((subItem) => (
                              <DropdownMenuItem key={subItem.href} asChild>
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
                    <a
                      href={navItem.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        navLinkClassName,
                        active && activeIndicator,
                      )}
                    >
                      {navItem.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div data-slot="header-actions" className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <a
              href="/business-nodes"
              data-acosa-track="header_find_accommodation"
            >
              Find Accommodation
            </a>
          </Button>
          <MobileMenu
            navItems={navItems}
            logo={logo}
            currentPath={currentPath}
          />
        </div>
      </div>
    </header>
  );
};
