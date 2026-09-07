'use client';

import {
  type AdminCaseStudy,
  caseStudyQueryKeys,
  deleteCaseStudy,
  listCaseStudies,
  setCaseStudyStatus,
} from '@/lib/admin/case-studies';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';

export default function AdminCaseStudiesPage() {
  return (
    <TaxonomyListPage<AdminCaseStudy>
      title="Case studies"
      description="Client success stories linked across the site."
      basePath="/admin/case-studies"
      entityLabel="case study"
      queryKeys={caseStudyQueryKeys}
      listFn={listCaseStudies}
      setStatusFn={setCaseStudyStatus}
      deleteFn={deleteCaseStudy}
      minWidth={780}
      primaryColumn={{
        key: 'title',
        header: 'Title & client',
        render: (c) => (
          <>
            <div className="font-medium text-ink">{c.title}</div>
            <div className="text-xs text-ink-subtle">
              {c.client_name ? `${c.client_name} · ` : ''}/{c.slug}
            </div>
          </>
        ),
      }}
    />
  );
}
