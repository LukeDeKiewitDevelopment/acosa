import {
  siFacebook,
  siInstagram,
  siPinterest,
  siTiktok,
  siX,
  siYoutube,
} from "simple-icons";
import { getCurrentYear } from "@/lib/get-current-year";
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
  label: string; // from Keystatic: e.g. "LinkedIn", "Instagram"
  url: string; // from Keystatic: the full URL
};


const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.605 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 0 22.222 0h.003z";
// simple-icons dropped LinkedIn's mark at LinkedIn's request, so it has no
// export here — links to it fall back to the text label below.
const SIMPLE_ICONS: Record<string, { path: string; title: string }> = {
  linkedin: { path: LINKEDIN_PATH, title: "LinkedIn" },
  facebook: { path: siFacebook.path, title: siFacebook.title },
  instagram: { path: siInstagram.path, title: siInstagram.title },
  x: { path: siX.path, title: siX.title },
  youtube: { path: siYoutube.path, title: siYoutube.title },
  tiktok: { path: siTiktok.path, title: siTiktok.title },
  pinterest: { path: siPinterest.path, title: siPinterest.title },
};

/** Resolves a Keystatic social link to a simple-icons slug, matching on the
 *  label first and falling back to the URL's hostname. Returns null when the
 *  platform isn't in SIMPLE_ICONS (e.g. LinkedIn). */
function resolveSocialSlug(label: string, url: string): string | null {
  const normalisedLabel = label.toLowerCase();
  const hostname = (() => {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return "";
    }
  })();

  const slugs = Object.keys(SIMPLE_ICONS);
  return (
    slugs.find((slug) => normalisedLabel.includes(slug)) ??
    slugs.find((slug) => hostname.includes(slug)) ??
    null
  );
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
              <StaticAcosaImage
                {...logo.dark}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
            </a>
          ) : (
            <a href="/">Acosa</a>
          )}

          {description && <p className="max-w-prose text-xs">{description}</p>}
          <small className="text-[0.6rem]">
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

          {socials && socials.length > 0 && (
            <nav data-slot="footer-links-socials" className="flex flex-col">
              <h5 className="my-4 text-sm">Socials</h5>
              <ul className="flex flex-row flex-wrap gap-4">
                {socials.map((social) => {
                  const slug = resolveSocialSlug(social.label, social.url);
                  const icon = slug ? SIMPLE_ICONS[slug] : null;
                  return (
                    <li key={social.url}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="opacity-80 transition-opacity hover:opacity-100"
                      >
                        {icon ? (
                          <svg
                            role="img"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="size-5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d={icon.path} />
                          </svg>
                        ) : (
                          <span className="text-xs">{social.label}</span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
};
