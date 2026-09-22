import {
  Activity,
  Building2,
  Cpu,
  Factory,
  Handshake,
  Landmark,
  RadioTower,
  ShoppingCart,
  Truck,
  Umbrella,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Industries are seeded with a plain icon string (`industries.icon`, see
 * IndustrySeeder) so the admin can retarget one without a deploy. This is the
 * single place that string becomes a component — mirrors
 * `lib/practices/visuals.ts`'s `practiceIcon` so both taxonomies resolve the
 * same way across the public site.
 */
const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  landmark: Landmark,
  umbrella: Umbrella,
  'shopping-cart': ShoppingCart,
  factory: Factory,
  zap: Zap,
  cpu: Cpu,
  'building-2': Building2,
  'radio-tower': RadioTower,
  truck: Truck,
  handshake: Handshake,
};

const DEFAULT_ICON = Building2;

export function industryIcon(name: string | null | undefined): LucideIcon {
  return (name && INDUSTRY_ICONS[name]) || DEFAULT_ICON;
}
