'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { getLead, leadQueryKeys, setLeadStatus, type LeadStatus } from '@/lib/admin/leads';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import { AdminButton, EmptyState, PageHeading, Panel, Spinner, useToast } from '@/components/admin/ui';
import dayjs from 'dayjs';

export default function LeadDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useAuth();

  const { data: lead, isLoading, error } = useQuery({
    queryKey: leadQueryKeys.detail(id),
    queryFn: ({ signal }) => getLead(id, signal),
    retry: (failureCount, err) => {
      if (err instanceof AdminApiError && err.status === 404) return false;
      return failureCount < 3;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: LeadStatus) => setLeadStatus(id, status),
    onSuccess: (updated) => {
      toast.success(`Lead marked as ${updated.status}.`);
      void queryClient.invalidateQueries({ queryKey: leadQueryKeys.all });
    },
    onError: () => toast.error('Could not update lead status.'),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error instanceof AdminApiError && error.status === 404) {
    return (
      <div className="pt-12">
        <EmptyState title="Lead not found" description={`No lead exists with ID “${id}”.`} />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/leads"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back to Inbox
        </Link>
        <PageHeading
          title={lead.full_name || 'Anonymous Lead'}
          description={`Submitted on ${dayjs(lead.created_at).format('MMMM D, YYYY at h:mm A')}`}
          actions={
            <div className="flex items-center gap-2">
              {lead.status === 'new' && (
                <>
                  <AdminButton
                    variant="ghost"
                    onClick={() => statusMutation.mutate('duplicate')}
                    loading={statusMutation.isPending}
                  >
                    Mark duplicate
                  </AdminButton>
                  <AdminButton
                    onClick={() => statusMutation.mutate('synced')}
                    loading={statusMutation.isPending}
                  >
                    <CheckCircle2 className="size-4 mr-2" /> Mark as Synced
                  </AdminButton>
                </>
              )}
              {lead.status === 'synced' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                  <CheckCircle2 className="size-4" /> Synced to CRM
                </span>
              )}
              {lead.status === 'failed' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                  <XCircle className="size-4" /> Sync Failed
                </span>
              )}
            </div>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Panel className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">Submission Details</h2>
            
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-ink-subtle">Full Name</dt>
                <dd className="mt-1 text-sm text-ink">{lead.full_name || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-subtle">Company</dt>
                <dd className="mt-1 text-sm text-ink">{lead.company || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-subtle">Email Address</dt>
                <dd className="mt-1 text-sm text-ink">
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="text-brand-navy hover:underline">
                      {lead.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-subtle">Phone Number</dt>
                <dd className="mt-1 text-sm text-ink">
                  {lead.phone ? (
                    <a href={`tel:${lead.phone}`} className="text-brand-navy hover:underline">
                      {lead.phone}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-hairline pt-6">
              <dt className="text-xs font-medium text-ink-subtle">Message</dt>
              <dd className="mt-2 whitespace-pre-wrap rounded-lg bg-neutral-50 p-4 text-sm text-ink leading-relaxed">
                {lead.message || <span className="italic text-ink-muted">No message provided.</span>}
              </dd>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">Metadata</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-ink-subtle">Form Type</dt>
                <dd className="mt-1 capitalize text-sm text-ink">{lead.form_type.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-subtle">Lead Score</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{lead.score}</dd>
              </div>
              {lead.ip_address && (
                <div>
                  <dt className="text-xs font-medium text-ink-subtle">IP Address</dt>
                  <dd className="mt-1 text-sm text-ink font-mono text-xs">{lead.ip_address}</dd>
                </div>
              )}
            </dl>
          </Panel>

          {lead.utm && Object.keys(lead.utm).length > 0 && (
            <Panel className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-ink">UTM Parameters</h2>
              <dl className="space-y-3">
                {Object.entries(lead.utm).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">{key}</dt>
                    <dd className="mt-0.5 text-sm text-ink">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
