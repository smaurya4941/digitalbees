import 'server-only';
import type { CaseStudyDetail, CaseStudySummary } from '@/types/case-study';
import { ApiError, apiGet, apiList } from './client';
import { cacheTags } from './tags';
import {
  getFallbackCaseStudy,
  getFallbackCaseStudySummaries,
} from '@/lib/data/fallback-case-studies';

/**
 * True only when the backend could not answer at all (network failure or a
 * 5xx). The static fallback keeps the site standing through an outage — it
 * must never mask a real answer: an empty list or a 404 means the admin
 * unpublished or deleted the case study. Same rule as `lib/api/practices`.
 */
function isOutage(error: unknown): boolean {
  if (!(error instanceof ApiError)) return true;
  return error.status === 0 || error.status >= 500;
}

/** All published case studies, newest first. */
export async function getCaseStudies(): Promise<CaseStudySummary[]> {
  try {
    const { data } = await apiList<CaseStudySummary>('case-studies', {
      tags: [cacheTags.caseStudies],
    });
    return data ?? [];
  } catch (error) {
    if (isOutage(error)) return getFallbackCaseStudySummaries();
    throw error;
  }
}

/** One case study, or `null` if unknown. */
export async function getCaseStudy(slug: string): Promise<CaseStudyDetail | null> {
  try {
    return await apiGet<CaseStudyDetail>(`case-studies/${slug}`, {
      tags: [cacheTags.caseStudies, cacheTags.caseStudy(slug)],
    });
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null;
    if (isOutage(error)) return getFallbackCaseStudy(slug);
    throw error;
  }
}
