export type PropertySearchFields = {
  name: string;
  propertyTypeLabel: string;
  provinceLabel: string;
  businessNode: string;
  businessNodeLabel: string;
  locationAddress: string;
};

function normalizeSearchText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function matchesPropertySearchQuery(
  item: PropertySearchFields,
  query: string,
): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  return [
    item.name,
    item.propertyTypeLabel,
    item.provinceLabel,
    item.businessNode,
    item.businessNodeLabel,
    item.locationAddress,
  ].some((value) => normalizeSearchText(value).includes(normalizedQuery));
}