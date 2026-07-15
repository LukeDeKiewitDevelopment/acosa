import { getCollection, getEntry, getEntries } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { PROVINCES, PROPERTY_TYPES } from '../content.config';
import { provinceLabel } from './provinces';

export { PROVINCES, PROPERTY_TYPES, provinceLabel };
export type Property = CollectionEntry<'properties'>;
export type BusinessNode = CollectionEntry<'businessNodes'>;
export type Testimonial = CollectionEntry<'testimonials'>;

export function propertyTypeLabel(slug: string): string {
  return PROPERTY_TYPES[slug as keyof typeof PROPERTY_TYPES] ?? slug;
}

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

/** All published properties (drafts excluded). Use this everywhere on the public site. */
export async function getPublishedProperties(): Promise<Property[]> {
  return getCollection('properties', ({ data }) => data.published);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return getCollection(
    'properties',
    ({ data }) => data.published && data.featured
  );
}

export async function getPropertiesByNode(nodeId: string): Promise<Property[]> {
  return getCollection(
    'properties',
    ({ data }) => data.published && data.businessNode.id === nodeId
  );
}

export async function getPropertiesByProvince(
  province: string
): Promise<Property[]> {
  return getCollection(
    'properties',
    ({ data }) => data.published && data.province === province
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
  return getCollection('businessNodes', ({ data }) => data.published);
}

export async function getPopularNodes(): Promise<BusinessNode[]> {
  return getCollection(
    'businessNodes',
    ({ data }) => data.published && data.featured
  );
}

export async function getNodesByProvince(
  province: string
): Promise<BusinessNode[]> {
  return getCollection(
    'businessNodes',
    ({ data }) => data.published && data.province === province
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
