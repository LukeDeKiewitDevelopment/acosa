import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export type HeaderProps = {
  logo?: string;
  logoAlt?: string;
  logoDark?: string;
  logoDarkAlt?: string;
  navItems?: NavItem[];
};
export type NavItem = {
  label?: string;
  href?: string;
  subItems?: NavSubItem[];
};
export type NavSubItem = {
  categoryName?: string;
  categoryHref?: string;
  items?: NavItem[];
};

export const Header = ({
  logo,
  logoAlt,
  logoDark,
  logoDarkAlt,
  navItems,
  ...props
}: HeaderProps) => {
  return (
    <header
      data-slot="header"
      className="bg-card text-card-foreground sticky top-0 left-0 z-50 border-b-2 px-4 py-2 md:px-6 lg:px-8"
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        {navItems && (
          <ul className="flex items-center gap-2">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.subItems && item.subItems.length > 0 && (
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-96">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <a
                                  href={subItem.categoryHref}
                                  className="no-underline"
                                >
                                  {subItem.categoryName}
                                </a>
                                {subItem.items && subItem.items.length > 0 && (
                                  <ul>
                                    {subItem.items.map((node, nodeIndex) => (
                                      <li key={nodeIndex}>
                                        <a
                                          href={node.href}
                                          className="no-underline"
                                        >
                                          {node.label}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                )}
                {item.href && item.label && !item.subItems && (
                  <Button variant="ghost" asChild>
                    <a className="no-underline" href={item.href}>
                      {item.label}
                    </a>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
};
