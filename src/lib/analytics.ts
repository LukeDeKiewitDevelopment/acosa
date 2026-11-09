/** Returns the trimmed GA4 measurement ID when it is a valid G- ID, otherwise "". */
export function getGaMeasurementId(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const id = raw.trim();
  return /^G-[A-Z0-9]{4,}$/.test(id) ? id : "";
}
