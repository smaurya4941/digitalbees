'use client';

import { useState } from 'react';
import {
  type AdminResource,
  RESOURCE_TYPES,
  deleteResource,
  listResources,
  resourceQueryKeys,
  setResourceStatus,
} from '@/lib/admin/resources';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';
import { Select } from '@/components/admin/ui';

export default function AdminResourcesPage() {
  const [type, setType] = useState('');

  return (
    <TaxonomyListPage<AdminResource>
      title="Resources"
      description="Blog / insight, guide, webinar, research and news articles."
      basePath="/admin/resources"
      entityLabel="resource"
      queryKeys={resourceQueryKeys}
      listFn={listResources}
      setStatusFn={setResourceStatus}
      deleteFn={deleteResource}
      minWidth={780}
      extraQuery={{ type: type || undefined }}
      toolbarExtra={
        <Select className="h-10 w-40" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === 'blog' ? 'Blog / Insight' : t[0].toUpperCase() + t.slice(1)}
            </option>
          ))}
        </Select>
      }
      primaryColumn={{
        key: 'title',
        header: 'Title',
        render: (r) => (
          <>
            <div className="font-medium text-ink">{r.title}</div>
            <div className="text-xs text-ink-subtle">/{r.slug}</div>
          </>
        ),
      }}
      extraColumns={[
        {
          key: 'type',
          header: 'Type',
          render: (r) => (
            <span className="inline-flex rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium capitalize text-ink-muted">
              {r.resource_type === 'blog' ? 'Insight' : r.resource_type}
            </span>
          ),
        },
      ]}
    />
  );
}
