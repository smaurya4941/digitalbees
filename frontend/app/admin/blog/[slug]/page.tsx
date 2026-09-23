'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getResource, resourceQueryKeys } from '@/lib/admin/resources';
import { AdminApiError } from '@/lib/admin/http';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { SeoPanel } from '@/components/admin/SeoPanel';
import { RevisionHistory } from '@/components/admin/RevisionHistory';
import { WorkflowBar } from '@/components/admin/WorkflowBar';
import { EmptyState, PageHeading, Spinner } from '@/components/admin/ui';

export default function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: resourceQueryKeys.detail(slug),
    queryFn: ({ signal }) => getResource(slug, signal),
    retry: (count, err) => !(err instanceof AdminApiError && err.status === 404) && count < 2,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if ((error instanceof AdminApiError && error.status === 404) || !data) {
    return (
      <div className="pt-12">
        <EmptyState
          title="Post not found"
          description={`Nothing matches “${slug}”.`}
          action={
            <Link href="/admin/blog" className="text-sm font-medium text-brand-navy hover:underline">
              Back to the blog
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Blog
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageHeading title={data.title} description={data.public_url} />
          {data.status === 'published' && (
            <a
              href={data.public_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-ink hover:bg-neutral-50"
            >
              <ExternalLink className="size-4" /> View live
            </a>
          )}
        </div>
      </div>
      <WorkflowBar type="resources" slug={data.slug} />
      <BlogPostForm post={data} />
      <SeoPanel type="resources" slug={data.slug} />
      <RevisionHistory type="resources" slug={data.slug} />
    </div>
  );
}
