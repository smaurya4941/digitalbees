'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { createPractice, practiceQueryKeys, updatePractice } from '@/lib/admin/practices';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminPractice } from '@/lib/admin/types';
import { useAuth } from '@/components/admin/providers';
import { JsonField, ObjectListRepeater, StringListRepeater } from '@/components/admin/JsonRepeaters';
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
  // Capability columns (PracticeDetailResource / blueprint §22, §7): loosely
  // typed here on purpose — the structured repeaters below own the shape for
  // key_stats/capabilities/workflows/agent_capabilities, and JsonField
  // validates the three columns with real nesting
  // (framework_stack/technical_capabilities/servicenow_fit) itself before
  // ever calling back into the form. `capabilities`/`workflows` are the
  // normalized tables (see backend Capability/Workflow models) — `id` is
  // present when editing an existing row so the server can sync in place.
  key_stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  capabilities: z.array(z.object({ id: z.number().optional(), title: z.string(), description: z.string() })).optional(),
  workflows: z
    .array(z.object({ id: z.number().optional(), step: z.string(), title: z.string(), description: z.string() }))
    .optional(),
  agent_capabilities: z.array(z.string()).optional(),
  framework_stack: z.any().optional(),
  technical_capabilities: z.any().optional(),
  servicenow_fit: z.any().optional(),
  sub_services: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, 'Name is required').max(150),
      slug: z.string().max(150).regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only').nullable().optional(),
      summary: z.string().nullable().optional(),
      body: z.string().nullable().optional(),
      whats_included: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
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
      key_stats: practice?.key_stats ?? [],
      capabilities: practice?.capabilities ?? [],
      workflows: (practice?.workflows ?? []).map((s) => ({ ...s, step: String(s.step) })),
      agent_capabilities: practice?.agent_capabilities ?? [],
      framework_stack: practice?.framework_stack ?? [],
      technical_capabilities: practice?.technical_capabilities ?? [],
      servicenow_fit: practice?.servicenow_fit ?? null,
      sub_services: (practice?.sub_services ?? []).map((ss) => ({ ...ss, whats_included: ss.whats_included ?? [] })),
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
        key_stats: values.key_stats?.filter((s) => s.value || s.label),
        capabilities: values.capabilities?.filter((c) => c.title || c.description),
        workflows: values.workflows
          ?.filter((s) => s.title || s.description)
          .map((s, i) => ({ ...s, step: s.step ? Number(s.step) : i + 1 })),
        agent_capabilities: values.agent_capabilities?.filter((a) => a.trim() !== ''),
        framework_stack: values.framework_stack ?? undefined,
        technical_capabilities: values.technical_capabilities ?? undefined,
        servicenow_fit: values.servicenow_fit ?? undefined,
        sub_services: values.sub_services?.map((ss, i) => ({
          id: ss.id,
          name: ss.name,
          slug: ss.slug || slugify(ss.name),
          summary: ss.summary || null,
          body: ss.body || null,
          whats_included: ss.whats_included?.filter((w) => w.title || w.description),
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

        <Panel className="space-y-8 p-6">
          <div>
            <h2 className="text-sm font-semibold text-ink">Capability content</h2>
            <p className="mt-1 text-xs text-ink-subtle">
              Drives the proof bar, capability grid, and delivery-framework sections on the practice page. Leave
              anything empty to fall back to the page&rsquo;s generic defaults.
            </p>
          </div>

          <Controller
            control={control}
            name="key_stats"
            render={({ field }) => (
              <ObjectListRepeater
                label="Key stats"
                hint="The proof-bar stat tiles shown under the hero."
                items={field.value ?? []}
                onChange={field.onChange}
                fields={[
                  { name: 'value', label: 'Value', placeholder: 'e.g. 30+' },
                  { name: 'label', label: 'Label', placeholder: 'e.g. Workflows automated' },
                ]}
                newItem={() => ({ value: '', label: '' })}
                addLabel="Add stat"
              />
            )}
          />

          <Controller
            control={control}
            name="capabilities"
            render={({ field }) => (
              <ObjectListRepeater
                label="Key capabilities"
                hint="Capability cards shown on the practice page."
                items={field.value ?? []}
                onChange={field.onChange}
                fields={[
                  { name: 'title', label: 'Title' },
                  { name: 'description', label: 'Description', type: 'textarea' },
                ]}
                newItem={() => ({ title: '', description: '' })}
                addLabel="Add capability"
              />
            )}
          />

          <Controller
            control={control}
            name="workflows"
            render={({ field }) => (
              <ObjectListRepeater
                label="Delivery framework / how we work"
                hint="Numbered steps shown as this practice's delivery process. Leave the step number blank to auto-number."
                items={field.value ?? []}
                onChange={field.onChange}
                fields={[
                  { name: 'step', label: 'Step #', type: 'number' },
                  { name: 'title', label: 'Title' },
                  { name: 'description', label: 'Description', type: 'textarea' },
                ]}
                newItem={() => ({ step: '', title: '', description: '' })}
                addLabel="Add step"
              />
            )}
          />

          <Controller
            control={control}
            name="agent_capabilities"
            render={({ field }) => (
              <StringListRepeater
                label="Capability bullet list"
                hint="A flat list of short capability statements (AI Bees uses this for its agent-capability checklist)."
                items={field.value ?? []}
                onChange={field.onChange}
                placeholder="e.g. RAG pipelines for domain-specific knowledge retrieval"
                addLabel="Add bullet"
              />
            )}
          />

          <Controller
            control={control}
            name="framework_stack"
            render={({ field }) => (
              <JsonField
                label="Framework / toolchain stack"
                hint={'Array of { category, tools: string[] } rows — the stack table on the practice page.'}
                value={field.value}
                onChange={field.onChange}
                rows={6}
              />
            )}
          />

          <Controller
            control={control}
            name="technical_capabilities"
            render={({ field }) => (
              <JsonField
                label="Technical capabilities"
                hint={'Array of { title, points: string[], proven_in: string[] } cards.'}
                value={field.value}
                onChange={field.onChange}
                rows={10}
              />
            )}
          />

          <Controller
            control={control}
            name="servicenow_fit"
            render={({ field }) => (
              <JsonField
                label="ServiceNow fit"
                hint={'{ delivery: [{ label, items: string[] }], cards: [{ title, description }] } — cross-practice overlap block.'}
                value={field.value}
                onChange={field.onChange}
                emptyValue={{ delivery: [], cards: [] }}
                rows={10}
              />
            )}
          />
        </Panel>

        <Panel className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Sub-services</h2>
            <button
              type="button"
              onClick={() => append({ name: '', slug: '', summary: '', body: '', whats_included: [], status: 'draft' })}
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
                <Field label="Body" htmlFor={`sub_services.${index}.body`} error={errors.sub_services?.[index]?.body?.message} hint="Long-form copy for the sub-service detail page.">
                  <Textarea id={`sub_services.${index}.body`} rows={3} {...register(`sub_services.${index}.body` as const)} />
                </Field>

                <Controller
                  control={control}
                  name={`sub_services.${index}.whats_included`}
                  render={({ field }) => (
                    <ObjectListRepeater
                      label="What's included"
                      hint="The bullet list on the sub-service detail page."
                      items={field.value ?? []}
                      onChange={field.onChange}
                      fields={[
                        { name: 'title', label: 'Title' },
                        { name: 'description', label: 'Description', type: 'textarea' },
                      ]}
                      newItem={() => ({ title: '', description: '' })}
                      addLabel="Add item"
                    />
                  )}
                />

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
