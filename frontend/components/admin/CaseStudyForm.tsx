'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createCaseStudy, caseStudyQueryKeys, updateCaseStudy } from '@/lib/admin/case-studies';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminCaseStudy } from '@/lib/admin/case-studies';
import { useAuth } from '@/components/admin/providers';
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
  impact: z.string().max(2000).optional(),
  hero_image: z.string().max(255).optional(),
  sort_order: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), 'Whole numbers only'),
  status: z.enum(['draft', 'published', 'archived']),
});

type FormValues = z.infer<typeof schema>;

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
      impact: caseStudy?.impact ?? '',
      hero_image: caseStudy?.hero_image ?? '',
      sort_order: String(caseStudy?.sort_order ?? 0),
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
        impact: values.impact || null,
        hero_image: values.hero_image || null,
        sort_order: values.sort_order ? Number(values.sort_order) : 0,
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
          setError(field as keyof FormValues, { message: messages[0] });
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
              ? 'Update the content shown on the case study page.'
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

            <Field label="Client Name" htmlFor="client_name" error={errors.client_name?.message}>
              <TextInput id="client_name" invalid={Boolean(errors.client_name)} {...register('client_name')} />
            </Field>
          </div>

          <Field label="Summary" htmlFor="summary" error={errors.summary?.message} hint="A brief overview of the project and outcome.">
            <Textarea id="summary" rows={3} {...register('summary')} />
          </Field>
        </Panel>

        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Content</h2>

          <Field label="Challenge" htmlFor="challenge" error={errors.challenge?.message} hint="What problem were we solving?">
            <Textarea id="challenge" rows={4} {...register('challenge')} />
          </Field>

          <Field label="Solution" htmlFor="solution" error={errors.solution?.message} hint="How did we solve it?">
            <Textarea id="solution" rows={4} {...register('solution')} />
          </Field>

          <Field label="Impact" htmlFor="impact" error={errors.impact?.message} hint="What were the measurable results?">
            <Textarea id="impact" rows={4} {...register('impact')} />
          </Field>
        </Panel>

        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Presentation & Metadata</h2>
          
          <Field label="Hero Image URL" htmlFor="hero_image" error={errors.hero_image?.message} hint="Path to the cover image">
            <TextInput id="hero_image" {...register('hero_image')} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order?.message}>
              <TextInput id="sort_order" type="number" min={0} {...register('sort_order')} />
            </Field>
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
          </div>
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
