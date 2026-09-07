'use client';

import {
  deletePractice,
  listPractices,
  practiceQueryKeys,
  setPracticeStatus,
} from '@/lib/admin/practices';
import type { AdminPractice } from '@/lib/admin/types';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';

export default function AdminPracticesPage() {
  return (
    <TaxonomyListPage<AdminPractice>
      title="Practices"
      description="The service lines shown across the public website."
      basePath="/admin/practices"
      entityLabel="practice"
      queryKeys={practiceQueryKeys}
      listFn={listPractices}
      setStatusFn={setPracticeStatus}
      deleteFn={deletePractice}
      primaryColumn={{
        key: 'name',
        header: 'Practice',
        render: (p) => (
          <>
            <div className="font-medium text-ink">{p.name}</div>
            <div className="text-xs text-ink-subtle">/{p.slug}</div>
          </>
        ),
      }}
      extraColumns={[
        {
          key: 'services',
          header: 'Sub-services',
          render: (p) => p.sub_services_count ?? 0,
        },
      ]}
    />
  );
}
