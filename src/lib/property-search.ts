export type PropertySearchFields = {
  name: string;
  propertyTypeLabel: string;
  provinceLabel: string;
  businessNode: string;
  businessNodeLabel: string;
  locationAddress: string;
};

export function matchesPropertySearchQuery(
  item: PropertySearchFields,
  query: string,
): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;

  return [
    item.name,
    item.propertyTypeLabel,
    item.provinceLabel,
    item.businessNode,
    item.businessNodeLabel,
    item.locationAddress,
  ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
}