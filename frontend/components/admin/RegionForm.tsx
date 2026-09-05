'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createRegion, regionQueryKeys, updateRegion } from '@/lib/admin/regions';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminRegion } from '@/lib/admin/regions';
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
    .optional(),
  summary: z.string().max(1000).optional(),
  iso_code: z.string().max(10).optional(),
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

export function RegionForm({ region }: { region?: AdminRegion }) {
  const isEdit = Boolean(region);
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
      name: region?.name ?? '',
      slug: region?.slug ?? '',
      summary: region?.summary ?? '',
      iso_code: region?.iso_code ?? '',
      sort_order: String(region?.sort_order ?? 0),
      status: region?.status ?? 'draft',
    },
  });

  const nameValue = useWatch({ control, name: 'name' }) ?? '';
  const slugValue = useWatch({ control, name: 'slug' }) ?? '';

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        name: values.name,
        status: values.status,
        slug: values.slug || slugify(values.name),
        summary: values.summary || null,
        iso_code: values.iso_code || null,
        sort_order: values.sort_order ? Number(values.sort_order) : 0,
      };
      return isEdit ? updateRegion(region!.slug, payload) : createRegion(payload);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? 'Changes saved.' : `“${saved.name}” created.`);
      void queryClient.invalidateQueries({ queryKey: regionQueryKeys.all });
      router.push('/admin/regions');
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
        toast.error('Could not save the region.');
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/regions"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Regions
        </Link>
        <PageHeading
          title={isEdit ? `Edit ${region!.name}` : 'New region'}
          description={
            isEdit
              ? 'Update the content shown on the region page.'
              : 'Add a new region. It starts as a draft until you publish it.'
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
            hint={`Public URL: /regions/${slugValue || slugify(nameValue) || 'your-region'}`}
          >
            <TextInput id="slug" invalid={Boolean(errors.slug)} {...register('slug')} />
          </Field>

          <Field label="Summary" htmlFor="summary" error={errors.summary?.message}>
            <Textarea id="summary" rows={4} {...register('summary')} />
          </Field>
        </Panel>

        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Presentation & Metadata</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="ISO Code" htmlFor="iso_code" error={errors.iso_code?.message} hint="e.g. US, UK, IN">
              <TextInput id="iso_code" {...register('iso_code')} />
            </Field>
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
            href="/admin/regions"
            className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-ink-muted hover:bg-neutral-100"
          >
            Cancel
          </Link>
          <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
            {isEdit ? 'Save changes' : 'Create region'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
