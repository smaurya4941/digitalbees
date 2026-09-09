'use client';

import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminApiError } from '@/lib/admin/http';
import {
  type AdminJobPosting,
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  careerQueryKeys,
  createCareer,
  updateCareer,
} from '@/lib/admin/careers';
import { useAuth } from './providers';
import { AdminButton, Field, Panel, Select, Textarea, TextInput, useToast } from './ui';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only')
    .optional(),
  employment_type: z.enum(EMPLOYMENT_TYPES),
  description: z.string().optional(),
  ats_external_id: z.string().max(100).optional(),
  closes_at: z.string().optional(),
  status: z.enum(JOB_STATUSES),
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

export function CareerForm({ job }: { job?: AdminJobPosting }) {
  const isEdit = Boolean(job);
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
      title: job?.title ?? '',
      slug: job?.slug ?? '',
      employment_type: job?.employment_type ?? 'full_time',
      description: job?.description ?? '',
      ats_external_id: job?.ats_external_id ?? '',
      closes_at: job?.closes_at ? job.closes_at.slice(0, 10) : '',
      status: job?.status ?? 'draft',
    },
  });

  const titleValue = useWatch({ control, name: 'title' }) ?? '';
  const slugValue = useWatch({ control, name: 'slug' }) ?? '';

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        title: values.title,
        slug: values.slug || slugify(values.title),
        employment_type: values.employment_type,
        description: values.description || null,
        ats_external_id: values.ats_external_id || null,
        closes_at: values.closes_at || null,
        status: values.status,
      };
      return isEdit ? updateCareer(job!.slug, payload) : createCareer(payload);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? 'Changes saved.' : `“${saved.title}” created.`);
      void queryClient.invalidateQueries({ queryKey: careerQueryKeys.all });
      router.push('/admin/careers');
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
        toast.error('Could not save the role.');
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
          hint={`Public URL: /careers/${slugValue || slugify(titleValue) || 'your-role'}`}
        >
          <TextInput id="slug" invalid={Boolean(errors.slug)} {...register('slug')} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Employment type" htmlFor="employment_type" error={errors.employment_type?.message}>
            <Select id="employment_type" {...register('employment_type')}>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace('_', ' ')}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Closes on" htmlFor="closes_at" error={errors.closes_at?.message}>
            <TextInput id="closes_at" type="date" {...register('closes_at')} />
          </Field>
          <Field label="ATS reference" htmlFor="ats_external_id" error={errors.ats_external_id?.message} hint="Optional ID in your applicant tracking system.">
            <TextInput id="ats_external_id" {...register('ats_external_id')} />
          </Field>
          <Field
            label="Status"
            htmlFor="status"
            error={errors.status?.message}
            hint={canPublish ? undefined : 'Opening / closing a role needs content.publish.'}
          >
            <Select id="status" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="open" disabled={!canPublish}>
                Open
              </option>
              <option value="closed" disabled={!canPublish}>
                Closed
              </option>
            </Select>
          </Field>
        </div>
      </Panel>

      <Panel className="space-y-5 p-6">
        <Field label="Description" htmlFor="description" error={errors.description?.message} hint="Markdown / HTML.">
          <Textarea id="description" rows={14} className="font-mono text-xs" {...register('description')} />
        </Field>
      </Panel>

      <div className="flex items-center justify-end gap-3">
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/careers')}>
          Cancel
        </AdminButton>
        <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
          {isEdit ? 'Save changes' : 'Create role'}
        </AdminButton>
      </div>
    </form>
  );
}
