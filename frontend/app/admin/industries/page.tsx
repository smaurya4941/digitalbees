'use client';

import {
  type AdminIndustry,
  deleteIndustry,
  industryQueryKeys,
  listIndustries,
  setIndustryStatus,
} from '@/lib/admin/industries';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';

export default function AdminIndustriesPage() {
  return (
    <TaxonomyListPage<AdminIndustry>
      title="Industries"
      description="The target sectors shown across the public website."
      basePath="/admin/industries"
      entityLabel="industry"
      queryKeys={industryQueryKeys}
      listFn={listIndustries}
      setStatusFn={setIndustryStatus}
      deleteFn={deleteIndustry}
      primaryColumn={{
        key: 'name',
        header: 'Industry',
        render: (i) => (
          <>
            <div className="font-medium text-ink">{i.name}</div>
            <div className="text-xs text-ink-subtle">/{i.slug}</div>
          </>
        ),
      }}
    />
  );
}
