import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AcosaImage, type AcosaImageProps } from "./image";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

export type HeaderProps = {
  logo?: AcosaImageProps;
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
      className="bg-card text-card-foreground sticky top-0 left-0 z-50 border-b-2 px-4 py-2 md:px-6 lg:px-8"
    >
      <div
        data-slot="header-content"
        className="flex items-center justify-between gap-4"
      >
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
        <nav data-slot="header-navigation">
          <ul className="hidden items-center gap-2 lg:flex">
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
                          {navItem.subItems.map((subItem) => (
                            <DropdownMenuItem key={subItem.href}>
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
        </nav>
        <div data-slot="header-actions" className="flex items-center gap-2">
          <ThemeToggle className="hidden lg:inline-flex" />
          <MobileMenu navItems={navItems} logo={logo} />
        </div>
      </div>
    </header>
  );
};
