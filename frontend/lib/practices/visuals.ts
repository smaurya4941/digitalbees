import {
  BarChart3,
  Bot,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  Factory,
  Flame,
  Gauge,
  Globe2,
  Handshake,
  Layers,
  Lock,
  Megaphone,
  Network,
  Rocket,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Practice visuals are stored as plain strings (`practices.icon`,
 * `practices.color_token`) so the admin can change them without a deploy.
 * This module is the single place those strings become an icon component and
 * a colour — used by the public site (nav, homepage, about) and by the admin
 * pickers, so what an editor picks is exactly what visitors see.
 */

/** Curated lucide icons an editor can pick for a practice, keyed by kebab-case name. */
export const PRACTICE_ICONS: Record<string, LucideIcon> = {
  users: Users,
  layers: Layers,
  sparkles: Sparkles,
  bot: Bot,
  brain: Brain,
  cpu: Cpu,
  code: Code2,
  terminal: Terminal,
  cloud: Cloud,
  database: Database,
  network: Network,
  workflow: Workflow,
  'shield-check': ShieldCheck,
  'check-circle': CheckCircle2,
  lock: Lock,
  megaphone: Megaphone,
  'trending-up': TrendingUp,
  'bar-chart': BarChart3,
  target: Target,
  zap: Zap,
  flame: Flame,
  gauge: Gauge,
  factory: Factory,
  building: Building2,
  briefcase: Briefcase,
  handshake: Handshake,
  globe: Globe2,
  rocket: Rocket,
  settings: Settings2,
  wrench: Wrench,
};

export type PracticeColorToken =
  | 'practice-talent'
  | 'practice-digital'
  | 'practice-ai'
  | 'practice-marketing'
  | 'practice-quality'
  | 'practice-servicenow'
  | 'practice-energy'
  | 'brand-gold'
  | 'brand-navy';

/**
 * Colour tokens an editor can pick. Hex values mirror
 * styles/tokens/colors.css — they're repeated here because the swatch is
 * applied as an inline tint (`${hex}14` backgrounds) that a CSS variable
 * can't express.
 */
export const PRACTICE_COLORS: Record<PracticeColorToken, { label: string; hex: string }> = {
  'practice-talent': { label: 'Talent blue', hex: '#4a6fa1' },
  'practice-digital': { label: 'Digital teal', hex: '#3f8fa5' },
  'practice-ai': { label: 'AI violet', hex: '#6b4fa1' },
  'practice-marketing': { label: 'Marketing amber', hex: '#b8862b' },
  'practice-quality': { label: 'Quality green', hex: '#4a8f6b' },
  'practice-servicenow': { label: 'ServiceNow emerald', hex: '#2e6b4f' },
  'practice-energy': { label: 'Energy copper', hex: '#8a5a2e' },
  'brand-gold': { label: 'Bee gold', hex: '#9c7326' },
  'brand-navy': { label: 'Navy', hex: '#0b1f3a' },
};

const DEFAULT_ICON = Layers;
const DEFAULT_COLOR = PRACTICE_COLORS['brand-navy'].hex;

export function practiceIcon(name: string | null | undefined): LucideIcon {
  return (name && PRACTICE_ICONS[name]) || DEFAULT_ICON;
}

export function practiceColor(token: string | null | undefined): string {
  if (!token) return DEFAULT_COLOR;
  if (token in PRACTICE_COLORS) return PRACTICE_COLORS[token as PracticeColorToken].hex;
  // Allow a raw hex for anything seeded or entered outside the picker.
  return /^#[0-9a-f]{6}$/i.test(token) ? token : DEFAULT_COLOR;
}

/** A translucent tint of a hex colour for icon chips (`#rrggbb` + alpha). */
export function tint(hex: string, alpha: 'soft' | 'medium' = 'soft'): string {
  return `${hex}${alpha === 'soft' ? '14' : '29'}`;
}
