import { Button } from "../ui/button";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import type { NavItem } from "./header";
import { StaticAcosaImage, type StaticAcosaImageProps } from "./image";

export type FooterProps = {
  logo?: HeaderLogo;
  description?: string;
  footerItems?: NavItem[];
  socials?: FooterSocial[];
};

export type HeaderLogo = {
  light: StaticAcosaImageProps;
  dark: StaticAcosaImageProps;
};

export type FooterSocial = {
  type: "instagram" | "facebook" | "x" | "linkedin";
  href?: string;
};

function getCurrentYear() {
  return new Date().getFullYear();
}

export const Footer = ({
  logo,
  description,
  footerItems,
  socials,
}: FooterProps) => {
  const currentYear = getCurrentYear();
  return (
    <footer className="not-dark:bg-primary not-dark:text-primary-foreground dark:bg-card dark:text-card-foreground w-full max-w-screen px-8 py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <div
          data-slot="footer-info"
          className="flex w-full flex-col gap-8 md:w-[35%]"
        >
          {logo ? (
            <a href="/" className="w-fit">
              {/* <StaticAcosaImage
                {...logo.light}
                className="h-22 w-auto"
              /> */}
              <StaticAcosaImage {...logo.dark} className="h-22 w-auto" />
            </a>
          ) : (
            <a href="/">Acosa</a>
          )}

          {description && <p className="max-w-prose text-xs">{description}</p>}
          <small className="text-xs font-semibold">
            &copy; {currentYear} ACOSA. Work in Progress.
          </small>
        </div>
        <div
          data-slot="footer-links"
          className="grid w-full grid-cols-1 gap-4 md:w-[65%] md:grid-cols-3"
        >
          <nav data-slot="footer-links-platform">
            <h5 className="my-4 text-sm">Platform</h5>
            <ul className="flex flex-col gap-4 text-xs">
              <li>
                <a href="/" className="no-underline">
                  Home
                </a>
              </li>
              {footerItems &&
                footerItems.length > 0 &&
                footerItems.map((footerItem, i) => {
                  if (!footerItem.subItems) {
                    return (
                      <li key={i}>
                        <a
                          href={footerItem.href}
                          className="text-xs no-underline hover:underline"
                        >
                          {footerItem.label}
                        </a>
                      </li>
                    );
                  }
                })}
            </ul>
          </nav>

          {footerItems &&
            footerItems.length > 0 &&
            footerItems.map((footerItem, i) => {
              if (
                footerItem.label === "Business Nodes" &&
                footerItem.subItems &&
                footerItem.subItems.length > 0
              ) {
                return (
                  <nav
                    data-slot="footer-links-nodes"
                    className="flex flex-col"
                    key={i}
                  >
                    <h5 className="my-4 text-sm">Business Nodes</h5>
                    <ul className="flex flex-col gap-4 text-xs">
                      {footerItem.subItems.map((subItem, i) => (
                        <li key={i}>
                          <a
                            href={subItem.href}
                            className="no-underline hover:underline"
                          >
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                );
              }
            })}

          <nav data-slot="footer-links-socials" className="flex flex-col">
            <h5 className="my-4 text-sm">Socials</h5>
            <ul className="flex flex-col gap-4 text-xs">
              <li>LinkedIn</li>
              <li>Facebook</li>
              <li>LinkedIn</li>
              <li>Instagram</li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
