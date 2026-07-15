export const PROVINCES = {
  gauteng: "Gauteng",
  "western-cape": "Western Cape",
  "kwazulu-natal": "KwaZulu-Natal",
  "eastern-cape": "Eastern Cape",
  "free-state": "Free State",
  limpopo: "Limpopo",
  mpumalanga: "Mpumalanga",
  "north-west": "North West",
  "northern-cape": "Northern Cape",
} as const;

export type ProvinceSlug = keyof typeof PROVINCES;

export function provinceLabel(slug: string): string {
  return PROVINCES[slug as ProvinceSlug] ?? slug;
}

export const PROVINCE_OPTIONS = Object.entries(PROVINCES).map(
  ([value, label]) => ({ label, value }),
);
