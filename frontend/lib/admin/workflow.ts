'use client';

import { adminApi } from './http';
import type { RevisionContentType } from './revisions';

export type WorkflowContentType = RevisionContentType;

export type WorkflowState =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export interface AllowedTransition {
  to: WorkflowState;
  label: string;
}

export interface WorkflowReview {
  action: string;
  from_state: string | null;
  to_state: string | null;
  notes: string | null;
  reviewer: { id: number; name: string } | null;
  reviewed_at: string | null;
}

export interface WorkflowSnapshot {
  workflow_state: WorkflowState;
  status: string;
  scheduled_for: string | null;
  allowed_transitions: AllowedTransition[];
  reviews: WorkflowReview[];
}

export interface TransitionInput {
  to: WorkflowState;
  scheduled_for?: string | null;
  notes?: string | null;
}

export interface TransitionResult {
  type: string;
  slug: string;
  workflow_state: WorkflowState;
  status: string;
  scheduled_for: string | null;
  allowed_transitions: AllowedTransition[];
}

export interface ReviewQueueItem {
  type: WorkflowContentType;
  slug: string;
  title: string;
  href: string;
  submitted_at: string | null;
  submitted_by: string | null;
  updated_at: string | null;
}

export const WORKFLOW_STATE_LABELS: Record<WorkflowState, string> = {
  draft: 'Draft',
  in_review: 'In review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};

const KEY = ['admin', 'workflow'] as const;

export const workflowQueryKeys = {
  all: KEY,
  queue: [...KEY, 'queue'] as const,
  entity: (type: string, slug: string) => [...KEY, type, slug] as const,
};

export function getWorkflow(
  type: WorkflowContentType,
  slug: string,
  signal?: AbortSignal,
): Promise<WorkflowSnapshot> {
  return adminApi.get<WorkflowSnapshot>(`admin/${type}/${slug}/workflow`, signal);
}

export function transitionContent(
  type: WorkflowContentType,
  slug: string,
  input: TransitionInput,
): Promise<TransitionResult> {
  return adminApi.post<TransitionResult>(`admin/${type}/${slug}/transition`, input);
}

export function getReviewQueue(
  signal?: AbortSignal,
): Promise<{ data: ReviewQueueItem[]; meta: { count: number } }> {
  return adminApi.getEnvelope('admin/workflow/queue', { signal });
}
