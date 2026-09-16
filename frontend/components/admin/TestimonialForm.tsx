'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createTestimonial, testimonialQueryKeys, updateTestimonial } from '@/lib/admin/testimonials';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminTestimonial } from '@/lib/admin/types';
import { useAuth } from '@/components/admin/providers';
import { AdminButton, Field, PageHeading, Panel, Select, TextInput, Textarea, useToast } from '@/components/admin/ui';

const schema = z.object({
  quote: z.string().min(1, 'Quote is required').max(2000),
  author_name: z.string().max(150).nullable().optional(),
  author_title: z.string().max(150).nullable().optional(),
  author_company: z.string().max(150).nullable().optional(),
  related_type: z.string().max(100).nullable().optional(),
  status: z.enum(['draft', 'published']),
  sort_order: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), 'Whole numbers only'),
});

type FormValues = z.infer<typeof schema>;

export function TestimonialForm({ testimonial }: { testimonial?: AdminTestimonial }) {
  const isEdit = Boolean(testimonial);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const canPublish = can('content.publish');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quote: testimonial?.quote ?? '',
      author_name: testimonial?.author_name ?? '',
      author_title: testimonial?.author_title ?? '',
      author_company: testimonial?.author_company ?? '',
      related_type: testimonial?.related_type ?? '',
      status: testimonial?.status ?? 'draft',
      sort_order: String(testimonial?.sort_order ?? 0),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        quote: values.quote,
        author_name: values.author_name || null,
        author_title: values.author_title || null,
        author_company: values.author_company || null,
        related_type: values.related_type || null,
        status: values.status,
        sort_order: values.sort_order ? Number(values.sort_order) : 0,
      };
      return isEdit ? updateTestimonial(testimonial!.id, payload) : createTestimonial(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Changes saved.' : 'Testimonial created.');
      void queryClient.invalidateQueries({ queryKey: testimonialQueryKeys.all });
      router.push('/admin/testimonials');
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
        toast.error('Could not save the testimonial.');
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/testimonials"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Testimonials
        </Link>
        <PageHeading
          title={isEdit ? 'Edit testimonial' : 'New testimonial'}
          description={
            isEdit
              ? 'Update this quote and where it appears.'
              : 'Add a quote. It starts as a draft until you publish it.'
          }
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Quote</h2>

          <Field label="Quote" htmlFor="quote" error={errors.quote?.message} required>
            <Textarea id="quote" rows={4} invalid={Boolean(errors.quote)} {...register('quote')} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Author name"
              htmlFor="author_name"
              error={errors.author_name?.message}
              hint="Leave blank for an anonymized attribution."
            >
              <TextInput id="author_name" {...register('author_name')} />
            </Field>
            <Field label="Author title" htmlFor="author_title" error={errors.author_title?.message}>
              <TextInput id="author_title" {...register('author_title')} />
            </Field>
          </div>

          <Field label="Author company" htmlFor="author_company" error={errors.author_company?.message}>
            <TextInput id="author_company" {...register('author_company')} />
          </Field>
        </Panel>

        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Placement</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Related to"
              htmlFor="related_type"
              error={errors.related_type?.message}
              hint="e.g. home, careers, ai-bees — a practice slug or a page tag."
            >
              <TextInput id="related_type" {...register('related_type')} />
            </Field>
            <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order?.message}>
              <TextInput id="sort_order" type="number" min={0} {...register('sort_order')} />
            </Field>
          </div>
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
            </Select>
          </Field>
        </Panel>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/testimonials"
            className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-ink-muted hover:bg-neutral-100"
          >
            Cancel
          </Link>
          <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
            {isEdit ? 'Save changes' : 'Create testimonial'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
