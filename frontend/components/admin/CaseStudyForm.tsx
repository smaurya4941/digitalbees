'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createCaseStudy, caseStudyQueryKeys, updateCaseStudy } from '@/lib/admin/case-studies';
import { getPracticeRelationOptions, practiceQueryKeys } from '@/lib/admin/practices';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminCaseStudy } from '@/lib/admin/case-studies';
import { useAuth } from '@/components/admin/providers';
import { ObjectListRepeater, StringListRepeater } from '@/components/admin/JsonRepeaters';
import { RelationPicker } from '@/components/admin/practice/RelationPicker';
import {
  AdminButton,
  Field,
  PageHeading,
  Panel,
  Select,
  TextInput,
  Textarea,
  useToast,
} from '@/components/admin/ui';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  slug: z
    .string()
    .max(150)
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only')
    .optional(),
  client_name: z.string().max(100).optional(),
  summary: z.string().max(1000).optional(),
  challenge: z.string().max(2000).optional(),
  solution: z.string().max(2000).optional(),
  results: z.string().max(2000).optional(),
  metrics: z.array(z.object({ value: z.string().max(40), label: z.string().max(150) })).max(8),
  how_it_works: z.array(z.object({ title: z.string().max(150), description: z.string().max(1000) })).max(8),
  capabilities_used: z.array(z.string().max(100)).max(12),
  practice_ids: z.array(z.number()),
  industry_ids: z.array(z.number()),
  technology_ids: z.array(z.number()),
  region_ids: z.array(z.number()),
  status: z.enum(['draft', 'published', 'archived']),
});

type FormValues = z.infer<typeof schema>;

type RelationField = 'practice_ids' | 'industry_ids' | 'technology_ids' | 'region_ids';

const RELATION_FIELDS: Array<[RelationField, string, 'practices' | 'industries' | 'technologies' | 'regions']> = [
  ['practice_ids', 'Practices', 'practices'],
  ['industry_ids', 'Industries', 'industries'],
  ['technology_ids', 'Technologies', 'technologies'],
  ['region_ids', 'Regions', 'regions'],
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function CaseStudyForm({ caseStudy }: { caseStudy?: AdminCaseStudy }) {
  const isEdit = Boolean(caseStudy);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const canPublish = can('content.publish');

  const relationOptions = useQuery({
    queryKey: practiceQueryKeys.relationOptions,
    queryFn: ({ signal }) => getPracticeRelationOptions(signal),
    staleTime: 60_000,
  });

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: caseStudy?.title ?? '',
      slug: caseStudy?.slug ?? '',
      client_name: caseStudy?.client_name ?? '',
      summary: caseStudy?.summary ?? '',
      challenge: caseStudy?.challenge ?? '',
      solution: caseStudy?.solution ?? '',
      results: caseStudy?.results ?? '',
      metrics: caseStudy?.metrics ?? [],
      how_it_works: (caseStudy?.how_it_works ?? []).map((s) => ({ title: s.title, description: s.description ?? '' })),
      capabilities_used: caseStudy?.capabilities_used ?? [],
      practice_ids: caseStudy?.practice_ids ?? [],
      industry_ids: caseStudy?.industry_ids ?? [],
      technology_ids: caseStudy?.technology_ids ?? [],
      region_ids: caseStudy?.region_ids ?? [],
      status: caseStudy?.status ?? 'draft',
    },
  });

  const titleValue = useWatch({ control, name: 'title' }) ?? '';
  const slugValue = useWatch({ control, name: 'slug' }) ?? '';

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        title: values.title,
        status: values.status,
        slug: values.slug || slugify(values.title),
        client_name: values.client_name || null,
        summary: values.summary || null,
        challenge: values.challenge || null,
        solution: values.solution || null,
        results: values.results || null,
        // Half-filled repeater rows are dropped rather than saved blank.
        metrics: values.metrics
          .map((m) => ({ value: m.value.trim(), label: m.label.trim() }))
          .filter((m) => m.value && m.label),
        how_it_works: values.how_it_works
          .map((s) => ({ title: s.title.trim(), description: s.description.trim() || null }))
          .filter((s) => s.title),
        capabilities_used: values.capabilities_used.map((c) => c.trim()).filter(Boolean),
        practice_ids: values.practice_ids,
        industry_ids: values.industry_ids,
        technology_ids: values.technology_ids,
        region_ids: values.region_ids,
      };
      return isEdit ? updateCaseStudy(caseStudy!.slug, payload) : createCaseStudy(payload);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? 'Changes saved.' : `“${saved.title}” created.`);
      void queryClient.invalidateQueries({ queryKey: caseStudyQueryKeys.all });
      router.push('/admin/case-studies');
    },
    onError: (error) => {
      if (error instanceof AdminApiError && error.status === 422) {
        for (const [field, messages] of Object.entries(error.errors)) {
          // Nested repeater errors (e.g. `metrics.0.label`) surface on their parent field.
          setError(field.split('.')[0] as keyof FormValues, { message: messages[0] });
        }
        toast.error('Please fix the highlighted fields.');
      } else if (error instanceof AdminApiError && error.isForbidden) {
        toast.error(error.message || 'You do not have permission for this action.');
      } else {
        toast.error('Could not save the case study.');
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/case-studies"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Case Studies
        </Link>
        <PageHeading
          title={isEdit ? `Edit ${caseStudy!.title}` : 'New case study'}
          description={
            isEdit
              ? 'Everything here appears on the public case study page. Empty sections are hidden there.'
              : 'Add a new client success story. It starts as a draft until you publish it.'
          }
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Identity</h2>

          <Field label="Title" htmlFor="title" error={errors.title?.message} required>
            <TextInput
              id="title"
              invalid={Boolean(errors.title)}
              {...register('title', {
                onChange: (e) => {
                  if (!isEdit && (!slugValue || slugValue === slugify(titleValue))) {
                    setValue('slug', slugify(e.target.value));
                  }
                },
              })}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Slug"
              htmlFor="slug"
              error={errors.slug?.message}
              hint={`Public URL: /case-studies/${slugValue || slugify(titleValue) || 'your-case-study'}`}
            >
              <TextInput id="slug" invalid={Boolean(errors.slug)} {...register('slug')} />
            </Field>

            <Field
              label="Client"
              htmlFor="client_name"
              error={errors.client_name?.message}
              hint="Use an anonymized description unless the client approved being named."
            >
              <TextInput id="client_name" invalid={Boolean(errors.client_name)} {...register('client_name')} />
            </Field>
          </div>

          <Field label="Summary" htmlFor="summary" error={errors.summary?.message} hint="Shown under the title and on case study cards.">
            <Textarea id="summary" rows={3} {...register('summary')} />
          </Field>
        </Panel>

        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Story</h2>

          <Field label="Challenge" htmlFor="challenge" error={errors.challenge?.message} hint="What problem were we solving?">
            <Textarea id="challenge" rows={4} {...register('challenge')} />
          </Field>

          <Field label="Solution" htmlFor="solution" error={errors.solution?.message} hint="How did we solve it?">
            <Textarea id="solution" rows={4} {...register('solution')} />
          </Field>

          <Field label="Results" htmlFor="results" error={errors.results?.message} hint="What changed for the client?">
            <Textarea id="results" rows={4} {...register('results')} />
          </Field>
        </Panel>

        <Panel className="space-y-6 p-6">
          <h2 className="text-sm font-semibold text-ink">Proof & delivery</h2>

          <Controller
            control={control}
            name="metrics"
            render={({ field }) => (
              <ObjectListRepeater
                label="Headline metrics"
                hint="The first four appear in the bar under the hero; the first also shows on case study cards."
                items={field.value}
                onChange={field.onChange}
                fields={[
                  { name: 'value', label: 'Value', placeholder: '40%' },
                  { name: 'label', label: 'Label', placeholder: 'Faster task execution' },
                ]}
                newItem={() => ({ value: '', label: '' })}
                addLabel="Add metric"
              />
            )}
          />
          {errors.metrics?.message && <p className="text-sm text-danger">{errors.metrics.message}</p>}

          <Controller
            control={control}
            name="how_it_works"
            render={({ field }) => (
              <ObjectListRepeater
                label="Delivery steps"
                hint="Numbered automatically in the order shown."
                items={field.value}
                onChange={field.onChange}
                fields={[
                  { name: 'title', label: 'Step title', placeholder: 'Assess' },
                  { name: 'description', label: 'Description', type: 'textarea' },
                ]}
                newItem={() => ({ title: '', description: '' })}
                addLabel="Add step"
              />
            )}
          />
          {errors.how_it_works?.message && <p className="text-sm text-danger">{errors.how_it_works.message}</p>}

          <Controller
            control={control}
            name="capabilities_used"
            render={({ field }) => (
              <StringListRepeater
                label="Capabilities used"
                hint="Short service names, e.g. “Implementation”, “Support & AMS”."
                items={field.value}
                onChange={field.onChange}
                placeholder="Implementation"
                addLabel="Add capability"
              />
            )}
          />
        </Panel>

        <Panel className="space-y-5 p-6">
          <div>
            <h2 className="text-sm font-semibold text-ink">Links</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Shown on the case study, and the case study appears on each linked practice, industry,
              technology and region page.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {RELATION_FIELDS.map(([name, label, key]) => (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <RelationPicker
                    label={label}
                    options={relationOptions.data?.[key] ?? []}
                    loading={relationOptions.isLoading}
                    value={field.value}
                    onChange={field.onChange}
                    emptyHint={`No ${label.toLowerCase()} exist yet — add them in the admin first.`}
                  />
                )}
              />
            ))}
          </div>
        </Panel>

        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Publishing</h2>
          <Field
            label="Status"
            htmlFor="status"
            error={errors.status?.message}
            hint={canPublish ? undefined : 'Publishing needs the content.publish permission.'}
          >
            <Select id="status" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="published" disabled={!canPublish}>
                Published
              </option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
        </Panel>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/case-studies"
            className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-ink-muted hover:bg-neutral-100"
          >
            Cancel
          </Link>
          <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
            {isEdit ? 'Save changes' : 'Create case study'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
