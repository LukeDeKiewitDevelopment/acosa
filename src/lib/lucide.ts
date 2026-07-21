import { icons, type LucideIcon } from "lucide-react";

export function resolveIcon(name: string, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback;
  const pascalName = name
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return icons[pascalName as keyof typeof icons] ?? fallback;
}
