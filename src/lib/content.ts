import { getCollection, getEntry, getEntries } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { getImage } from "astro:assets";
import { PROPERTY_TYPES } from "../content.config";
import { provinceLabel } from "./provinces";
import type { PropertyCardItem } from "@/components/custom/property-card";

export { PROVINCES, PROPERTY_TYPES } from "../content.config";
export { provinceLabel } from "./provinces";
export type Property = CollectionEntry<"properties">;
export type BusinessNode = CollectionEntry<"businessNodes">;
export type Testimonial = CollectionEntry<"testimonials">;

export const PUBLIC_BUSINESS_NODE_IDS = [
  "centurion",
  "pretoria-east",
  "rosslyn",
  "sandton",
  "bryanston",
  "midrand",
  "edenvale",
] as const;

export function isPublicBusinessNode(nodeId: string): boolean {
  return PUBLIC_BUSINESS_NODE_IDS.includes(
    nodeId as (typeof PUBLIC_BUSINESS_NODE_IDS)[number],
  );
}

export function propertyTypeLabel(slug: string): string {
  return PROPERTY_TYPES[slug as keyof typeof PROPERTY_TYPES] ?? slug;
}

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

/** All published properties (drafts excluded). Use this everywhere on the public site. */
export async function getPublishedProperties(): Promise<Property[]> {
  return getCollection(
    "properties",
    ({ data }) =>
      data.published &&
      data.acosaApproved.approved &&
      isPublicBusinessNode(data.businessNode.id),
  );
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return getCollection(
    "properties",
    ({ data }) =>
      data.published &&
      data.acosaApproved.approved &&
      data.featured &&
      isPublicBusinessNode(data.businessNode.id),
  );
}

export async function getPropertiesByNode(nodeId: string): Promise<Property[]> {
  return getCollection(
    "properties",
    ({ data }) =>
      data.published &&
      data.acosaApproved.approved &&
      isPublicBusinessNode(data.businessNode.id) &&
      data.businessNode.id === nodeId,
  );
}

export async function getPropertiesByProvince(
  province: string,
): Promise<Property[]> {
  return getCollection(
    "properties",
    ({ data }) =>
      data.published &&
      data.acosaApproved.approved &&
      isPublicBusinessNode(data.businessNode.id) &&
      data.province === province,
  );
}

/** Resolve a property's tag references into full entries (name + icon). */
export async function resolvePropertyTags(property: Property) {
  const [essentials, facilities, nearbyConvenience, perfectFor] =
    await Promise.all([
      getEntries(property.data.essentials),
      getEntries(property.data.facilities),
      getEntries(property.data.nearbyConvenience),
      getEntries(property.data.perfectFor),
    ]);
  return { essentials, facilities, nearbyConvenience, perfectFor };
}

export type PropertyListingItem = PropertyCardItem & {
  province: string;
  businessNode: string;
  propertyType: string;
  locationAddress: string;
};

/** Server-side payload for PropertyCard / PropertySearch: resolves the hero
 *  image, business node label and essentials once, for every listing page. */
export async function buildPropertyListingItems(
  properties: Property[],
): Promise<PropertyListingItem[]> {
  return Promise.all(
    properties.map(async (property) => {
      const [img, businessNode, essentials] = await Promise.all([
        getImage({
          src: property.data.heroImage,
          widths: [480, 800, 1200],
          sizes: "(min-width: 768px) 50vw, 100vw",
          format: "webp",
          quality: 75,
        }),
        getEntry(property.data.businessNode),
        getEntries(property.data.essentials),
      ]);
      return {
        id: property.id,
        name: property.data.name,
        province: property.data.province,
        provinceLabel: provinceLabel(property.data.province),
        businessNode: property.data.businessNode.id,
        businessNodeLabel:
          businessNode?.data.name ?? property.data.businessNode.id,
        locationAddress: property.data.location.address,
        propertyType: property.data.propertyType,
        propertyTypeLabel: propertyTypeLabel(property.data.propertyType),
        approved: property.data.acosaApproved.approved,
        shortDescription: property.data.shortDescription,
        essentials: essentials.map((tag) => ({
          name: tag.data.name,
          icon: tag.data.icon,
        })),
        image: {
          src: img.src,
          srcSet: img.srcSet.attribute || undefined,
          sizes: img.attributes.sizes,
          width: img.attributes.width,
          height: img.attributes.height,
        },
        imageAlt: property.data.imageAlt || property.data.name,
      };
    }),
  );
}

// ---------------------------------------------------------------------------
// Business nodes
// ---------------------------------------------------------------------------

export async function getNodes(): Promise<BusinessNode[]> {
  return getCollection(
    "businessNodes",
    (entry) =>
      entry.data.published &&
      PUBLIC_BUSINESS_NODE_IDS.includes(
        entry.id as (typeof PUBLIC_BUSINESS_NODE_IDS)[number],
      ),
  );
}

export async function getPopularNodes(): Promise<BusinessNode[]> {
  return getCollection(
    "businessNodes",
    (entry) =>
      entry.data.published &&
      entry.data.featured &&
      isPublicBusinessNode(entry.id),
  );
}

export async function getNodesByProvince(
  province: string,
): Promise<BusinessNode[]> {
  return getCollection(
    "businessNodes",
    (entry) =>
      entry.data.published &&
      isPublicBusinessNode(entry.id) &&
      entry.data.province === province,
  );
}

/** Marker positions for the Gauteng node map (longitude, latitude). */
export const NODE_MAP_COORDINATES: Record<string, [number, number]> = {
  bryanston: [28.0227, -26.0575],
  sandton: [28.0567, -26.1076],
  edenvale: [28.1525, -26.1438],
  midrand: [28.1284, -25.9895],
  "pretoria-east": [28.327, -25.776],
  centurion: [28.1894, -25.8603],
  rosslyn: [28.1, -25.633],
};

export type NodeSummary = {
  id: string;
  name: string;
  city: string;
  province: string;
  href: string;
  propertyCount: number;
  longitude?: number;
  latitude?: number;
  image: {
    src: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
  };
  imageAlt: string;
};

/** Published nodes with their live-property counts, for node choosers. */
export async function buildNodeSummaries(
  province = "gauteng",
): Promise<NodeSummary[]> {
  const [nodes, properties] = await Promise.all([
    getNodesByProvince(province),
    getPublishedProperties(),
  ]);
  const summaries = await Promise.all(
    nodes.map(async (node) => {
      const img = await getImage({
        src: node.data.heroImage,
        widths: [160, 400, 800],
        sizes: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
        format: "webp",
        quality: 75,
      });
      const coordinates = NODE_MAP_COORDINATES[node.id];
      return {
        id: node.id,
        name: node.data.name,
        city: node.data.city || "",
        province: node.data.province,
        href: `/business-nodes/${node.data.province}/${node.id}`,
        propertyCount: properties.filter(
          (property) => property.data.businessNode.id === node.id,
        ).length,
        longitude: coordinates?.[0],
        latitude: coordinates?.[1],
        image: {
          src: img.src,
          srcSet: img.srcSet.attribute || undefined,
          sizes: img.attributes.sizes,
          width: img.attributes.width,
          height: img.attributes.height,
        },
        imageAlt: node.data.imageAlt || `${node.data.name} business district`,
      };
    }),
  );
  // Nodes with live accommodation first, then alphabetical.
  return summaries.sort(
    (a, b) =>
      Number(b.propertyCount > 0) - Number(a.propertyCount > 0) ||
      a.name.localeCompare(b.name),
  );
}

export async function getActiveProvinces(): Promise<
  { slug: string; label: string; nodeCount: number }[]
> {
  const nodes = await getNodes();
  const counts = new Map<string, number>();
  for (const node of nodes) {
    counts.set(node.data.province, (counts.get(node.data.province) ?? 0) + 1);
  }
  return [...counts.entries()].map(([slug, nodeCount]) => ({
    slug,
    label: provinceLabel(slug),
    nodeCount,
  }));
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  return getCollection("testimonials", ({ data }) => data.published);
}

export async function getTestimonialsForProperty(
  propertyId: string,
): Promise<Testimonial[]> {
  return getCollection(
    "testimonials",
    ({ data }) => data.published && data.property?.id === propertyId,
  );
}

/** Testimonials not linked to any property (general / property-owner reviews). */
export async function getGeneralTestimonials(): Promise<Testimonial[]> {
  return getCollection(
    "testimonials",
    ({ data }) => data.published && !data.property,
  );
}

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

export async function getSiteSettings() {
  const settings = await getEntry("siteSettings", "site");
  if (!settings)
    throw new Error("Site settings not found: src/content/settings/site.yaml");
  return settings;
}

export async function getHomePage() {
  const page = await getEntry("homePage", "home");
  if (!page) throw new Error("Home page content not found");
  return page;
}

// ---------------------------------------------------------------------------
// WhatsApp
// ---------------------------------------------------------------------------

/** Build a wa.me link. Number must be international format digits only, e.g. 27125550181. */
export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoLink(
  email: string,
  subject: string,
  body?: string,
): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${email}?${params.toString()}`;
}

export function isConfiguredContactValue(value: string): boolean {
  return value.trim().length > 0 && !value.includes("[INSERT");
}

export function resolveCtaLink(
  link: string,
  options: {
    email: string;
    emailSubject?: string;
    emailBody?: string;
    whatsappNumber?: string;
    whatsappMessage?: string;
  },
): string {
  if (link === "email") {
    if (!isConfiguredContactValue(options.email)) return "/contact";
    return mailtoLink(
      options.email,
      options.emailSubject ?? "General ACOSA Enquiry",
      options.emailBody,
    );
  }
  if (link === "whatsapp") {
    const whatsappNumber = options.whatsappNumber ?? "";
    if (!isConfiguredContactValue(whatsappNumber)) return "/contact";
    return whatsappLink(whatsappNumber, options.whatsappMessage);
  }
  return link;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi ACOSA, I'm looking for business accommodation and would appreciate some assistance.";

export const LISTING_WHATSAPP_MESSAGE =
  "Hi ACOSA, I'm interested in listing my property and would like some more information.";

export const PROPERTY_APPLICATION_EMAIL_SUBJECT =
  "ACOSA | Property Listing Application Request – [Property Name]";

export const PROPERTY_APPLICATION_EMAIL_BODY = `Hello ACOSA Team,

I am interested in listing my property with ACOSA and would like to request the official property application form.

Property details

Property / Establishment Name:

Property Location (Suburb, City, Province):

Accommodation Type (Guesthouse, Lodge, B&B, etc.):

Number of Guest Rooms / Units:

Website or Social Media Page (if available):

Contact details

Contact Person:

Contact Number:

Email Address:

Please send me the official ACOSA Property Application Form and information about the next steps in the review and onboarding process.

I understand that submitting this enquiry does not constitute an application approval or guarantee acceptance onto the ACOSA platform.

Kind regards,

[Your Name]`;

export const BUSINESS_ACCOMMODATION_EMAIL_SUBJECT =
  "ACOSA | Business Accommodation Enquiry – [Location / Company Name]";

export const BUSINESS_ACCOMMODATION_EMAIL_BODY = `Hello ACOSA Team,

I'm looking for suitable business accommodation and would appreciate assistance identifying relevant options.

1. Accommodation requirements

Preferred location / business node:

Check-in date:

Check-out date:

Number of travellers:

Number of rooms required:

Approximate budget per room, per night:

2. Business travel requirements

Please indicate any essential requirements:

Reliable Wi-Fi and workspace

Secure parking

Backup power

Breakfast

Extended-stay accommodation

Other:

3. Company and contact details

Company name (if applicable):

Contact person:

Contact number:

Email address:

4. Additional information

Please share any specific requirements, preferred proximity to a workplace or project site, or other information that may help ACOSA identify suitable accommodation.

Thank you. I look forward to hearing from you.

Kind regards,

[Your Name]`;
