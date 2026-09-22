export type LeaderCategory = 'executive' | 'practice' | 'region';

export interface FunctionalLeader {
  id: string | number;
  name: string;
  title: string;
  bio: string;
  photo_url?: string | null;
  linkedin_url?: string | null;
  categories: LeaderCategory[];
  practice_slug?: string;
  practice_name?: string;
  region_slug?: string;
  region_name?: string;
  functional_tags: string[];
  pedigree?: string;
}

export type LeadershipTabKey = 'all' | 'executive' | 'practices' | 'regions';
