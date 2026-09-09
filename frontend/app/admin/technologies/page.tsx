'use client';

import {
  type AdminTechnology,
  deleteTechnology,
  listTechnologies,
  setTechnologyStatus,
  technologyQueryKeys,
} from '@/lib/admin/technologies';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';

export default function AdminTechnologiesPage() {
  return (
    <TaxonomyListPage<AdminTechnology>
      title="Technologies"
      description="Platforms and tools TeamBees delivers on."
      basePath="/admin/technologies"
      entityLabel="technology"
      queryKeys={technologyQueryKeys}
      listFn={listTechnologies}
      setStatusFn={setTechnologyStatus}
      deleteFn={deleteTechnology}
      primaryColumn={{
        key: 'name',
        header: 'Technology',
        render: (t) => (
          <>
            <div className="font-medium text-ink">{t.name}</div>
            <div className="text-xs text-ink-subtle">/{t.slug}</div>
          </>
        ),
      }}
    />
  );
}
