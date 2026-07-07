import type { APIRoute } from 'astro';
import {
  getPublishedProperties,
  getNodes,
  provinceLabel,
  propertyTypeLabel,
} from '../lib/content';

export const prerender = true;

/**
 * Static search index consumed by the client-side search/filter island.
 * Covers spec §8: search by business node, province, property name;
 * filter by essentials, property type, nearby convenience, featured.
 */
export const GET: APIRoute = async () => {
  const [properties, nodes] = await Promise.all([
    getPublishedProperties(),
    getNodes(),
  ]);
  const nodeNames = new Map(nodes.map((n) => [n.id, n.data.name]));

  const index = properties.map((p) => ({
    slug: p.id,
    name: p.data.name,
    url: `/properties/${p.id}`,
    province: p.data.province,
    provinceLabel: provinceLabel(p.data.province),
    node: p.data.businessNode.id,
    nodeLabel: nodeNames.get(p.data.businessNode.id) ?? p.data.businessNode.id,
    propertyType: p.data.propertyType,
    propertyTypeLabel: propertyTypeLabel(p.data.propertyType),
    essentials: p.data.essentials.map((e) => e.id),
    nearbyConvenience: p.data.nearbyConvenience.map((n) => n.id),
    featured: p.data.featured,
    approved: p.data.acosaApproved.approved,
    shortDescription: p.data.shortDescription,
  }));

  return new Response(JSON.stringify({ properties: index }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
