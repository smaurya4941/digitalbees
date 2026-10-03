import { apiGet } from './client';
import { siteConfig } from '@/config/site';

export interface SiteSettings {
  'site.name'?: string;
  'site.legal_name'?: string;
  'site.tagline'?: string;
  'home.hero_video_url'?: string | null;
  'home.hero_video_title'?: string | null;
  'company.established'?: string | null;
  'company.markets'?: string | null;
  'company.shortlist_turnaround'?: string | null;
  'company.domain_experts'?: string | null;
  'company.enterprise_customers'?: string | null;
  'contact.email'?: string;
  'contact.phone'?: string;
  'social.linkedin'?: string;
  'social.x'?: string;
  'social.instagram'?: string;
  'seo.default_robots'?: string;
  'seo.title_suffix'?: string;
  'feature.chatbot_enabled'?: boolean;
  'blog.title'?: string;
  'blog.description'?: string;
  'blog.posts_per_page'?: number;
  [key: string]: unknown;
}

/**
 * Social profile URLs for icon rows. Settings win (an empty value hides that
 * icon); the static config only fills in when the backend is unreachable.
 */
export function socialLinks(settings: SiteSettings): { linkedin?: string; x?: string; instagram?: string } {
  return {
    linkedin: settings['social.linkedin'] ?? siteConfig.social.linkedin,
    x: settings['social.x'] || undefined,
    instagram: settings['social.instagram'] ?? siteConfig.social.instagram,
  };
}

/** Headline company figures quoted across the site. */
export interface CompanyFacts {
  established: string;
  /** Delivery markets in display order, e.g. `['India', 'USA', …]`. */
  markets: string[];
  marketsCount: number;
  /** Prose form, e.g. "India, USA, Singapore and UAE". */
  marketsLabel: string;
  /** e.g. "2 business days". */
  shortlistTurnaround: string;
  domainExperts: string;
  enterpriseCustomers: string;
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

/**
 * The `company.*` settings with the static config filling any gap, so every
 * page quotes the same figures and an admin edit changes all of them.
 */
export function companyFacts(settings: SiteSettings): CompanyFacts {
  const fallback = siteConfig.company;
  const markets =
    text(settings['company.markets'])
      ?.split(',')
      .map((m) => m.trim())
      .filter(Boolean) ?? [...fallback.markets];

  return {
    established: text(settings['company.established']) ?? fallback.established,
    markets,
    marketsCount: markets.length,
    marketsLabel: new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(markets),
    shortlistTurnaround: text(settings['company.shortlist_turnaround']) ?? fallback.shortlistTurnaround,
    domainExperts: text(settings['company.domain_experts']) ?? fallback.domainExperts,
    enterpriseCustomers: text(settings['company.enterprise_customers']) ?? fallback.enterpriseCustomers,
  };
}

/** The public contact inbox. */
export function contactEmail(settings: SiteSettings): string {
  return text(settings['contact.email']) ?? siteConfig.contact.email;
}

/**
 * Fetch the public, cacheable subset of site settings.
 */
export function getSettings(signal?: AbortSignal): Promise<SiteSettings> {
  return apiGet<SiteSettings>('settings', { signal, tags: ['settings'] });
}

/**
 * Company facts for a server component. Never throws: an unreachable backend
 * yields the static fallback. The settings fetch is shared (same URL and
 * tags), so calling this next to `getSettings()` costs no extra request.
 */
export async function getCompanyFacts(): Promise<CompanyFacts> {
  const settings = await getSettings().catch(() => ({}) as SiteSettings);
  return companyFacts(settings);
}
