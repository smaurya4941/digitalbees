'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  type AdminLocation,
  deleteLocation,
  listLocations,
  locationQueryKeys,
  setLocationStatus,
} from '@/lib/admin/locations';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';
import { Select } from '@/components/admin/ui';

export default function AdminLocationsPage() {
  const [region, setRegion] = useState('');

  // A cheap fetch just to populate the region filter options.
  const { data } = useQuery({
    queryKey: locationQueryKeys.list({}),
    queryFn: ({ signal }) => listLocations({}, signal),
  });
  const regions = data?.meta.regions ?? [];

  return (
    <TaxonomyListPage<AdminLocation>
      title="Offices"
      description="Physical locations shown on the public site with LocalBusiness markup."
      basePath="/admin/locations"
      entityLabel="office"
      queryKeys={locationQueryKeys}
      listFn={listLocations}
      setStatusFn={setLocationStatus}
      deleteFn={deleteLocation}
      minWidth={780}
      extraQuery={{ region: region || undefined }}
      toolbarExtra={
        <Select className="h-10 w-44" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r.id} value={String(r.id)}>
              {r.name}
            </option>
          ))}
        </Select>
      }
      primaryColumn={{
        key: 'name',
        header: 'Office',
        render: (l) => (
          <>
            <div className="font-medium text-ink">{l.name}</div>
            <div className="text-xs text-ink-subtle">
              {[l.city, l.country].filter(Boolean).join(', ') || `/${l.slug}`}
            </div>
          </>
        ),
      }}
      extraColumns={[
        {
          key: 'region',
          header: 'Region',
          render: (l) => l.region_name || '—',
        },
      ]}
    />
  );
}
