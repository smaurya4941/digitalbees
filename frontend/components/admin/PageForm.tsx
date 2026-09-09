'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminApiError } from '@/lib/admin/http';
import { type AdminPageDetail, pageQueryKeys, updatePage } from '@/lib/admin/pages';
import type { ContentStatus } from '@/lib/admin/types';
import { useAuth } from './providers';
import {
  AdminButton,
  Field,
  Panel,
  Select,
  Textarea,
  TextInput,
  useToast,
} from './ui';

const STATUSES: ContentStatus[] = ['draft', 'published', 'archived'];

type SectionDraft = { key: string; value: string; valid: boolean };

function toDraft(sections: Record<string, unknown>): SectionDraft[] {
  return Object.entries(sections).map(([key, value]) => ({
    key,
    value: JSON.stringify(value ?? {}, null, 2),
    valid: true,
  }));
}

export function PageForm({ page }: { page: AdminPageDetail }) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useAuth();

  const canPublish = can('content.publish');

  const [title, setTitle] = useState(page.title);
  const [status, setStatus] = useState<ContentStatus>(page.status);
  const [sections, setSections] = useState<SectionDraft[]>(() => toDraft(page.sections));

  const initial = useMemo(
    () => ({ title: page.title, status: page.status, sections: toDraft(page.sections) }),
    [page],
  );

  const dirty =
    title !== initial.title ||
    status !== initial.status ||
    JSON.stringify(sections.map((s) => [s.key, s.value])) !==
      JSON.stringify(initial.sections.map((s) => [s.key, s.value]));

  const hasInvalidSection = sections.some((s) => !s.valid);

  const mutation = useMutation({
    mutationFn: () => {
      const parsedSections = Object.fromEntries(
        sections.map((s) => [s.key, JSON.parse(s.value)]),
      );
      return updatePage(page.id, { title, status, sections: parsedSections });
    },
    onSuccess: (updated) => {
      toast.success('Page saved.');
      queryClient.setQueryData(pageQueryKeys.detail(page.id), updated);
      void queryClient.invalidateQueries({ queryKey: pageQueryKeys.all });
      router.push('/admin/pages');
    },
    onError: (error) => {
      if (error instanceof AdminApiError && error.isForbidden) {
        toast.error('You do not have permission to publish this page.');
        return;
      }
      toast.error(
        error instanceof AdminApiError ? error.message : 'Could not save the page.',
      );
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!hasInvalidSection) mutation.mutate();
      }}
    >
      <Panel className="space-y-5 p-6">
        <Field label="Title" required>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <div className="grid gap-2">
          <p className="text-sm font-medium text-ink">URL path</p>
          <p className="rounded-xl bg-neutral-50 px-3.5 py-2.5 font-mono text-sm text-ink-muted">
            {page.url_path}
          </p>
          <p className="text-xs text-ink-subtle">
            Template: {page.template_key ?? '—'}. URL and template are managed in the information architecture.
          </p>
        </div>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value as ContentStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s} disabled={s === 'published' && !canPublish}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
      </Panel>

      {sections.length > 0 && (
        <Panel className="space-y-5 p-6">
          <div>
            <h2 className="text-sm font-semibold text-ink">Sections</h2>
            <p className="mt-0.5 text-xs text-ink-subtle">
              Raw section content as JSON. A structured block editor replaces this in a later release.
            </p>
          </div>
          {sections.map((section, index) => (
            <Field
              key={section.key}
              label={section.key}
              error={section.valid ? undefined : 'Invalid JSON'}
            >
              <Textarea
                className="font-mono text-xs"
                rows={8}
                value={section.value}
                invalid={!section.valid}
                onChange={(e) => {
                  const value = e.target.value;
                  let valid = true;
                  try {
                    JSON.parse(value);
                  } catch {
                    valid = false;
                  }
                  setSections((prev) =>
                    prev.map((s, i) => (i === index ? { ...s, value, valid } : s)),
                  );
                }}
              />
            </Field>
          ))}
        </Panel>
      )}

      <div className="flex justify-end gap-2">
        <AdminButton variant="ghost" type="button" onClick={() => router.push('/admin/pages')}>
          Cancel
        </AdminButton>
        <AdminButton
          type="submit"
          loading={mutation.isPending}
          disabled={!dirty || hasInvalidSection}
        >
          Save changes
        </AdminButton>
      </div>
    </form>
  );
}
