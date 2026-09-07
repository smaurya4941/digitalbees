'use client';

import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminApiError } from '@/lib/admin/http';
import {
  type AdminResource,
  RESOURCE_TYPES,
  createResource,
  resourceQueryKeys,
  updateResource,
} from '@/lib/admin/resources';
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

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only')
    .optional(),
  resource_type: z.enum(RESOURCE_TYPES),
  excerpt: z.string().max(1000).optional(),
  body: z.string().optional(),
  reading_time_minutes: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), 'Whole minutes only'),
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

export function ResourceForm({ resource }: { resource?: AdminResource }) {
  const isEdit = Boolean(resource);
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
      title: resource?.title ?? '',
      slug: resource?.slug ?? '',
      resource_type: resource?.resource_type ?? 'blog',
      excerpt: resource?.excerpt ?? '',
      body: resource?.body ?? '',
      reading_time_minutes:
        resource?.reading_time_minutes != null ? String(resource.reading_time_minutes) : '',
      status: resource?.status ?? 'draft',
    },
  });

  const titleValue = useWatch({ control, name: 'title' }) ?? '';
  const slugValue = useWatch({ control, name: 'slug' }) ?? '';

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        title: values.title,
        slug: values.slug || slugify(values.title),
        resource_type: values.resource_type,
        excerpt: values.excerpt || null,
        body: values.body || null,
        reading_time_minutes: values.reading_time_minutes
          ? Number(values.reading_time_minutes)
          : null,
        status: values.status,
      };
      return isEdit ? updateResource(resource!.slug, payload) : createResource(payload);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? 'Changes saved.' : `“${saved.title}” created.`);
      void queryClient.invalidateQueries({ queryKey: resourceQueryKeys.all });
      router.push('/admin/resources');
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
        toast.error('Could not save the resource.');
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Panel className="space-y-5 p-6">
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
        <Field
          label="Slug"
          htmlFor="slug"
          error={errors.slug?.message}
          hint={`Public URL: /${slugValue.startsWith('blog') ? 'insights' : 'resources'}/${
            slugValue || slugify(titleValue) || 'your-article'
          }`}
        >
          <TextInput id="slug" invalid={Boolean(errors.slug)} {...register('slug')} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Type" htmlFor="resource_type" error={errors.resource_type?.message}>
            <Select id="resource_type" {...register('resource_type')}>
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'blog' ? 'Blog / Insight' : t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Reading time (minutes)"
            htmlFor="reading_time_minutes"
            error={errors.reading_time_minutes?.message}
          >
            <TextInput id="reading_time_minutes" type="number" min={0} {...register('reading_time_minutes')} />
          </Field>
        </div>
      </Panel>

      <Panel className="space-y-5 p-6">
        <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message} hint="One or two sentences for cards and previews.">
          <Textarea id="excerpt" rows={3} {...register('excerpt')} />
        </Field>
        <Field label="Body" htmlFor="body" error={errors.body?.message} hint="Markdown / HTML. A rich editor lands in a later release.">
          <Textarea id="body" rows={12} className="font-mono text-xs" {...register('body')} />
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
      </Panel>

      <div className="flex items-center justify-end gap-3">
        <AdminButton
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/resources')}
        >
          Cancel
        </AdminButton>
        <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
          {isEdit ? 'Save changes' : 'Create resource'}
        </AdminButton>
      </div>
    </form>
  );
}
