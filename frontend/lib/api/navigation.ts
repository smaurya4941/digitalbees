import { apiGet } from './client';

export interface PublicNavItem {
  id: number;
  label: string;
  url: string | null;
  icon: string | null;
  children: PublicNavItem[];
}

export type PublicNavigation = Record<string, PublicNavItem[]>;

export async function getPublicNavigation(): Promise<PublicNavigation> {
  return apiGet<PublicNavigation>('navigation', {
    tags: ['navigation'], // Matches NotifyFrontendRevalidate in backend
  });
}
