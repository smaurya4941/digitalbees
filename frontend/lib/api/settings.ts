import { apiGet } from './client';

export interface SiteSettings {
  'site.name'?: string;
  'site.legal_name'?: string;
  'site.tagline'?: string;
  'contact.email'?: string;
  'contact.phone'?: string;
  'social.linkedin'?: string;
  'social.x'?: string;
  'seo.default_robots'?: string;
  'seo.title_suffix'?: string;
  'feature.chatbot_enabled'?: boolean;
  [key: string]: any;
}

/**
 * Fetch the public, cacheable subset of site settings.
 */
export function getSettings(signal?: AbortSignal): Promise<SiteSettings> {
  return apiGet<SiteSettings>('settings', { signal, tags: ['settings'] });
}
