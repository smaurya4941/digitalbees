import type { Metadata } from 'next';
import type { SeoBlock } from '@/types/seo';

/**
 * Map the API's SEO block to a Next `Metadata` object. Used by every dynamic
 * template's `generateMetadata()`.
 */
export function toMetadata(seo: SeoBlock): Metadata {
  const robots = parseRobots(seo.robots);

  return {
    // The API's meta_title is already brand-qualified — bypass the layout's
    // `%s | TeamBees` template so the suffix isn't doubled.
    title: seo.meta_title ? { absolute: seo.meta_title } : undefined,
    description: seo.meta_description ?? undefined,
    alternates: seo.canonical_url ? { canonical: seo.canonical_url } : undefined,
    robots,
    openGraph: {
      title: seo.og_title ?? seo.meta_title ?? undefined,
      description: seo.og_description ?? seo.meta_description ?? undefined,
      url: seo.canonical_url ?? undefined,
      images: seo.og_image_url ? [{ url: seo.og_image_url }] : undefined,
      type: 'website',
    },
    twitter: {
      card: (seo.twitter_card as 'summary' | 'summary_large_image') ?? 'summary_large_image',
      title: seo.og_title ?? seo.meta_title ?? undefined,
      description: seo.og_description ?? seo.meta_description ?? undefined,
    },
  };
}

/**
 * Metadata for entities the API serves without an SEO block (resources,
 * insights, careers, locations). Keeps title/canonical/OG handling identical
 * to {@link toMetadata} so those pages are not second-class.
 */
export function entityMetadata(input: {
  title: string;
  description?: string;
  path: string;
  siteUrl: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}): Metadata {
  const canonical = new URL(input.path, input.siteUrl).toString();

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      type: input.type ?? 'website',
      ...(input.type === 'article' && input.publishedTime
        ? { publishedTime: input.publishedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
    },
  };
}

function parseRobots(value: string | null): Metadata['robots'] {
  if (!value) return undefined;
  const tokens = value.split(',').map((t) => t.trim().toLowerCase());
  return {
    index: !tokens.includes('noindex'),
    follow: !tokens.includes('nofollow'),
  };
}
