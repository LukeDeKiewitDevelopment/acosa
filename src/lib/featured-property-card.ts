export type FeaturedPropertyCardInput = {
  property: {
    id: string;
    data: {
      name: string;
      propertyType: string;
      acosaApproved: { approved: boolean };
      shortDescription: string;
      imageAlt?: string;
    };
  };
  image: {
    src: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
  };
  businessNodeLabel: string;
  propertyTypeLabel: string;
};

export type FeaturedPropertyCard = {
  id: string;
  name: string;
  propertyTypeLabel: string;
  businessNodeLabel: string;
  approved: boolean;
  shortDescription: string;
  image: {
    src: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
  };
  imageAlt: string;
};

export function toFeaturedPropertyCard({
  property,
  image,
  businessNodeLabel,
  propertyTypeLabel,
}: FeaturedPropertyCardInput): FeaturedPropertyCard {
  return {
    id: property.id,
    name: property.data.name,
    propertyTypeLabel,
    businessNodeLabel,
    approved: property.data.acosaApproved.approved,
    shortDescription: property.data.shortDescription,
    image,
    imageAlt: property.data.imageAlt || property.data.name,
  };
}
