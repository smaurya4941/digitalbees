'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  deleteIndustry,
  listIndustries,
  industryQueryKeys,
  setIndustryStatus,
} from '@/lib/admin/industries';
import type { AdminIndustry } from '@/lib/admin/industries';
import { AdminApiError } from '@/lib/admin/http';
import type { ContentStatus } from '@/lib/admin/types';
import { useAuth } from '@/components/admin/providers';
import {
  AdminButton,
  EmptyState,
  PageHeading,
  Panel,
  Select,
  Spinner,
  StatusPill,
  useToast,
} from '@/components/admin/ui';

const STATUSES: ContentStatus[] = ['draft', 'published', 'archived'];

export default function AdminIndustriesPage() {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<AdminIndustry | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: industryQueryKeys.all,
    queryFn: ({ signal }) => listIndustries(signal),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: industryQueryKeys.all });

  const statusMutation = useMutation({
    mutationFn: ({ slug, status }: { slug: string; status: ContentStatus }) =>
      setIndustryStatus(slug, status),
    onSuccess: (updated) => {
      toast.success(`“${updated.name}” is now ${updated.status}.`);
      void invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError && error.isForbidden
          ? 'You do not have permission to publish content.'
          : 'Could not update the status.',
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => deleteIndustry(slug),
    onSuccess: () => {
      toast.success('Industry deleted.');
      setPendingDelete(null);
      void invalidate();
    },
    onError: (error) => {
      toast.error(
        error instanceof AdminApiError && error.isForbidden
          ? 'Only administrators can delete content.'
          : 'Could not delete the industry.',
      );
      setPendingDelete(null);
    },
  });

  const industries = [...(data ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const canEdit = can('content.update');
  const canPublish = can('content.publish');
  const canDelete = can('content.delete');
  const canCreate = can('content.create');

  return (
    <div className="space-y-6">
      <PageHeading
        title="Industries"
        description="The target sectors shown across the public website."
        actions={
          canCreate ? (
            <Link
              href="/admin/industries/new"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              <Plus className="size-4" /> New industry
            </Link>
          ) : undefined
        }
      />

      <Panel>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load industries" description="Refresh the page to try again." />
        ) : industries.length === 0 ? (
          <EmptyState
            title="No industries yet"
            description="Create your first industry to publish it to the website."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  <th className="px-5 py-3">Industry</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {industries.map((industry) => (
                  <tr key={industry.id} className="group transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-ink">{industry.name}</div>
                      <div className="text-xs text-ink-subtle">/{industry.slug}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      {canPublish ? (
                        <Select
                          aria-label={`Status for ${industry.name}`}
                          value={industry.status}
                          disabled={statusMutation.isPending}
                          onChange={(e) =>
                            statusMutation.mutate({
                              slug: industry.slug,
                              status: e.target.value as ContentStatus,
                            })
                          }
                          className="h-9 w-36 text-xs"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s[0].toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <StatusPill status={industry.status} />
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <Link
                            href={`/admin/industries/${industry.slug}`}
                            className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100 hover:text-ink"
                            aria-label={`Edit ${industry.name}`}
                          >
                            <Pencil className="size-4" />
                          </Link>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setPendingDelete(industry)}
                            className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-danger-surface hover:text-danger"
                            aria-label={`Delete ${industry.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                        {!canEdit && !canDelete && (
                          <span className="text-xs text-ink-subtle">View only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <ConfirmDeleteDialog
        industry={pendingDelete}
        pending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.slug)}
      />
    </div>
  );
}

function ConfirmDeleteDialog({
  industry,
  pending,
  onCancel,
  onConfirm,
}: {
  industry: AdminIndustry | null;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {industry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-brand-navy-deep/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.16 }}
            className="relative w-full max-w-md rounded-2xl border border-hairline bg-white p-6 shadow-xl"
          >
            <div className="grid size-11 place-items-center rounded-full bg-danger-surface text-danger">
              <Trash2 className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">Delete “{industry.name}”?</h3>
            <p className="mt-1.5 text-sm text-ink-muted">
              This removes the industry from the website. This can be undone by an administrator.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="ghost" onClick={onCancel} disabled={pending}>
                Cancel
              </AdminButton>
              <AdminButton variant="danger" onClick={onConfirm} loading={pending}>
                Delete industry
              </AdminButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
