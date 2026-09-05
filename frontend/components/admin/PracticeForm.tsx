'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
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
    .optional(),
  tagline: z.string().max(255).optional(),
  summary: z.string().max(2000).optional(),
  icon: z.string().max(100).optional(),
  color_token: z.string().max(50).optional(),
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
      sort_order: String(practice?.sort_order ?? 0),
      status: practice?.status ?? 'draft',
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
        tagline: values.tagline || null,
        summary: values.summary || null,
        icon: values.icon || null,
        color_token: values.color_token || null,
        sort_order: values.sort_order ? Number(values.sort_order) : 0,
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
