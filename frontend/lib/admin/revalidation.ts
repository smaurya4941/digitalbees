'use client';

import { adminApi } from './http';

/**
 * Force the public site to drop cache tags / paths. Automatic revalidation
 * already fires on every write; this is the manual escape hatch.
 */
export function revalidate(input: {
  tags?: string[];
  paths?: string[];
  all?: boolean;
}): Promise<{ tags: string[]; paths: string[] }> {
  return adminApi.post<{ tags: string[]; paths: string[] }>('admin/revalidate', input);
}
