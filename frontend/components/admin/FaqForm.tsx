'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createFaq, faqQueryKeys, updateFaq } from '@/lib/admin/faqs';
import { listPractices } from '@/lib/admin/practices';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminFaq, FaqableType } from '@/lib/admin/types';
import { useAuth } from '@/components/admin/providers';
import { AdminButton, Field, PageHeading, Panel, Select, TextInput, Textarea, useToast } from '@/components/admin/ui';

const schema = z.object({
  question: z.string().min(1, 'Question is required').max(500),
  answer: z.string().min(1, 'Answer is required'),
  faqable_type: z.enum(['', 'practice', 'sub_service']),
  faqable_id: z.string().nullable().optional(),
  status: z.enum(['draft', 'published']),
  sort_order: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), 'Whole numbers only'),
});

type FormValues = z.infer<typeof schema>;

export function FaqForm({ faq }: { faq?: AdminFaq }) {
  const isEdit = Boolean(faq);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const canPublish = can('content.publish');

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: faq?.question ?? '',
      answer: faq?.answer ?? '',
      faqable_type: faq?.faqable_type ?? '',
      faqable_id: faq?.faqable_id ? String(faq.faqable_id) : '',
      status: faq?.status ?? 'draft',
      sort_order: String(faq?.sort_order ?? 0),
    },
  });

  const faqableType = watch('faqable_type');

  const { data: practicesPage } = useQuery({
    queryKey: ['admin', 'practices', 'picker'],
    queryFn: () => listPractices({}),
    enabled: faqableType === 'practice',
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        question: values.question,
        answer: values.answer,
        faqable_type: (values.faqable_type || null) as FaqableType | null,
        faqable_id: values.faqable_type && values.faqable_id ? Number(values.faqable_id) : null,
        status: values.status,
        sort_order: values.sort_order ? Number(values.sort_order) : 0,
      };
      return isEdit ? updateFaq(faq!.id, payload) : createFaq(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Changes saved.' : 'FAQ created.');
      void queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });
      router.push('/admin/faqs');
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
        toast.error('Could not save the FAQ.');
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/faqs"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> FAQs
        </Link>
        <PageHeading
          title={isEdit ? 'Edit FAQ' : 'New FAQ'}
          description={
            isEdit
              ? 'Update this question and answer.'
              : 'Add a question. It starts as a draft until you publish it.'
          }
        />
      </div>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Question &amp; answer</h2>

          <Field label="Question" htmlFor="question" error={errors.question?.message} required>
            <TextInput id="question" invalid={Boolean(errors.question)} {...register('question')} />
          </Field>

          <Field label="Answer" htmlFor="answer" error={errors.answer?.message} required>
            <Textarea id="answer" rows={4} invalid={Boolean(errors.answer)} {...register('answer')} />
          </Field>
        </Panel>

        <Panel className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">Placement</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Attached to" htmlFor="faqable_type" error={errors.faqable_type?.message}>
              <Select id="faqable_type" {...register('faqable_type')}>
                <option value="">Not attached (general FAQ)</option>
                <option value="practice">A practice</option>
                <option value="sub_service">A sub-service</option>
              </Select>
            </Field>

            {faqableType === 'practice' ? (
              <Field label="Practice" htmlFor="faqable_id" error={errors.faqable_id?.message}>
                <Select id="faqable_id" {...register('faqable_id')}>
                  <option value="">Select a practice</option>
                  {practicesPage?.data.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : faqableType === 'sub_service' ? (
              <Field
                label="Sub-service ID"
                htmlFor="faqable_id"
                error={errors.faqable_id?.message}
                hint="Find the ID on the sub-service's row in its parent practice's admin page."
              >
                <TextInput id="faqable_id" type="number" min={1} {...register('faqable_id')} />
              </Field>
            ) : null}
          </div>

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
              </Select>
            </Field>
          </div>
        </Panel>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/faqs"
            className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-ink-muted hover:bg-neutral-100"
          >
            Cancel
          </Link>
          <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
            {isEdit ? 'Save changes' : 'Create FAQ'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
