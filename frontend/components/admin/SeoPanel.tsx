'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { type SeoBlock, getSeo, seoQueryKeys, updateSeo } from '@/lib/admin/seo';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from './providers';
import { AdminButton, Field, Panel, Select, TextInput, Textarea, useToast } from './ui';

const EMPTY: SeoBlock = {
  meta_title: '',
  meta_description: '',
  canonical_url: '',
  robots: 'index,follow',
  og_title: '',
  og_description: '',
  og_image_id: null,
};

const ROBOTS = ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'];

function counter(value: string, min: number, max: number) {
  const len = value.length;
  const ok = len >= min && len <= max;
  return (
    <span className={ok ? 'text-success' : len === 0 ? 'text-ink-subtle' : 'text-warning'}>
      {len} / {max}
    </span>
  );
}

export function SeoPanel({ type, slug }: { type: string; slug: string }) {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const editable = can('seo.update');

  const { data, isLoading } = useQuery({
    queryKey: seoQueryKeys.entity(type, slug),
    queryFn: ({ signal }) => getSeo(type, slug, signal),
  });

  const [overrides, setOverrides] = useState<Partial<SeoBlock>>({});
  const form: SeoBlock = { ...EMPTY, ...(data?.seo ?? {}), ...overrides };

  const mutation = useMutation({
    mutationFn: () => updateSeo(type, slug, { ...form, og_image_id: form.og_image_id || null }),
    onSuccess: (res) => {
      toast.success('SEO saved.');
      queryClient.setQueryData(seoQueryKeys.entity(type, slug), res);
      void queryClient.invalidateQueries({ queryKey: seoQueryKeys.issues });
      setOverrides({});
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError && Object.keys(error.errors).length
          ? (Object.values(error.errors)[0]?.[0] ?? 'Please check the fields.')
          : 'Could not save the SEO metadata.',
      ),
  });

  const set = (patch: Partial<SeoBlock>) => setOverrides((o) => ({ ...o, ...patch }));
  const warnings = data?.warnings ?? [];

  return (
    <Panel className="space-y-5 p-6">
      <div>
        <h2 className="text-sm font-semibold text-ink">SEO</h2>
        <p className="mt-0.5 text-xs text-ink-subtle">
          What search engines and social cards show for this page.
        </p>
      </div>

      {warnings.length > 0 && (
        <ul className="space-y-1 rounded-lg bg-warning-surface p-3 text-xs">
          {warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-warning-strong">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              {w.message}
            </li>
          ))}
        </ul>
      )}

      {isLoading ? (
        <p className="text-sm text-ink-subtle">Loading…</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (editable) mutation.mutate();
          }}
        >
          <Field label="Meta title" hint={<>Aim for 30–60 characters. {counter(form.meta_title ?? '', 30, 60)}</>}>
            <TextInput
              value={form.meta_title ?? ''}
              onChange={(e) => set({ meta_title: e.target.value })}
              disabled={!editable}
            />
          </Field>
          <Field
            label="Meta description"
            hint={<>Aim for 70–160 characters. {counter(form.meta_description ?? '', 70, 160)}</>}
          >
            <Textarea
              rows={3}
              value={form.meta_description ?? ''}
              onChange={(e) => set({ meta_description: e.target.value })}
              disabled={!editable}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Canonical URL">
              <TextInput
                value={form.canonical_url ?? ''}
                onChange={(e) => set({ canonical_url: e.target.value })}
                disabled={!editable}
                placeholder="Leave blank for the default"
              />
            </Field>
            <Field label="Robots">
              <Select
                value={form.robots ?? 'index,follow'}
                onChange={(e) => set({ robots: e.target.value })}
                disabled={!editable}
              >
                {ROBOTS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="OG title" hint="Falls back to the meta title.">
              <TextInput
                value={form.og_title ?? ''}
                onChange={(e) => set({ og_title: e.target.value })}
                disabled={!editable}
              />
            </Field>
            <Field label="OG image (media ID)">
              <TextInput
                type="number"
                value={form.og_image_id ?? ''}
                onChange={(e) => set({ og_image_id: e.target.value ? Number(e.target.value) : null })}
                disabled={!editable}
              />
            </Field>
          </div>
          <Field label="OG description" hint="Falls back to the meta description.">
            <Textarea
              rows={2}
              value={form.og_description ?? ''}
              onChange={(e) => set({ og_description: e.target.value })}
              disabled={!editable}
            />
          </Field>

          {editable && (
            <div className="flex justify-end">
              <AdminButton type="submit" loading={mutation.isPending}>
                Save SEO
              </AdminButton>
            </div>
          )}
        </form>
      )}
    </Panel>
  );
}
