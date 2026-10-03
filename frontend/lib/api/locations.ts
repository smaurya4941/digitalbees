import 'server-only';
import type { LocationDetail, LocationSummary } from '@/types/location';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';
import { siteConfig } from '@/config/site';

/** All published offices. */
export async function getLocations(): Promise<LocationSummary[]> {
  try {
    const { data } = await apiList<LocationSummary>('locations', {
      tags: [cacheTags.locations],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as LocationSummary[]);
  }
}

/**
 * Offices for site chrome (header menus, contact page). Unlike
 * `getLocations()` this never throws: an unreachable backend yields the
 * static office list from `siteConfig`, so the header never loses them.
 */
export async function getOffices(): Promise<LocationSummary[]> {
  try {
    const { data } = await apiList<LocationSummary>('locations', {
      tags: [cacheTags.locations],
    });
    return data;
  } catch {
    return [...siteConfig.offices];
  }
}

/** One office, or `null` if unknown. */
export async function getLocation(slug: string): Promise<LocationDetail | null> {
  try {
    return await apiGet<LocationDetail>(`locations/${slug}`, {
      tags: [cacheTags.locations, cacheTags.location(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}
