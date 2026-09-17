import 'server-only';
import type { CaseStudyDetail, CaseStudySummary } from '@/types/case-study';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import {
  getFallbackCaseStudy,
  getFallbackCaseStudySummaries,
} from '@/lib/data/fallback-case-studies';

/** All published case studies, newest first. */
export async function getCaseStudies(): Promise<CaseStudySummary[]> {
  try {
    const { data } = await apiList<CaseStudySummary>('case-studies', {
      tags: [cacheTags.caseStudies],
    });
    if (data && data.length > 0) return data;
    return getFallbackCaseStudySummaries();
  } catch (_error) {
    return getFallbackCaseStudySummaries();
  }
}

/** One case study, or `null` if unknown. */
export async function getCaseStudy(slug: string): Promise<CaseStudyDetail | null> {
  try {
    const data = await apiGet<CaseStudyDetail>(`case-studies/${slug}`, {
      tags: [cacheTags.caseStudies, cacheTags.caseStudy(slug)],
    });
    if (data) return data;
    return getFallbackCaseStudy(slug);
  } catch (_error) {
    return getFallbackCaseStudy(slug);
  }
}

