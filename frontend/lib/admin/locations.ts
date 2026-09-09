'use client';

import { adminApi, type AdminPaginated } from './http';
import type { ContentStatus } from './types';

export interface AdminLocation {
  id: number;
  name: string;
  slug: string;
  region_id: number | null;
  region_name?: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  status: ContentStatus;
  created_at: string | null;
  updated_at: string | null;
}

export interface LocationInput {
  region_id?: number;
  name?: string;
  slug?: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  lat?: number | null;
  lng?: number | null;
  status?: ContentStatus;
}

export interface LocationListFilters {
  q?: string;
  status?: string;
  region?: string;
  page?: number;
}

export type LocationsPage = AdminPaginated<AdminLocation> & {
  meta: { regions: { id: number; name: string }[]; statuses: string[] };
};

const KEY = ['admin', 'locations'] as const;

export const locationQueryKeys = {
  all: KEY,
  list: (filters: LocationListFilters) => [...KEY, 'list', filters] as const,
  detail: (slug: string) => [...KEY, slug] as const,
};

export function listLocations(
  filters: LocationListFilters,
  signal?: AbortSignal,
): Promise<LocationsPage> {
  return adminApi.getPage<AdminLocation>('admin/locations', {
    signal,
    query: {
      q: filters.q || undefined,
      status: filters.status || undefined,
      region: filters.region || undefined,
      page: filters.page,
    },
  }) as Promise<LocationsPage>;
}

export function getLocation(slug: string, signal?: AbortSignal): Promise<AdminLocation> {
  return adminApi.get<AdminLocation>(`admin/locations/${slug}`, signal);
}

export function createLocation(input: LocationInput): Promise<AdminLocation> {
  return adminApi.post<AdminLocation>('locations', input);
}

export function updateLocation(slug: string, input: LocationInput): Promise<AdminLocation> {
  return adminApi.put<AdminLocation>(`locations/${slug}`, input);
}

export function setLocationStatus(slug: string, status: ContentStatus): Promise<AdminLocation> {
  return adminApi.put<AdminLocation>(`locations/${slug}`, { status });
}

export function deleteLocation(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`locations/${slug}`);
}
