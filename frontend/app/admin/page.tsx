'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, CircleDashed, Archive, PenLine } from 'lucide-react';
import { listPractices, practiceQueryKeys } from '@/lib/admin/practices';
import type { AdminPractice } from '@/lib/admin/types';
import { useAuth } from '@/components/admin/providers';
import { EmptyState, PageHeading, Panel, Spinner, StatusPill } from '@/components/admin/ui';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: practiceQueryKeys.all,
    queryFn: ({ signal }) => listPractices(signal),
  });

  const practices = data ?? [];
  const counts = {
    published: practices.filter((p) => p.status === 'published').length,
    draft: practices.filter((p) => p.status === 'draft').length,
    archived: practices.filter((p) => p.status === 'archived').length,
  };

  const recent = [...practices]
    .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeading
        title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'there'}`}
        description="A snapshot of the content powering the public website."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Published"
          value={counts.published}
          icon={CheckCircle2}
          tone="text-success"
          loading={isLoading}
        />
        <StatCard
          label="Drafts"
          value={counts.draft}
          icon={CircleDashed}
          tone="text-warning"
          loading={isLoading}
        />
        <StatCard
          label="Archived"
          value={counts.archived}
          icon={Archive}
          tone="text-ink-subtle"
          loading={isLoading}
        />
      </div>

      <Panel>
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">Recently updated practices</h2>
          <Link
            href="/admin/practices"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
          >
            View all <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <Spinner />
        ) : recent.length === 0 ? (
          <EmptyState title="No practices yet" description="Create the first practice to get started." />
        ) : (
          <ul className="divide-y divide-hairline">
            {recent.map((practice) => (
              <RecentRow key={practice.id} practice={practice} />
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  loading,
}: {
  label: string;
  value: number;
  icon: typeof CheckCircle2;
  tone: string;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Panel className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink-muted">{label}</span>
          <Icon className={`size-4.5 ${tone}`} aria-hidden />
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          {loading ? <span className="text-ink-subtle">—</span> : value}
        </p>
      </Panel>
    </motion.div>
  );
}

function RecentRow({ practice }: { practice: AdminPractice }) {
  return (
    <li>
      <Link
        href={`/admin/practices/${practice.slug}`}
        className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-50"
      >
        <span className="grid size-9 place-items-center rounded-lg bg-brand-navy/5 text-brand-navy">
          <PenLine className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{practice.name}</p>
          <p className="truncate text-xs text-ink-subtle">/{practice.slug}</p>
        </div>
        <StatusPill status={practice.status} />
      </Link>
    </li>
  );
}
