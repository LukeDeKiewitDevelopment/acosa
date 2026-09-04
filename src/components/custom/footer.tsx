import {
  siFacebook,
  siInstagram,
  siPinterest,
  siTiktok,
  siX,
  siYoutube,
} from "simple-icons";
import { getCurrentYear } from "@/lib/get-current-year";
import type { NavItem } from "./header";
import { StaticAcosaImage, type StaticAcosaImageProps } from "./image";
import { Mail, MessageCircle } from "lucide-react";

export type FooterProps = {
  logo?: HeaderLogo;
  description?: string;
  footerItems?: NavItem[];
  socials?: FooterSocial[];
  email?: string;
  emailHref?: string;
  whatsappHref?: string;
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
  socials,
  emailHref,
  whatsappHref,
}: FooterProps) => {
  const currentYear = getCurrentYear();
  return (
    <footer className="not-dark:bg-primary not-dark:text-primary-foreground dark:bg-card dark:text-card-foreground w-full max-w-screen px-8 py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <div
          data-slot="footer-info"
          className="flex w-full flex-col gap-8 md:w-[30%]"
        >
          {logo ? (
            <a href="/" className="w-fit">
              <StaticAcosaImage
                {...logo.dark}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
            </a>
          ) : (
            <a href="/">Acosa</a>
          )}

          {description && <p className="max-w-prose text-xs">{description}</p>}

          {socials && socials.length > 0 && (
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
          )}

          <small className="text-[0.6rem]">
            &copy; {currentYear} ACOSA. All rights reserved.
          </small>
        </div>
        <div
          data-slot="footer-links"
          className="grid w-full grid-cols-2 gap-8 md:w-[70%] sm:grid-cols-3 lg:grid-cols-5"
        >
          <nav data-slot="footer-links-explore">
            <h5 className="my-4 text-sm">Explore</h5>
            <ul className="flex flex-col gap-4 text-xs">
              <li>
                <a href="/business-nodes" className="no-underline hover:underline">
                  Business Nodes
                </a>
              </li>
              <li>
                <a href="/properties" className="no-underline hover:underline">
                  Properties
                </a>
              </li>
              <li>
                <a href="/why-acosa" className="no-underline hover:underline">
                  Why ACOSA?
                </a>
              </li>
            </ul>
          </nav>

          <nav data-slot="footer-links-for-companies">
            <h5 className="my-4 text-sm">For Companies</h5>
            <ul className="flex flex-col gap-4 text-xs">
              <li>
                <a href="/for-companies" className="no-underline hover:underline">
                  Corporate Accommodation
                </a>
              </li>
              <li>
                <a href="/business-nodes" className="no-underline hover:underline">
                  Find Accommodation
                </a>
              </li>
              <li>
                <a href="/contact" className="no-underline hover:underline">
                  Contact ACOSA
                </a>
              </li>
            </ul>
          </nav>

          <nav data-slot="footer-links-for-properties">
            <h5 className="my-4 text-sm">For Properties</h5>
            <ul className="flex flex-col gap-4 text-xs">
              <li>
                <a href="/list-your-property#why-list" className="no-underline hover:underline">
                  Why List with ACOSA?
                </a>
              </li>
              <li>
                <a href="/list-your-property#whats-included" className="no-underline hover:underline">
                  What's Included
                </a>
              </li>
              <li>
                <a href="/list-your-property#pricing" className="no-underline hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/list-your-property#apply" className="no-underline hover:underline">
                  Apply to List
                </a>
              </li>
            </ul>
          </nav>

          <nav data-slot="footer-links-contact">
            <h5 className="my-4 text-sm">Contact</h5>
            <ul className="flex flex-col gap-4 text-xs">
              {emailHref && (
                <li>
                  <a
                    href={emailHref}
                    className="inline-flex items-center gap-2 no-underline hover:underline"
                  >
                    <Mail className="size-3" aria-hidden="true" />
                    Email ACOSA
                  </a>
                </li>
              )}
              {whatsappHref && (
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 no-underline hover:underline"
                  >
                    <MessageCircle className="size-3" aria-hidden="true" />
                    WhatsApp ACOSA
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <nav data-slot="footer-links-legal">
            <h5 className="my-4 text-sm">Legal</h5>
            <ul className="flex flex-col gap-4 text-xs">
              <li>
                <a href="/terms" className="no-underline hover:underline">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="no-underline hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
