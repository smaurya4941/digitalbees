import 'server-only';
import type { CaseStudyDetail, CaseStudySummary } from '@/types/case-study';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/** All published case studies, newest first. */
export async function getCaseStudies(): Promise<CaseStudySummary[]> {
  try {
    const { data } = await apiList<CaseStudySummary>('case-studies', {
      tags: [cacheTags.caseStudies],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as CaseStudySummary[]);
  }
}

/** One case study, or `null` if unknown. */
export async function getCaseStudy(slug: string): Promise<CaseStudyDetail | null> {
  try {
    return await apiGet<CaseStudyDetail>(`case-studies/${slug}`, {
      tags: [cacheTags.caseStudies, cacheTags.caseStudy(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}
