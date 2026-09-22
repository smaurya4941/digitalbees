'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useWatch, useFieldArray, Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Circle,
  ExternalLink,
  Link2,
  Palette,
  Plus,
  Save,
  Search,
  Trash2,
  Type,
  LayoutList,
  Boxes,
} from 'lucide-react';
import {
  createPractice,
  getPracticeRelationOptions,
  practiceQueryKeys,
  updatePractice,
} from '@/lib/admin/practices';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminPractice, ContentStatus } from '@/lib/admin/types';
import { useAuth } from '@/components/admin/providers';
import { JsonField, ObjectListRepeater, StringListRepeater } from '@/components/admin/JsonRepeaters';
import { AdminButton, Field, Panel, StatusPill, TextInput, Textarea, useToast } from '@/components/admin/ui';
import { ColorPicker, IconPicker } from '@/components/admin/practice/VisualPickers';
import { ImageField } from '@/components/admin/practice/ImageField';
import { RelationPicker } from '@/components/admin/practice/RelationPicker';
import { practiceColor, tint } from '@/lib/practices/visuals';
import { PracticeIcon } from '@/components/ui/PracticeIcon';
import { cn } from '@/lib/utils/cn';

const statusEnum = z.enum(['draft', 'published', 'archived']);
const slugRule = z.string().max(150).regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only');

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  slug: slugRule.max(100).nullable().optional(),
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
  status: statusEnum,
  // Capability columns (PracticeDetailResource / blueprint §22, §7): loosely
  // typed here on purpose — the structured repeaters below own the shape for
  // key_stats/capabilities/workflows/agent_capabilities, and JsonField
  // validates the three nested columns itself before calling back into the
  // form. `capabilities`/`workflows` are normalized tables — `id` is present
  // when editing an existing row so the server can sync in place.
  key_stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  capabilities: z.array(z.object({ id: z.number().optional(), title: z.string(), description: z.string() })).optional(),
  workflows: z
    .array(z.object({ id: z.number().optional(), step: z.string(), title: z.string(), description: z.string() }))
    .optional(),
  agent_capabilities: z.array(z.string()).optional(),
  framework_stack: z.any().optional(),
  technical_capabilities: z.any().optional(),
  servicenow_fit: z.any().optional(),
  // Content-graph edges (PracticeService::RELATIONS) — ordered id lists.
  industry_ids: z.array(z.number()),
  technology_ids: z.array(z.number()),
  region_ids: z.array(z.number()),
  sub_services: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().trim().min(1, 'Name is required').max(150),
        slug: slugRule.nullable().optional(),
        summary: z.string().nullable().optional(),
        body: z.string().nullable().optional(),
        whats_included: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
        status: statusEnum,
        seo: z.object({
          meta_title: z.string().max(70, '70 characters max').nullable().optional(),
          meta_description: z.string().max(200, '200 characters max').nullable().optional(),
        }),
      }),
    )
    .superRefine((rows, ctx) => {
      const seen = new Map<string, number>();
      rows.forEach((row, i) => {
        const slug = row.slug || slugify(row.name);
        if (!slug) return;
        if (seen.has(slug)) {
          ctx.addIssue({ code: 'custom', path: [i, 'slug'], message: `Duplicates sub-service #${seen.get(slug)! + 1}` });
        } else {
          seen.set(slug, i);
        }
      });
    }),
});

type FormValues = z.infer<typeof schema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toFormValues(practice?: AdminPractice): FormValues {
  return {
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
    industry_ids: practice?.industry_ids ?? [],
    technology_ids: practice?.technology_ids ?? [],
    region_ids: practice?.region_ids ?? [],
    sub_services: (practice?.sub_services ?? []).map((ss) => ({
      id: ss.id,
      name: ss.name,
      slug: ss.slug,
      summary: ss.summary ?? '',
      body: ss.body ?? '',
      whats_included: ss.whats_included ?? [],
      status: ss.status,
      seo: { meta_title: ss.seo?.meta_title ?? '', meta_description: ss.seo?.meta_description ?? '' },
    })),
  };
}

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Type },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'connections', label: 'Connections', icon: Link2 },
  { id: 'content', label: 'Page content', icon: LayoutList },
  { id: 'sub-services', label: 'Sub-services', icon: Boxes },
] as const;

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
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(practice),
  });

  const subServices = useFieldArray({ control, name: 'sub_services' });

  const relationOptions = useQuery({
    queryKey: practiceQueryKeys.relationOptions,
    queryFn: ({ signal }) => getPracticeRelationOptions(signal),
    staleTime: 60_000,
  });

  const watched = useWatch({ control });
  const nameValue = watched.name ?? '';
  const slugValue = watched.slug ?? '';
  const publicSlug = slugValue || slugify(nameValue) || 'your-practice';

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

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
        industry_ids: values.industry_ids,
        technology_ids: values.technology_ids,
        region_ids: values.region_ids,
        // Array order is the display order — the up/down controls reorder it.
        sub_services: values.sub_services?.map((ss, i) => ({
          id: ss.id,
          name: ss.name,
          slug: ss.slug || slugify(ss.name),
          summary: ss.summary || null,
          body: ss.body || null,
          whats_included: ss.whats_included?.filter((w) => w.title || w.description),
          status: ss.status,
          sort_order: i,
          seo: {
            meta_title: ss.seo.meta_title || null,
            meta_description: ss.seo.meta_description || null,
          },
        })),
      };
      return isEdit ? updatePractice(practice!.slug, payload) : createPractice(payload);
    },
    onSuccess: (saved) => {
      toast.success(
        isEdit
          ? saved.status === 'published'
            ? 'Changes saved — the live site refreshes within moments.'
            : 'Changes saved.'
          : `“${saved.name}” created.`,
      );
      queryClient.setQueryData(practiceQueryKeys.detail(saved.slug), saved);
      void queryClient.invalidateQueries({ queryKey: practiceQueryKeys.all });
      reset(toFormValues(saved));
      // Stay in the editor: new practices land on their edit page (workflow,
      // SEO and history panels live there); a slug change follows the new URL.
      if (!isEdit || saved.slug !== practice!.slug) {
        router.replace(`/admin/practices/${saved.slug}`);
      }
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
    retry: false,
  });

  const onSubmit = handleSubmit(
    (values) => mutation.mutate(values),
    () => toast.error('Some fields need attention — they’re highlighted below.'),
  );
  const saving = isSubmitting || mutation.isPending;
  const saveLabel = isEdit ? 'Save changes' : 'Create practice';

  const color = practiceColor(watched.color_token);
  const subServiceCount = watched.sub_services?.length ?? 0;
  const publishedSubServices = watched.sub_services?.filter((s) => s?.status === 'published').length ?? 0;

  const checklist = [
    { label: 'Tagline', done: Boolean(watched.tagline?.trim()) },
    { label: 'Summary', done: (watched.summary?.trim().length ?? 0) >= 60 },
    { label: 'Icon & colour', done: Boolean(watched.icon && watched.color_token) },
    { label: 'Featured image', done: Boolean(watched.featured_image) },
    { label: 'Linked industries', done: (watched.industry_ids?.length ?? 0) > 0 },
    { label: 'Capability cards', done: (watched.capabilities?.length ?? 0) > 0 },
    { label: 'A published sub-service', done: publishedSubServices > 0 },
  ];
  const completeness = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 pb-24 lg:pb-0">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/admin/practices" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink">
          <ArrowLeft className="size-4" /> All practices
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="grid size-14 shrink-0 place-items-center rounded-2xl shadow-sm ring-1 ring-black/5"
              style={{ backgroundColor: tint(color, 'medium'), color }}
            >
              <PracticeIcon name={watched.icon} className="size-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-semibold tracking-tight text-ink">
                  {nameValue || (isEdit ? practice!.name : 'New practice')}
                </h1>
                <StatusPill status={(watched.status ?? 'draft') as ContentStatus} />
                {isDirty && (
                  <span className="rounded-full bg-info-surface px-2.5 py-0.5 text-xs font-medium text-info-strong">Unsaved changes</span>
                )}
              </div>
              <p className="mt-0.5 truncate font-mono text-xs text-ink-subtle">/practices/{publicSlug}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isEdit && practice!.status === 'published' && (
              <a
                href={`/practices/${practice!.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline-strong bg-white px-4 text-sm font-medium text-brand-navy hover:border-brand-navy"
              >
                <ExternalLink className="size-4" /> View live
              </a>
            )}
            <AdminButton type="submit" loading={saving} disabled={isEdit && !isDirty} iconLeft={<Save className="size-4" />} className="hidden lg:inline-flex">
              {saveLabel}
            </AdminButton>
          </div>
        </div>

        {/* Section nav */}
        <nav aria-label="Form sections" className="sticky top-16 z-20 -mx-1 overflow-x-auto bg-canvas/85 px-1 py-2 backdrop-blur [scrollbar-width:none]">
          <ul className="flex gap-1.5">
            {SECTIONS.map(({ id, label, icon: SectionIcon }) => (
              <li key={id}>
                <a
                  href={`#section-${id}`}
                  className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-hairline bg-white px-3.5 text-xs font-medium text-ink-muted transition hover:border-brand-navy/30 hover:text-ink"
                >
                  <SectionIcon className="size-3.5" aria-hidden />
                  {label}
                  {id === 'sub-services' && subServiceCount > 0 && (
                    <span className="rounded-full bg-neutral-100 px-1.5 text-[10px] tabular-nums text-ink">{subServiceCount}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <Section id="overview" title="Overview" description="How the practice is named and introduced everywhere it appears.">
            <Field label="Name" htmlFor="name" error={errors.name?.message} required>
              <TextInput
                id="name"
                placeholder="e.g. Cloud Bees"
                invalid={Boolean(errors.name)}
                {...register('name', {
                  onChange: (e) => {
                    if (!isEdit && (!slugValue || slugValue === slugify(nameValue))) {
                      setValue('slug', slugify(e.target.value), { shouldDirty: true });
                    }
                  },
                })}
              />
            </Field>

            <Field
              label="URL slug"
              htmlFor="slug"
              error={errors.slug?.message}
              hint={isEdit ? 'Changing this adds a redirect from the old URL automatically.' : 'Generated from the name — edit if you need a shorter URL.'}
            >
              <div className="flex">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-hairline-strong bg-neutral-50 px-3 font-mono text-xs text-ink-subtle">
                  /practices/
                </span>
                <TextInput id="slug" invalid={Boolean(errors.slug)} className="rounded-l-none font-mono" {...register('slug')} />
              </div>
            </Field>

            <CountedField label="Tagline" name="tagline" max={255} value={watched.tagline} error={errors.tagline?.message} hint="One line — shown in the hero, the nav menu and practice cards.">
              <TextInput id="tagline" placeholder="e.g. Cloud platforms, run like products." {...register('tagline')} />
            </CountedField>

            <CountedField label="Summary" name="summary" max={2000} value={watched.summary} error={errors.summary?.message} hint="2–3 sentences for cards, search results and the practice intro.">
              <Textarea id="summary" rows={4} {...register('summary')} />
            </CountedField>
          </Section>

          <Section id="appearance" title="Appearance" description="The colour and icon identify this practice in the nav, homepage and about page.">
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">Colour</p>
              <Controller control={control} name="color_token" render={({ field }) => <ColorPicker value={field.value} onChange={field.onChange} />} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">Icon</p>
              <Controller control={control} name="icon" render={({ field }) => <IconPicker value={field.value} onChange={field.onChange} color={color} />} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">Featured image</p>
              <p className="text-xs text-ink-subtle">Used on the services grid. Landscape, at least 1200px wide, works best.</p>
              <Controller
                control={control}
                name="featured_image"
                render={({ field }) => <ImageField value={field.value ?? ''} onChange={field.onChange} error={errors.featured_image?.message} />}
              />
              {errors.featured_image?.message && <p className="text-xs text-danger">{errors.featured_image.message}</p>}
            </div>
          </Section>

          <Section id="connections" title="Connections" description="Link this practice to the industries it serves, the technologies it builds with and the regions it delivers in. These power the related sections on every linked page.">
            {relationOptions.isError && (
              <p className="rounded-xl bg-danger-surface px-4 py-3 text-sm text-danger-strong">Couldn’t load industries, technologies and regions. Refresh to try again.</p>
            )}
            {(
              [
                ['industry_ids', 'Industries', 'Industries this practice serves.', 'industries'],
                ['technology_ids', 'Technologies', 'Platforms and tools the practice builds with.', 'technologies'],
                ['region_ids', 'Regions', 'Where the practice delivers.', 'regions'],
              ] as const
            ).map(([name, label, description, key]) => (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <RelationPicker
                    label={label}
                    description={description}
                    options={relationOptions.data?.[key] ?? []}
                    loading={relationOptions.isLoading}
                    value={field.value}
                    onChange={field.onChange}
                    emptyHint={`No ${label.toLowerCase()} exist yet — add them in the admin first.`}
                  />
                )}
              />
            ))}
          </Section>

          <Section id="content" title="Page content" description="Drives the proof bar, capability grid and delivery framework on the practice page. Anything left empty falls back to the page’s generic defaults.">
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

            <details className="group rounded-xl border border-hairline bg-neutral-50/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                <span>
                  Advanced blocks
                  <span className="ml-2 text-xs font-normal text-ink-subtle">Toolchain stack, technical capabilities, ServiceNow fit (JSON)</span>
                </span>
                <ChevronDown className="size-4 text-ink-subtle transition group-open:rotate-180" aria-hidden />
              </summary>
              <div className="space-y-6 border-t border-hairline bg-white p-4">
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
              </div>
            </details>
          </Section>

          <Section
            id="sub-services"
            title="Sub-services"
            description="Each sub-service gets its own page at /practices/{practice}/{sub-service}. Order here is the order on the site."
            action={
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                iconLeft={<Plus className="size-4" />}
                onClick={() =>
                  subServices.append(
                    { name: '', slug: '', summary: '', body: '', whats_included: [], status: 'draft', seo: { meta_title: '', meta_description: '' } },
                    { shouldFocus: true },
                  )
                }
              >
                Add sub-service
              </AdminButton>
            }
          >
            {subServices.fields.length === 0 ? (
              <div className="rounded-xl border border-dashed border-hairline-strong px-6 py-10 text-center">
                <Boxes className="mx-auto size-6 text-ink-subtle" aria-hidden />
                <p className="mt-2 text-sm font-medium text-ink">No sub-services yet</p>
                <p className="mt-1 text-xs text-ink-subtle">Break the practice into the specific services clients can buy.</p>
              </div>
            ) : (
              <ol className="space-y-3">
                {subServices.fields.map((field, index) => (
                  <SubServiceCard
                    key={field.id}
                    index={index}
                    total={subServices.fields.length}
                    practiceSlug={publicSlug}
                    control={control}
                    register={register}
                    errors={errors}
                    canPublish={canPublish}
                    onMove={(to) => subServices.move(index, to)}
                    onRemove={() => subServices.remove(index)}
                  />
                ))}
              </ol>
            )}
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
          <Panel className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-ink">Publishing</h2>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div role="radiogroup" aria-label="Status" className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-100 p-1">
                  {(['draft', 'published', 'archived'] as const).map((s) => {
                    const disabled = s === 'published' && !canPublish && field.value !== 'published';
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={field.value === s}
                        disabled={disabled}
                        onClick={() => field.onChange(s)}
                        className={cn(
                          'h-9 rounded-lg text-xs font-medium capitalize transition',
                          field.value === s ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink',
                          disabled && 'cursor-not-allowed opacity-40',
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <p className="text-xs text-ink-subtle">
              {watched.status === 'published'
                ? 'Live on the website, nav menu, homepage and footer.'
                : watched.status === 'archived'
                  ? 'Hidden from the website. Its URL returns 404.'
                  : 'Only visible here until you publish it.'}
              {!canPublish && ' Publishing needs the content.publish permission.'}
            </p>

            <Field label="Display order" htmlFor="sort_order" error={errors.sort_order?.message} hint="Lower numbers appear first.">
              <TextInput id="sort_order" type="number" min={0} className="h-10" {...register('sort_order')} />
            </Field>

            {isEdit && practice!.updated_at && (
              <p className="text-xs text-ink-subtle">
                Last saved {new Date(practice!.updated_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}

            <div className="flex gap-2 border-t border-hairline pt-4">
              <AdminButton type="submit" loading={saving} disabled={isEdit && !isDirty} className="flex-1" iconLeft={<Save className="size-4" />}>
                {saveLabel}
              </AdminButton>
              {isDirty && (
                <AdminButton type="button" variant="ghost" onClick={() => reset()} disabled={saving}>
                  Discard
                </AdminButton>
              )}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="border-b border-hairline px-5 py-3">
              <h2 className="text-sm font-semibold text-ink">Live preview</h2>
              <p className="text-xs text-ink-subtle">How the card appears on the homepage.</p>
            </div>
            <div className="bg-[#FAFCFF] p-4">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_rgba(11,31,58,0.07)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-xl" style={{ backgroundColor: tint(color), color }}>
                    <PracticeIcon name={watched.icon} className="size-5" />
                  </div>
                  {publishedSubServices > 0 && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                      {publishedSubServices} {publishedSubServices === 1 ? 'service' : 'services'}
                    </span>
                  )}
                </div>
                <p className="text-base font-bold text-[#0B1F3A]">{nameValue || 'Practice name'}</p>
                <p className="mt-1 text-xs font-semibold leading-snug text-[#0B1F3A]/90">{watched.tagline || 'Your one-line tagline appears here.'}</p>
                <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-600">
                  {watched.summary || 'The summary gives visitors a two or three sentence picture of the practice.'}
                </p>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Completeness</h2>
              <span className="text-xs font-semibold tabular-nums text-ink">{completeness}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${completeness}%` }} />
            </div>
            <ul className="mt-4 space-y-2">
              {checklist.map((item) => (
                <li key={item.label} className={cn('flex items-center gap-2 text-xs', item.done ? 'text-ink' : 'text-ink-subtle')}>
                  {item.done ? <CheckCircle2 className="size-4 text-success" aria-hidden /> : <Circle className="size-4" aria-hidden />}
                  {item.label}
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>

      {/* Mobile save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <span className="truncate text-xs text-ink-subtle">{isDirty ? 'You have unsaved changes' : 'All changes saved'}</span>
          <AdminButton type="submit" loading={saving} disabled={isEdit && !isDirty} size="sm" iconLeft={<Save className="size-4" />}>
            {saveLabel}
          </AdminButton>
        </div>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

function Section({
  id,
  title,
  description,
  action,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Panel>
      <section id={`section-${id}`} aria-labelledby={`section-${id}-title`} className="scroll-mt-36">
        <header className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-4">
          <div>
            <h2 id={`section-${id}-title`} className="text-base font-semibold text-ink">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-xs leading-relaxed text-ink-subtle">{description}</p>}
          </div>
          {action}
        </header>
        <div className="space-y-6 p-6">{children}</div>
      </section>
    </Panel>
  );
}

function CountedField({
  label,
  name,
  max,
  value,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  max: number;
  value: string | null | undefined;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const length = value?.length ?? 0;
  return (
    <div className="relative">
      <Field label={label} htmlFor={name} error={error} hint={hint}>
        {children}
      </Field>
      <span className={cn('absolute right-0 top-0 text-xs tabular-nums', length > max ? 'text-danger' : 'text-ink-subtle')}>
        {length}/{max}
      </span>
    </div>
  );
}

function SubServiceCard({
  index,
  total,
  practiceSlug,
  control,
  register,
  errors,
  canPublish,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  practiceSlug: string;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  canPublish: boolean;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  const row = useWatch({ control, name: `sub_services.${index}` });
  // `fields[].id` is react-hook-form's own key; the database id lives on the row value.
  // New (unsaved) rows start expanded, existing ones collapsed.
  const [open, setOpen] = useState(() => !row?.id);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const rowErrors = errors.sub_services?.[index];
  const slug = row?.slug || slugify(row?.name ?? '') || 'sub-service';
  const prefix = `sub_services.${index}` as const;

  // A card with a validation error is always shown expanded.
  const expanded = open || Boolean(rowErrors);

  const snippetTitle = useMemo(() => row?.seo?.meta_title || row?.name || 'Sub-service', [row?.seo?.meta_title, row?.name]);

  return (
    <li className={cn('overflow-hidden rounded-xl border bg-white transition-shadow', rowErrors ? 'border-danger/50' : 'border-hairline', expanded && 'shadow-sm')}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-neutral-100 text-xs font-semibold tabular-nums text-ink-muted">{index + 1}</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-ink">{row?.name || 'Untitled sub-service'}</span>
            <span className="block truncate font-mono text-[11px] text-ink-subtle">/{practiceSlug}/{slug}</span>
          </span>
          <StatusPill status={(row?.status ?? 'draft') as ContentStatus} />
          <ChevronDown className={cn('size-4 shrink-0 text-ink-subtle transition', expanded && 'rotate-180')} aria-hidden />
        </button>
        <div className="flex shrink-0 items-center">
          <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(index - 1)}>
            <ArrowUp className="size-4" />
          </IconButton>
          <IconButton label="Move down" disabled={index === total - 1} onClick={() => onMove(index + 1)}>
            <ArrowDown className="size-4" />
          </IconButton>
          {confirmRemove ? (
            <span className="ml-1 flex items-center gap-1">
              <button type="button" onClick={onRemove} className="h-8 rounded-lg bg-danger px-2.5 text-xs font-medium text-white hover:bg-danger-strong">
                Remove
              </button>
              <button type="button" onClick={() => setConfirmRemove(false)} className="h-8 rounded-lg px-2 text-xs text-ink-muted hover:bg-neutral-100">
                Keep
              </button>
            </span>
          ) : (
            <IconButton label="Remove sub-service" tone="danger" onClick={() => setConfirmRemove(true)}>
              <Trash2 className="size-4" />
            </IconButton>
          )}
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 border-t border-hairline bg-neutral-50/40 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor={`${prefix}.name`} error={rowErrors?.name?.message} required>
              <TextInput id={`${prefix}.name`} invalid={Boolean(rowErrors?.name)} {...register(`${prefix}.name`)} />
            </Field>
            <Field label="Slug" htmlFor={`${prefix}.slug`} error={rowErrors?.slug?.message} hint="Leave blank to generate from the name.">
              <TextInput id={`${prefix}.slug`} className="font-mono" invalid={Boolean(rowErrors?.slug)} {...register(`${prefix}.slug`)} />
            </Field>
          </div>

          <Field label="Status" htmlFor={`${prefix}.status`}>
            <Controller
              control={control}
              name={`${prefix}.status`}
              render={({ field }) => (
                <div role="radiogroup" aria-label="Sub-service status" className="inline-grid grid-cols-3 gap-1 rounded-xl bg-neutral-100 p-1">
                  {(['draft', 'published', 'archived'] as const).map((s) => {
                    const disabled = s === 'published' && !canPublish && field.value !== 'published';
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={field.value === s}
                        disabled={disabled}
                        onClick={() => field.onChange(s)}
                        className={cn(
                          'h-8 rounded-lg px-3 text-xs font-medium capitalize transition',
                          field.value === s ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink',
                          disabled && 'cursor-not-allowed opacity-40',
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </Field>

          <Field label="Summary" htmlFor={`${prefix}.summary`} hint="Shown on the practice page’s service list.">
            <Textarea id={`${prefix}.summary`} rows={2} className="min-h-[72px]" {...register(`${prefix}.summary`)} />
          </Field>
          <Field label="Body" htmlFor={`${prefix}.body`} hint="Long-form copy for the sub-service detail page.">
            <Textarea id={`${prefix}.body`} rows={5} {...register(`${prefix}.body`)} />
          </Field>

          <Controller
            control={control}
            name={`${prefix}.whats_included`}
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

          <div className="space-y-4 rounded-xl border border-hairline bg-white p-4">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-ink-subtle" aria-hidden />
              <p className="text-sm font-medium text-ink">Search appearance</p>
            </div>
            <CountedField label="Meta title" name={`${prefix}.seo.meta_title`} max={70} value={row?.seo?.meta_title} error={rowErrors?.seo?.meta_title?.message} hint="Defaults to the sub-service name.">
              <TextInput id={`${prefix}.seo.meta_title`} invalid={Boolean(rowErrors?.seo?.meta_title)} {...register(`${prefix}.seo.meta_title`)} />
            </CountedField>
            <CountedField
              label="Meta description"
              name={`${prefix}.seo.meta_description`}
              max={200}
              value={row?.seo?.meta_description}
              error={rowErrors?.seo?.meta_description?.message}
              hint="Aim for 140–160 characters."
            >
              <Textarea id={`${prefix}.seo.meta_description`} rows={2} className="min-h-[72px]" {...register(`${prefix}.seo.meta_description`)} />
            </CountedField>
            <div className="rounded-lg bg-neutral-50 p-3" aria-label="Search result preview">
              <p className="truncate text-[11px] text-ink-subtle">teambees.com › practices › {practiceSlug} › {slug}</p>
              <p className="truncate text-sm font-medium text-[#1a0dab]">{snippetTitle}</p>
              <p className="line-clamp-2 text-xs text-ink-muted">
                {row?.seo?.meta_description || row?.summary || 'Add a meta description to control the snippet search engines show.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  tone = 'default',
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'default' | 'danger';
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'grid size-8 place-items-center rounded-lg text-ink-muted transition disabled:pointer-events-none disabled:opacity-30',
        tone === 'danger' ? 'hover:bg-danger-surface hover:text-danger' : 'hover:bg-neutral-100 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}
