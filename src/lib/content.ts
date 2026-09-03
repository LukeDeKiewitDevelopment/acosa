import { getCollection, getEntry, getEntries } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import { PROVINCES, PROPERTY_TYPES } from '../content.config';
import { provinceLabel } from './provinces';
import type { BusinessNodeSearchItem } from '@/components/custom/business-node-search';

export { PROVINCES, PROPERTY_TYPES } from '../content.config';
export { provinceLabel } from './provinces';
export type Property = CollectionEntry<'properties'>;
export type BusinessNode = CollectionEntry<'businessNodes'>;
export type Testimonial = CollectionEntry<'testimonials'>;

export const PUBLIC_BUSINESS_NODE_IDS = [
  'centurion',
  'pretoria-east',
  'rosslyn',
  'sandton',
  'bryanston',
  'midrand',
  'edenvale',
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
    'properties',
    ({ data }) =>
      data.published &&
      isPublicBusinessNode(data.businessNode.id),
  );
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return getCollection(
    'properties',
    ({ data }) => data.published && data.featured && isPublicBusinessNode(data.businessNode.id),
  );
}

export async function getPropertiesByNode(nodeId: string): Promise<Property[]> {
  return getCollection(
    'properties',
    ({ data }) =>
      data.published &&
      isPublicBusinessNode(data.businessNode.id) &&
      data.businessNode.id === nodeId,
  );
}

export async function getPropertiesByProvince(
  province: string
): Promise<Property[]> {
  return getCollection(
    'properties',
    ({ data }) =>
      data.published &&
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

// ---------------------------------------------------------------------------
// Business nodes
// ---------------------------------------------------------------------------

export async function getNodes(): Promise<BusinessNode[]> {
  return getCollection(
    'businessNodes',
    (entry) =>
      entry.data.published &&
      PUBLIC_BUSINESS_NODE_IDS.includes(
        entry.id as (typeof PUBLIC_BUSINESS_NODE_IDS)[number],
      ),
  );
}

export async function getPopularNodes(): Promise<BusinessNode[]> {
  return getCollection(
    'businessNodes',
    (entry) =>
      entry.data.published &&
      entry.data.featured &&
      isPublicBusinessNode(entry.id),
  );
}

export async function getNodesByProvince(
  province: string
): Promise<BusinessNode[]> {
  return getCollection(
    'businessNodes',
    (entry) =>
      entry.data.published &&
      isPublicBusinessNode(entry.id) &&
      entry.data.province === province,
  );
}

/** Payload for the BusinessNodeSearch island: every published node with a
 *  pre-resolved hero image plus the names of its published properties. */
export async function buildSearchNodes(): Promise<BusinessNodeSearchItem[]> {
  const [nodes, properties] = await Promise.all([
    getNodes(),
    getPublishedProperties(),
  ]);
  return Promise.all(
    nodes.map(async (node) => {
      const img = await getImage({
        src: node.data.heroImage,
        widths: [400, 800, 1200],
        sizes: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
      });
      return {
        id: node.id,
        name: node.data.name,
        province: node.data.province,
        featured: node.data.featured,
        image: {
          src: img.src,
          srcSet: img.srcSet.attribute || undefined,
          sizes: img.attributes.sizes,
          width: img.attributes.width,
          height: img.attributes.height,
        },
        imageAlt: node.data.imageAlt || node.data.name,
        highlights: node.data.businessHighlights.map((h) => h.title),
        propertyNames: properties
          .filter((p) => p.data.businessNode.id === node.id)
          .map((p) => p.data.name),
      };
    })
  );
}

/** Provinces that actually have at least one business node, for the province selector. */
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
  return getCollection('testimonials', ({ data }) => data.published);
}

export async function getTestimonialsForProperty(
  propertyId: string
): Promise<Testimonial[]> {
  return getCollection(
    'testimonials',
    ({ data }) => data.published && data.property?.id === propertyId
  );
}

/** Testimonials not linked to any property (general / property-owner reviews). */
export async function getGeneralTestimonials(): Promise<Testimonial[]> {
  return getCollection(
    'testimonials',
    ({ data }) => data.published && !data.property
  );
}

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

export async function getSiteSettings() {
  const settings = await getEntry('siteSettings', 'site');
  if (!settings) throw new Error('Site settings not found: src/content/settings/site.yaml');
  return settings;
}

export async function getHomePage() {
  const page = await getEntry('homePage', 'home');
  if (!page) throw new Error('Home page content not found');
  return page;
}

// ---------------------------------------------------------------------------
// WhatsApp
// ---------------------------------------------------------------------------

/** Build a wa.me link. Number must be international format digits only, e.g. 27125550181. */
export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoLink(email: string, subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set('body', body);
  return `mailto:${email}?${params.toString()}`;
}

export function isConfiguredContactValue(value: string): boolean {
  return value.trim().length > 0 && !value.includes('[INSERT');
}

export function resolveCtaLink(
  link: string,
  options: {
    email: string;
    emailSubject?: string;
    whatsappNumber?: string;
    whatsappMessage?: string;
  },
): string {
  if (link === 'email') {
    if (!isConfiguredContactValue(options.email)) return '';
    return mailtoLink(options.email, options.emailSubject ?? 'General ACOSA Enquiry');
  }
  if (link === 'whatsapp' && isConfiguredContactValue(options.whatsappNumber ?? '')) {
    return whatsappLink(options.whatsappNumber, options.whatsappMessage);
  }
  return link;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi ACOSA, I'm looking for business accommodation and would appreciate some assistance.";

export const LISTING_WHATSAPP_MESSAGE =
  "Hi ACOSA, I'm interested in listing my property and would like some more information.";
