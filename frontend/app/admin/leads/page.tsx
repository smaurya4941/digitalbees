'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { leadQueryKeys, listLeads, type LeadStatus } from '@/lib/admin/leads';
import { useAuth } from '@/components/admin/providers';
import { EmptyState, PageHeading, Panel, Spinner } from '@/components/admin/ui';
import { cn } from '@/lib/utils/cn';
import dayjs from 'dayjs';

const TABS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Synced', value: 'synced' },
  { label: 'Failed', value: 'failed' },
  { label: 'Duplicate', value: 'duplicate' },
];

export default function AdminLeadsPage() {
  const { can } = useAuth();
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: leadQueryKeys.list({ status, page }),
    queryFn: ({ signal }) => listLeads({ status, page }, signal),
  });

  const leads = data?.data ?? [];
  const meta = data?.meta;

  const canView = can('content.update'); // Using content.update as CRM view permission proxy

  if (!canView) {
    return (
      <EmptyState
        title="Access Denied"
        description="You do not have permission to view the CRM Inbox."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Inbox / CRM"
        description="Manage incoming contact forms, newsletter signups, and demo requests."
      />

      <div className="flex border-b border-hairline">
        {TABS.map((tab) => {
          const isActive = status === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'border-b-2 border-brand-gold text-brand-navy'
                  : 'text-ink-subtle hover:text-ink'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <Panel>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load leads" description="Refresh the page to try again." />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={
              status
                ? `There are no leads with the status “${status}”.`
                : 'Your inbox is empty. No form submissions yet.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {leads.map((lead) => (
                  <tr key={lead.id} className="group transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5 whitespace-nowrap text-ink-subtle">
                      {dayjs(lead.created_at).format('MMM D, YYYY h:mm A')}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-ink">{lead.full_name || 'Unknown'}</div>
                      <div className="text-xs text-ink-subtle">{lead.email || lead.phone || 'No contact info'}</div>
                      {lead.company && <div className="text-xs text-ink-muted">{lead.company}</div>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-ink-muted capitalize">
                        {lead.form_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize',
                          lead.status === 'new' && 'bg-blue-50 text-blue-700',
                          lead.status === 'synced' && 'bg-green-50 text-green-700',
                          lead.status === 'failed' && 'bg-red-50 text-red-700',
                          lead.status === 'duplicate' && 'bg-neutral-100 text-neutral-600'
                        )}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-neutral-50"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
                <p className="text-xs text-ink-subtle">
                  Showing {leads.length} of {meta.total} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="grid size-8 place-items-center rounded-md border border-hairline disabled:opacity-50"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                    disabled={page === meta.last_page}
                    className="grid size-8 place-items-center rounded-md border border-hairline disabled:opacity-50"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
