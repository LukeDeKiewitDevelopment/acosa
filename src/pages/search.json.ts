import type { APIRoute } from 'astro';
import {
  getPublishedProperties,
  getNodes,
  getActiveProvinces,
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
  const [properties, nodes, provinces] = await Promise.all([
    getPublishedProperties(),
    getNodes(),
    getActiveProvinces(),
  ]);
  const nodeNames = new Map(nodes.map((n) => [n.id, n.data.name]));

  const propertyIndex = properties.map((p) => ({
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

  const nodeIndex = nodes.map((n) => ({
    slug: n.id,
    name: n.data.name,
    url: `/business-nodes/${n.data.province}/${n.id}`,
    province: n.data.province,
    provinceLabel: provinceLabel(n.data.province),
    featured: n.data.featured,
  }));

  return new Response(
    JSON.stringify({
      properties: propertyIndex,
      nodes: nodeIndex,
      provinces,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
