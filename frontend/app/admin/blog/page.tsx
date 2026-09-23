'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FolderTree, Star } from 'lucide-react';
import {
  type AdminResource,
  deleteResource,
  listResources,
  resourceQueryKeys,
  setResourceStatus,
} from '@/lib/admin/resources';
import { blogCategoryQueryKeys, listBlogCategories } from '@/lib/admin/blog-categories';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';
import { Select } from '@/components/admin/ui';

function formatDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

export default function AdminBlogPage() {
  const [category, setCategory] = useState('');
  const { data: categories = [] } = useQuery({
    queryKey: blogCategoryQueryKeys.all,
    queryFn: ({ signal }) => listBlogCategories(signal),
  });

  return (
    <TaxonomyListPage<AdminResource>
      title="Blog"
      description="Write, schedule and publish blog posts. Changes go live on the website as soon as you save."
      basePath="/admin/blog"
      entityLabel="post"
      queryKeys={resourceQueryKeys}
      listFn={listResources}
      setStatusFn={setResourceStatus}
      deleteFn={deleteResource}
      minWidth={880}
      extraQuery={{ type: 'blog', category: category || undefined }}
      toolbarExtra={
        <div className="flex items-center gap-2">
          <Select className="h-10 w-48" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </Select>
          <Link
            href="/admin/blog/categories"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-ink hover:bg-neutral-50"
          >
            <FolderTree className="size-4" /> Categories
          </Link>
        </div>
      }
      primaryColumn={{
        key: 'title',
        header: 'Post',
        render: (r) => (
          <div className="flex items-center gap-3">
            {r.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail from the media library
              <img src={r.cover_image} alt="" className="h-10 w-16 shrink-0 rounded-md object-cover" />
            ) : (
              <span className="h-10 w-16 shrink-0 rounded-md bg-neutral-100" aria-hidden />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-medium text-ink">
                <span className="truncate">{r.title}</span>
                {r.is_featured && <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />}
              </div>
              <div className="truncate text-xs text-ink-subtle">{r.public_url}</div>
            </div>
          </div>
        ),
      }}
      extraColumns={[
        {
          key: 'category',
          header: 'Category',
          render: (r) =>
            r.category ? (
              <span className="inline-flex rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-ink-muted">
                {r.category.name}
              </span>
            ) : (
              <span className="text-xs text-ink-subtle">Uncategorised</span>
            ),
        },
        {
          key: 'published_at',
          header: 'Published',
          render: (r) => <span className="text-xs text-ink-muted">{formatDate(r.published_at)}</span>,
        },
      ]}
    />
  );
}
