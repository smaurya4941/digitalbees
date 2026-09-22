import 'server-only';
import type { ServicePillar, ServiceClusterPage } from '@/types/service';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import {
  FALLBACK_SERVICE_PILLARS,
  FALLBACK_SERVICE_CLUSTERS,
} from '@/lib/data/fallback-services';

/** All published service pillars */
export async function getServicePillars(): Promise<ServicePillar[]> {
  try {
    const { data } = await apiList<ServicePillar>('services', {
      tags: [cacheTags.practices],
    });
    if (data && data.length > 0) return data;
    return FALLBACK_SERVICE_PILLARS;
  } catch (_error) {
    return FALLBACK_SERVICE_PILLARS;
  }
}

/** One service pillar by slug */
export async function getServicePillar(slug: string): Promise<ServicePillar | null> {
  try {
    const data = await apiGet<ServicePillar>(`services/${slug}`, {
      tags: [cacheTags.practice(slug)],
    });
    if (data) return data;
    return FALLBACK_SERVICE_PILLARS.find((p) => p.slug === slug) ?? null;
  } catch (_error) {
    return FALLBACK_SERVICE_PILLARS.find((p) => p.slug === slug) ?? null;
  }
}

/** All cluster pages for a pillar */
export async function getServiceClusterPages(pillarSlug: string): Promise<ServiceClusterPage[]> {
  try {
    const { data } = await apiList<ServiceClusterPage>(`services/${pillarSlug}/clusters`, {
      tags: [cacheTags.practice(pillarSlug)],
    });
    if (data && data.length > 0) return data;
    const dict = FALLBACK_SERVICE_CLUSTERS[pillarSlug] ?? {};
    return Object.values(dict);
  } catch (_error) {
    const dict = FALLBACK_SERVICE_CLUSTERS[pillarSlug] ?? {};
    return Object.values(dict);
  }
}

/** Single cluster landing page */
export async function getServiceClusterPage(
  pillarSlug: string,
  clusterSlug: string
): Promise<ServiceClusterPage | null> {
  try {
    const data = await apiGet<ServiceClusterPage>(`services/${pillarSlug}/clusters/${clusterSlug}`, {
      tags: [cacheTags.subService(pillarSlug, clusterSlug)],
    });
    if (data) return data;
    const dict = FALLBACK_SERVICE_CLUSTERS[pillarSlug] ?? {};
    return dict[clusterSlug] ?? null;
  } catch (_error) {
    const dict = FALLBACK_SERVICE_CLUSTERS[pillarSlug] ?? {};
    return dict[clusterSlug] ?? null;
  }
}
