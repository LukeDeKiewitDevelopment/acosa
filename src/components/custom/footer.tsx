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

type FooterLink = {
  label: string;
  href: string;
  icon?: "email" | "whatsapp";
  external?: boolean;
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
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: "Explore",
      links: [
        { label: "Business Nodes", href: "/business-nodes" },
        { label: "Properties", href: "/properties" },
        { label: "Why ACOSA?", href: "/why-acosa" },
      ],
    },
    {
      title: "For Companies",
      links: [
        { label: "Corporate Accommodation", href: "/for-companies" },
        { label: "Find Accommodation", href: "/business-nodes" },
        { label: "Contact ACOSA", href: "/contact" },
      ],
    },
    {
      title: "For Properties",
      links: [
        { label: "Why List with ACOSA?", href: "/list-your-property#why-list" },
        {
          label: "What's Included",
          href: "/list-your-property#whats-included",
        },
        { label: "Pricing", href: "/list-your-property#pricing" },
        { label: "Apply to List", href: "/list-your-property#apply" },
      ],
    },
    {
      title: "Contact",
      links: [
        ...(emailHref
          ? [{ label: "Email ACOSA", href: emailHref, icon: "email" as const }]
          : []),
        ...(whatsappHref
          ? [
              {
                label: "WhatsApp ACOSA",
                href: whatsappHref,
                icon: "whatsapp" as const,
                external: whatsappHref.startsWith("http"),
              },
            ]
          : []),
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="surface-navy w-full">
      <div className="container-page grid gap-12 py-16 md:py-20 2xl:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] 2xl:gap-14">
        <div
          data-slot="footer-info"
          className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12 2xl:flex-col 2xl:items-start 2xl:gap-6"
        >
          <a href="/" aria-label="ACOSA home" className="w-fit">
            {logo ? (
              <StaticAcosaImage
                {...logo.dark}
                className="h-12 w-auto object-contain md:h-14"
              />
            ) : (
              <span className="font-heading text-2xl font-bold">ACOSA</span>
            )}
          </a>

          {description && <p className="type-small max-w-sm">{description}</p>}

          {socials && socials.length > 0 && (
            <ul className="flex flex-row flex-wrap gap-3 lg:ml-auto 2xl:ml-0">
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
                      className="border-border text-foreground/80 hover:text-foreground hover:border-foreground/40 inline-flex size-10 items-center justify-center rounded-lg border transition-colors"
                    >
                      {icon ? (
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="size-4 fill-current"
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
        </div>

        <div
          data-slot="footer-links"
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
        >
          {columns.map((column) =>
            column.links.length > 0 ? (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="eyebrow mb-5">{column.title}</h2>
                <ul className="flex flex-col gap-3.5 text-[0.8125rem]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-foreground/80 hover:text-foreground inline-flex items-center gap-2 no-underline transition-colors hover:underline hover:underline-offset-4"
                      >
                        {link.icon === "email" && (
                          <Mail className="size-4" aria-hidden="true" />
                        )}
                        {link.icon === "whatsapp" && (
                          <MessageCircle
                            className="size-4"
                            aria-hidden="true"
                          />
                        )}
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null,
          )}
        </div>
      </div>
      <div className="border-border border-t">
        <div className="container-page text-muted-foreground flex flex-col gap-2 py-6 text-xs sm:flex-row sm:justify-between">
          <small className="text-xs">
            &copy; {currentYear} ACOSA. All rights reserved.
          </small>
          <small className="text-xs">We open doors to amazing places.</small>
        </div>
      </div>
    </footer>
  );
};
