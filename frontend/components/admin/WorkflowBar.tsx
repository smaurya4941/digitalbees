'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { CalendarClock, ChevronDown, GitBranch } from 'lucide-react';
import {
  type AllowedTransition,
  type WorkflowContentType,
  type WorkflowState,
  WORKFLOW_STATE_LABELS,
  getWorkflow,
  transitionContent,
  workflowQueryKeys,
} from '@/lib/admin/workflow';
import { AdminApiError } from '@/lib/admin/http';
import { cn } from '@/lib/utils/cn';
import { AdminButton, Panel, TextInput, Textarea, useToast } from './ui';

const STATE_STYLES: Record<WorkflowState, string> = {
  draft: 'bg-neutral-100 text-ink-muted ring-neutral-300/60',
  in_review: 'bg-warning-surface text-warning-strong ring-warning/20',
  approved: 'bg-brand-navy/10 text-brand-navy ring-brand-navy/20',
  scheduled: 'bg-brand-navy/10 text-brand-navy ring-brand-navy/20',
  published: 'bg-success-surface text-success-strong ring-success/20',
  archived: 'bg-neutral-100 text-ink-muted ring-neutral-300/60',
};

function transitionLabel(to: WorkflowState, from: WorkflowState, fallback: string): string {
  if (to === 'draft' && from === 'in_review') return 'Reject';
  if (to === 'draft' && from === 'published') return 'Unpublish';
  if (to === 'draft' && from === 'scheduled') return 'Cancel schedule';
  if (to === 'draft') return 'Send back to draft';
  if (to === 'in_review') return 'Submit for review';
  return fallback;
}

export function WorkflowBar({ type, slug }: { type: WorkflowContentType; slug: string }) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [pending, setPending] = useState<AllowedTransition | null>(null);
  const [scheduledFor, setScheduledFor] = useState('');
  const [notes, setNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: workflowQueryKeys.entity(type, slug),
    queryFn: ({ signal }) => getWorkflow(type, slug, signal),
  });

  const mutation = useMutation({
    mutationFn: (t: AllowedTransition) =>
      transitionContent(type, slug, {
        to: t.to,
        scheduled_for: t.to === 'scheduled' ? new Date(scheduledFor).toISOString() : null,
        notes: notes.trim() || null,
      }),
    onSuccess: (result) => {
      toast.success(`Moved to “${WORKFLOW_STATE_LABELS[result.workflow_state]}”.`);
      setPending(null);
      setScheduledFor('');
      setNotes('');
      void queryClient.invalidateQueries({ queryKey: workflowQueryKeys.entity(type, slug) });
      void queryClient.invalidateQueries({ queryKey: workflowQueryKeys.queue });
      void queryClient.invalidateQueries({ queryKey: ['admin', type] });
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError ? error.message : 'Could not change the workflow state.',
      ),
  });

  if (isLoading || !data) {
    return (
      <Panel className="flex items-center gap-2 px-5 py-3 text-sm text-ink-subtle">
        <GitBranch className="size-4" aria-hidden /> Loading workflow…
      </Panel>
    );
  }

  const current = data.workflow_state;
  const needsSchedule = pending?.to === 'scheduled';
  const needsNotes = pending?.to === 'draft' && current === 'in_review';
  const canSubmit =
    pending !== null &&
    (!needsSchedule || scheduledFor !== '') &&
    (!needsNotes || notes.trim() !== '');

  return (
    <Panel className="space-y-3 px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <GitBranch className="size-4 text-ink-subtle" aria-hidden />
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset',
            STATE_STYLES[current],
          )}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {WORKFLOW_STATE_LABELS[current]}
        </span>

        {current === 'scheduled' && data.scheduled_for && (
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <CalendarClock className="size-3.5" />
            {dayjs(data.scheduled_for).format('MMM D, YYYY h:mm A')}
          </span>
        )}

        <div className="ml-auto flex flex-wrap gap-2">
          {data.allowed_transitions.length === 0 && (
            <span className="text-xs text-ink-subtle">No actions available to you.</span>
          )}
          {data.allowed_transitions.map((t) => {
            const active = pending?.to === t.to;
            return (
              <AdminButton
                key={t.to}
                type="button"
                size="sm"
                variant={
                  t.to === 'published' ? 'primary' : t.to === 'archived' ? 'danger' : 'secondary'
                }
                className={active ? 'ring-2 ring-brand-gold' : undefined}
                onClick={() => {
                  if (t.to === 'scheduled' || (t.to === 'draft' && current === 'in_review')) {
                    setPending((p) => (p?.to === t.to ? null : t));
                  } else {
                    mutation.mutate(t);
                  }
                }}
              >
                {transitionLabel(t.to, current, t.label)}
              </AdminButton>
            );
          })}
        </div>
      </div>

      {(needsSchedule || needsNotes) && pending && (
        <div className="space-y-2 rounded-lg bg-neutral-50 p-3">
          {needsSchedule && (
            <label className="block text-xs font-medium text-ink">
              Publish at
              <TextInput
                type="datetime-local"
                className="mt-1"
                value={scheduledFor}
                min={dayjs().format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </label>
          )}
          {needsNotes && (
            <label className="block text-xs font-medium text-ink">
              Reason for rejection
              <Textarea
                rows={2}
                className="mt-1"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell the author what needs to change"
              />
            </label>
          )}
          <div className="flex justify-end gap-2">
            <AdminButton type="button" size="sm" variant="ghost" onClick={() => setPending(null)}>
              Cancel
            </AdminButton>
            <AdminButton
              type="button"
              size="sm"
              loading={mutation.isPending}
              disabled={!canSubmit}
              onClick={() => pending && mutation.mutate(pending)}
            >
              {needsSchedule ? 'Schedule' : 'Reject'}
            </AdminButton>
          </div>
        </div>
      )}

      {data.reviews.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-brand-navy hover:underline"
          >
            <ChevronDown className={cn('size-3.5 transition-transform', showHistory && 'rotate-180')} />
            {showHistory ? 'Hide' : 'Show'} review history ({data.reviews.length})
          </button>
          {showHistory && (
            <ul className="mt-2 space-y-1.5 text-xs">
              {data.reviews.map((r, i) => (
                <li key={i} className="flex flex-wrap gap-x-2 text-ink-muted">
                  <span className="font-medium capitalize text-ink">{r.action}</span>
                  <span>by {r.reviewer?.name ?? 'System'}</span>
                  <span className="text-ink-subtle">
                    · {r.reviewed_at ? dayjs(r.reviewed_at).format('MMM D, h:mm A') : ''}
                  </span>
                  {r.notes && <span className="w-full text-ink-muted">“{r.notes}”</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Panel>
  );
}
