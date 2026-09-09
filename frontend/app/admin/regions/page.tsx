'use client';

import {
  type AdminRegion,
  deleteRegion,
  listRegions,
  regionQueryKeys,
  setRegionStatus,
} from '@/lib/admin/regions';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';

export default function AdminRegionsPage() {
  return (
    <TaxonomyListPage<AdminRegion>
      title="Regions"
      description="The geographies TeamBees operates in."
      basePath="/admin/regions"
      entityLabel="region"
      queryKeys={regionQueryKeys}
      listFn={listRegions}
      setStatusFn={setRegionStatus}
      deleteFn={deleteRegion}
      primaryColumn={{
        key: 'name',
        header: 'Region',
        render: (r) => (
          <>
            <div className="font-medium text-ink">{r.name}</div>
            <div className="text-xs text-ink-subtle">/{r.slug}</div>
          </>
        ),
      }}
      extraColumns={[
        {
          key: 'iso',
          header: 'ISO code',
          render: (r) => r.iso_code || '—',
        },
      ]}
    />
  );
}
