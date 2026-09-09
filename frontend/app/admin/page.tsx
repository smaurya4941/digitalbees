'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { AlertTriangle, CheckCircle2, CircleDashed, Image as ImageIcon, Inbox } from 'lucide-react';
import { type Dashboard, dashboardQueryKey, getDashboard } from '@/lib/admin/dashboard';
import { useAuth } from '@/components/admin/providers';
import { EmptyState, PageHeading, Panel, Spinner } from '@/components/admin/ui';

const CONTENT_HREF: Record<string, string> = {
  practices: '/admin/practices',
  industries: '/admin/industries',
  regions: '/admin/regions',
  technologies: '/admin/technologies',
  'case-studies': '/admin/case-studies',
  pages: '/admin/pages',
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: dashboardQueryKey,
    queryFn: ({ signal }) => getDashboard(signal),
  });

  return (
    <div className="space-y-8">
      <PageHeading
        title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'there'}`}
        description="A snapshot of the content powering the public website."
      />

      {isLoading ? (
        <Spinner />
      ) : isError || !data ? (
        <EmptyState title="Couldn’t load the dashboard" description="Refresh the page to try again." />
      ) : (
        <DashboardBody data={data} />
      )}
    </div>
  );
}

function DashboardBody({ data }: { data: Dashboard }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published" value={data.totals.published} icon={CheckCircle2} tone="text-success" />
        <StatCard label="Drafts" value={data.totals.draft} icon={CircleDashed} tone="text-warning" />
        <StatCard
          label="New leads"
          value={data.totals.new_leads}
          icon={Inbox}
          tone="text-brand-navy"
          href="/admin/leads"
        />
        <StatCard label="Media files" value={data.totals.media} icon={ImageIcon} tone="text-ink-subtle" href="/admin/media" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <h2 className="border-b border-hairline px-5 py-4 text-sm font-semibold text-ink">Content by type</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Published</th>
                  <th className="px-5 py-3 text-right">Draft</th>
                  <th className="px-5 py-3 text-right">Archived</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {data.content.map((row) => (
                  <tr key={row.type} className="hover:bg-neutral-50">
                    <td className="px-5 py-3">
                      {CONTENT_HREF[row.type] ? (
                        <Link href={CONTENT_HREF[row.type]} className="font-medium text-ink hover:text-brand-navy">
                          {row.label}
                        </Link>
                      ) : (
                        <span className="font-medium text-ink">{row.label}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-ink">{row.published}</td>
                    <td className="px-5 py-3 text-right text-ink-muted">{row.draft}</td>
                    <td className="px-5 py-3 text-right text-ink-subtle">{row.archived}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-5">
          <h2 className="text-sm font-semibold text-ink">Leads</h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            <Stat row label="New / unactioned" value={data.leads.new} />
            <Stat row label="Last 7 days" value={data.leads.last_7_days} />
            <Stat row label="Last 30 days" value={data.leads.last_30_days} />
            <Stat row label="All time" value={data.leads.total} />
          </dl>
          <Link
            href="/admin/leads"
            className="mt-4 inline-block text-sm font-medium text-brand-navy hover:underline"
          >
            Open inbox
          </Link>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <AlertTriangle className="size-4 text-warning" /> Needs attention
          </h2>
          {data.needs_attention.length === 0 ? (
            <p className="mt-3 text-sm text-ink-subtle">Nothing flagged. Everything looks current.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {data.needs_attention.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-ink-muted">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
                  {item.message}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Recent activity</h2>
            <Link href="/admin/activity" className="text-xs font-medium text-brand-navy hover:underline">
              View all
            </Link>
          </div>
          {data.recent_activity.length === 0 ? (
            <p className="mt-3 text-sm text-ink-subtle">No changes recorded yet.</p>
          ) : (
            <ul className="mt-3 space-y-2.5 text-sm">
              {data.recent_activity.map((entry) => (
                <li key={entry.id} className="flex items-baseline justify-between gap-3">
                  <span className="text-ink-muted">
                    <span className="font-medium text-ink">{entry.user ?? 'System'}</span>{' '}
                    {entry.action.replace('_', ' ')}{' '}
                    <span className="capitalize">{entry.auditable_type.replace('_', ' ')}</span>{' '}
                    #{entry.auditable_id}
                  </span>
                  <span className="shrink-0 text-xs text-ink-subtle">
                    {dayjs(entry.created_at).format('MMM D')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

function Stat({ label, value, row }: { label: string; value: number; row?: boolean }) {
  return (
    <div className={row ? 'flex items-center justify-between' : ''}>
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number;
  icon: typeof CheckCircle2;
  tone: string;
  href?: string;
}) {
  const inner = (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{label}</span>
        <Icon className={`size-4.5 ${tone}`} aria-hidden />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</p>
    </Panel>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {href ? <Link href={href}>{inner}</Link> : inner}
    </motion.div>
  );
}
