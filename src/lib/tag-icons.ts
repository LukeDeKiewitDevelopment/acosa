import {
  BadgeCheck,
  Bath,
  Briefcase,
  Calendar,
  CalendarDays,
  Car,
  Check,
  Coffee,
  Cross,
  Dumbbell,
  Fuel,
  HardHat,
  Laptop,
  Plane,
  Presentation,
  Shirt,
  ShoppingBag,
  Stethoscope,
  Store,
  Table,
  TrainFront,
  Tv,
  User,
  Users,
  Utensils,
  Waves,
  Wind,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* Icons for the Keystatic tag collections (essentials, facilities, nearby
   convenience, perfect for). Each tag stores a Lucide icon name; this
   explicit map keeps client bundles small. lib/lucide.ts imports the whole
   icon set, so it's server-only. A tag whose icon isn't listed here shows a
   check mark; add it here when a new icon is used in the CMS. */
const TAG_ICONS: Record<string, LucideIcon> = {
  "badge-check": BadgeCheck,
  bath: Bath,
  briefcase: Briefcase,
  calendar: Calendar,
  "calendar-days": CalendarDays,
  car: Car,
  coffee: Coffee,
  cross: Cross,
  dumbbell: Dumbbell,
  fuel: Fuel,
  "hard-hat": HardHat,
  laptop: Laptop,
  plane: Plane,
  presentation: Presentation,
  shirt: Shirt,
  "shopping-bag": ShoppingBag,
  stethoscope: Stethoscope,
  store: Store,
  table: Table,
  "train-front": TrainFront,
  tv: Tv,
  user: User,
  users: Users,
  utensils: Utensils,
  waves: Waves,
  wind: Wind,
  wifi: Wifi,
  zap: Zap,
};

export type IconTag = { name: string; icon: string };

export function tagIcon(name: string | undefined): LucideIcon {
  return (name && TAG_ICONS[name.trim().toLowerCase()]) || Check;
}
