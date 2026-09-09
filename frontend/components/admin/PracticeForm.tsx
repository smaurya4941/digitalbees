'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createPractice, practiceQueryKeys, updatePractice } from '@/lib/admin/practices';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminPractice } from '@/lib/admin/types';
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
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only')
    .nullable()
    .optional(),
  tagline: z.string().max(255).nullable().optional(),
  summary: z.string().max(2000).nullable().optional(),
  icon: z.string().max(100).nullable().optional(),
  color_token: z.string().max(50).nullable().optional(),
  featured_image: z.string().max(255).url('Must be a valid URL').nullable().optional().or(z.literal('')),
  sort_order: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), 'Whole numbers only'),
  status: z.enum(['draft', 'published', 'archived']),
  sub_services: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, 'Name is required').max(150),
      slug: z.string().max(150).regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only').nullable().optional(),
      summary: z.string().nullable().optional(),
      status: z.enum(['draft', 'published', 'archived']),
      sort_order: z.number().nullable().optional(),
    })
  ).optional(),
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

export function PracticeForm({ practice }: { practice?: AdminPractice }) {
  const isEdit = Boolean(practice);
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
      name: practice?.name ?? '',
      slug: practice?.slug ?? '',
      tagline: practice?.tagline ?? '',
      summary: practice?.summary ?? '',
      icon: practice?.icon ?? '',
      color_token: practice?.color_token ?? '',
      featured_image: practice?.featured_image ?? '',
      sort_order: String(practice?.sort_order ?? 0),
      status: practice?.status ?? 'draft',
      sub_services: practice?.sub_services ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sub_services',
  });

  const nameValue = useWatch({ control, name: 'name' }) ?? '';
  const slugValue = useWatch({ control, name: 'slug' }) ?? '';

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        name: values.name,
        status: values.status,
        slug: values.slug || slugify(values.name),
        tagline: values.tagline || null,
        summary: values.summary || null,
        icon: values.icon || null,
        color_token: values.color_token || null,
        featured_image: values.featured_image || null,
        sort_order: values.sort_order ? Number(values.sort_order) : 0,
        sub_services: values.sub_services?.map((ss, i) => ({
          id: ss.id,
          name: ss.name,
          slug: ss.slug || slugify(ss.name),
          summary: ss.summary || null,
          status: ss.status,
          sort_order: ss.sort_order ?? i,
        })),
      };
      return isEdit ? updatePractice(practice!.slug, payload) : createPractice(payload);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? 'Changes saved.' : `“${saved.name}” created.`);
      void queryClient.invalidateQueries({ queryKey: practiceQueryKeys.all });
      router.push('/admin/practices');
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
        toast.error('Could not save the practice.');
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/practices"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Practices
        </Link>
        <PageHeading
          title={isEdit ? `Edit ${practice!.name}` : 'New practice'}
          description={
            isEdit
              ? 'Update the content shown on the practice page.'
              : 'Add a new service line. It starts as a draft until you publish it.'
          }
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Identity</h2>

          <Field label="Name" htmlFor="name" error={errors.name?.message} required>
            <TextInput
              id="name"
              invalid={Boolean(errors.name)}
              {...register('name', {
                onChange: (e) => {
                  if (!isEdit && (!slugValue || slugValue === slugify(nameValue))) {
                    setValue('slug', slugify(e.target.value));
                  }
                },
              })}
            />
          </Field>

          <Field
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint={`Public URL: /practices/${slugValue || slugify(nameValue) || 'your-practice'}`}
          >
            <TextInput id="slug" invalid={Boolean(errors.slug)} {...register('slug')} />
          </Field>

          <Field label="Tagline" htmlFor="tagline" error={errors.tagline?.message} hint="One line shown in the hero.">
            <TextInput id="tagline" {...register('tagline')} />
          </Field>

          <Field label="Summary" htmlFor="summary" error={errors.summary?.message}>
            <Textarea id="summary" rows={4} {...register('summary')} />
          </Field>
        </Panel>

        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Presentation</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Icon" htmlFor="icon" error={errors.icon?.message} hint="lucide icon name, e.g. sparkles">
              <TextInput id="icon" {...register('icon')} />
            </Field>
            <Field
              label="Colour token"
              htmlFor="color_token"
              error={errors.color_token?.message}
              hint="e.g. brand-gold"
            >
              <TextInput id="color_token" {...register('color_token')} />
            </Field>
          </div>
          <Field 
            label="Featured Image URL" 
            htmlFor="featured_image" 
            error={errors.featured_image?.message} 
            hint="An absolute URL to an image (e.g. Unsplash) for the home page and services grid."
          >
            <TextInput id="featured_image" type="url" {...register('featured_image')} />
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

        <Panel className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Sub-services</h2>
            <button
              type="button"
              onClick={() => append({ name: '', slug: '', summary: '', status: 'draft' })}
              className="text-sm font-medium text-brand-navy hover:underline"
            >
              + Add sub-service
            </button>
          </div>
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative rounded-lg border border-hairline p-4 space-y-4 bg-canvas-raised">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-4 top-4 text-ink-muted hover:text-red-600"
                  title="Remove sub-service"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                
                <div className="grid gap-4 sm:grid-cols-2 pr-8">
                  <Field label="Name" htmlFor={`sub_services.${index}.name`} error={errors.sub_services?.[index]?.name?.message} required>
                    <TextInput id={`sub_services.${index}.name`} invalid={Boolean(errors.sub_services?.[index]?.name)} {...register(`sub_services.${index}.name` as const)} />
                  </Field>
                  <Field label="Slug" htmlFor={`sub_services.${index}.slug`} error={errors.sub_services?.[index]?.slug?.message}>
                    <TextInput id={`sub_services.${index}.slug`} invalid={Boolean(errors.sub_services?.[index]?.slug)} {...register(`sub_services.${index}.slug` as const)} />
                  </Field>
                </div>
                <Field label="Summary" htmlFor={`sub_services.${index}.summary`} error={errors.sub_services?.[index]?.summary?.message}>
                  <Textarea id={`sub_services.${index}.summary`} rows={2} {...register(`sub_services.${index}.summary` as const)} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Status" htmlFor={`sub_services.${index}.status`} error={errors.sub_services?.[index]?.status?.message}>
                    <Select id={`sub_services.${index}.status`} {...register(`sub_services.${index}.status` as const)}>
                      <option value="draft">Draft</option>
                      <option value="published" disabled={!canPublish}>Published</option>
                      <option value="archived">Archived</option>
                    </Select>
                  </Field>
                </div>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-ink-muted italic">No sub-services added yet.</p>
            )}
          </div>
        </Panel>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/practices"
            className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-ink-muted hover:bg-neutral-100"
          >
            Cancel
          </Link>
          <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
            {isEdit ? 'Save changes' : 'Create practice'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
