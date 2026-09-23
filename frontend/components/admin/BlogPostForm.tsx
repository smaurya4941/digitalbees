'use client';

import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, PenLine, X } from 'lucide-react';
import { AdminApiError } from '@/lib/admin/http';
import {
  type AdminResource,
  createResource,
  previewBody,
  resourceQueryKeys,
  updateResource,
} from '@/lib/admin/resources';
import { blogCategoryQueryKeys, listBlogCategories } from '@/lib/admin/blog-categories';
import { ImageField } from './practice/ImageField';
import { useAuth } from './providers';
import { AdminButton, Field, Panel, Select, Textarea, TextInput, useToast } from './ui';
import { cn } from '@/lib/utils/cn';
import '@/components/blog/blog-prose.css';

const optionalUrl = z
  .string()
  .max(500)
  .refine((v) => !v || /^https?:\/\//i.test(v), 'Must start with http:// or https://');

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only'),
  excerpt: z.string().max(1000),
  body: z.string().max(200000),
  blog_category_id: z.string(),
  cover_image: optionalUrl,
  cover_image_alt: z.string().max(255),
  author_name: z.string().max(150),
  author_role: z.string().max(150),
  author_avatar: optionalUrl,
  tags: z.array(z.string().max(40)).max(15, 'Up to 15 tags'),
  is_featured: z.boolean(),
  reading_time_minutes: z.string().refine((v) => !v || /^\d+$/.test(v), 'Whole minutes only'),
  status: z.enum(['draft', 'published', 'archived']),
  published_at: z.string(),
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

/** ISO string → value for <input type="datetime-local"> in the editor's timezone. */
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const MARKDOWN_HELP = '## Heading · **bold** · *italic* · [link](https://…) · - list · > quote · ```code``` · | table |';

export function BlogPostForm({ post }: { post?: AdminResource }) {
  const isEdit = Boolean(post);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const canPublish = can('content.publish');

  const { data: categories = [] } = useQuery({
    queryKey: blogCategoryQueryKeys.all,
    queryFn: ({ signal }) => listBlogCategories(signal),
  });

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      body: post?.body ?? '',
      blog_category_id: post?.blog_category_id ? String(post.blog_category_id) : '',
      cover_image: post?.cover_image ?? '',
      cover_image_alt: post?.cover_image_alt ?? '',
      author_name: post?.author_name ?? '',
      author_role: post?.author_role ?? '',
      author_avatar: post?.author_avatar ?? '',
      tags: post?.tags ?? [],
      is_featured: post?.is_featured ?? false,
      reading_time_minutes: post?.reading_time_minutes != null ? String(post.reading_time_minutes) : '',
      status: post?.status ?? 'draft',
      published_at: toLocalInput(post?.published_at),
    },
  });

  const titleValue = useWatch({ control, name: 'title' }) ?? '';
  const slugValue = useWatch({ control, name: 'slug' }) ?? '';
  const excerptValue = useWatch({ control, name: 'excerpt' }) ?? '';
  const statusValue = useWatch({ control, name: 'status' });
  const publishedAtValue = useWatch({ control, name: 'published_at' });

  // --- Body: write / preview ------------------------------------------------
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  // Captured once so render stays pure; precise enough for the "scheduled" hint.
  const [openedAt] = useState(() => Date.now());
  const preview = useMutation({ mutationFn: (body: string) => previewBody(body) });
  const showPreview = () => {
    setTab('preview');
    preview.mutate(getValues('body'));
  };

  // --- Save -----------------------------------------------------------------
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        title: values.title.trim(),
        slug: values.slug || slugify(values.title),
        resource_type: 'blog' as const,
        excerpt: values.excerpt.trim() || null,
        body: values.body || null,
        blog_category_id: values.blog_category_id ? Number(values.blog_category_id) : null,
        cover_image: values.cover_image || null,
        cover_image_alt: values.cover_image_alt.trim() || null,
        author_name: values.author_name.trim() || null,
        author_role: values.author_role.trim() || null,
        author_avatar: values.author_avatar || null,
        tags: values.tags,
        is_featured: values.is_featured,
        reading_time_minutes: values.reading_time_minutes ? Number(values.reading_time_minutes) : null,
        status: values.status,
        published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
      };
      return isEdit ? updateResource(post!.slug, payload) : createResource(payload);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? 'Post saved.' : `“${saved.title}” created.`);
      void queryClient.invalidateQueries({ queryKey: resourceQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: blogCategoryQueryKeys.all });
      router.push('/admin/blog');
    },
    onError: (error) => {
      if (error instanceof AdminApiError && error.status === 422) {
        for (const [field, messages] of Object.entries(error.errors)) {
          const key = (field.startsWith('tags.') ? 'tags' : field) as keyof FormValues;
          setError(key, { message: messages[0] });
        }
        toast.error('Please fix the highlighted fields.');
      } else if (error instanceof AdminApiError && error.isForbidden) {
        toast.error(error.message || 'You do not have permission for this action.');
      } else {
        toast.error('Could not save the post.');
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));
  const scheduled =
    statusValue === 'published' && publishedAtValue && new Date(publishedAtValue).getTime() > openedAt;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" noValidate>
      {/* ---------------- Main column ---------------- */}
      <div className="min-w-0 space-y-6">
        <Panel className="space-y-5 p-6">
          <Field label="Title" htmlFor="title" error={errors.title?.message} required>
            <TextInput
              id="title"
              invalid={Boolean(errors.title)}
              placeholder="A clear, specific headline"
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
            label="URL slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint={`Public URL: /blog/${slugValue || slugify(titleValue) || 'your-post'}${isEdit ? ' — changing it leaves a redirect from the old URL.' : ''}`}
          >
            <TextInput id="slug" invalid={Boolean(errors.slug)} {...register('slug')} />
          </Field>
          <Field
            label="Excerpt"
            htmlFor="excerpt"
            error={errors.excerpt?.message}
            hint={`Shown on post cards, under the title and in search results. ${excerptValue.length}/1000`}
          >
            <Textarea id="excerpt" rows={3} {...register('excerpt')} />
          </Field>
        </Panel>

        <Panel className="p-0">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2">
            <div role="tablist" aria-label="Body editor" className="flex gap-1">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'write'}
                onClick={() => setTab('write')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
                  tab === 'write' ? 'bg-neutral-100 text-ink' : 'text-ink-muted hover:text-ink',
                )}
              >
                <PenLine className="size-4" /> Write
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'preview'}
                onClick={showPreview}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
                  tab === 'preview' ? 'bg-neutral-100 text-ink' : 'text-ink-muted hover:text-ink',
                )}
              >
                <Eye className="size-4" /> Preview
              </button>
            </div>
            <span className="hidden text-xs text-ink-subtle sm:block">Markdown supported</span>
          </div>

          <div className="p-4">
            {tab === 'write' ? (
              <>
                <label htmlFor="body" className="sr-only">
                  Body
                </label>
                <Textarea
                  id="body"
                  rows={22}
                  className="font-mono text-[13px] leading-relaxed"
                  placeholder={'Write your post in Markdown…\n\n## A section heading\n\nA paragraph with **bold** text and a [link](https://example.com).'}
                  {...register('body')}
                />
                <p className="mt-2 text-xs text-ink-subtle">{MARKDOWN_HELP}</p>
                {errors.body?.message && <p className="mt-1 text-xs text-red-600">{errors.body.message}</p>}
              </>
            ) : (
              <div className="min-h-[420px] rounded-lg border border-neutral-100 bg-white p-6">
                {preview.isPending ? (
                  <p className="text-sm text-ink-muted">Rendering preview…</p>
                ) : preview.isError ? (
                  <p className="text-sm text-red-600">Could not render the preview. Try again.</p>
                ) : preview.data?.html ? (
                  <>
                    {preview.data.reading_time_minutes && (
                      <p className="mb-6 text-xs font-medium uppercase tracking-wider text-ink-subtle">
                        ≈ {preview.data.reading_time_minutes} min read
                      </p>
                    )}
                    {/* Server-sanitised by the same renderer the public page uses. */}
                    <div className="blog-prose" dangerouslySetInnerHTML={{ __html: preview.data.html }} />
                  </>
                ) : (
                  <p className="text-sm text-ink-muted">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* ---------------- Sidebar ---------------- */}
      <div className="space-y-6">
        <Panel className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-ink">Publishing</h2>
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
          <Field
            label="Publish date"
            htmlFor="published_at"
            error={errors.published_at?.message}
            hint={
              scheduled
                ? 'Scheduled — the post goes live at this time.'
                : 'Leave empty to use the moment you publish. A future date schedules the post.'
            }
          >
            <TextInput id="published_at" type="datetime-local" {...register('published_at')} />
          </Field>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-3">
            <input type="checkbox" className="mt-0.5 size-4 rounded border-neutral-300" {...register('is_featured')} />
            <span>
              <span className="block text-sm font-medium text-ink">Feature this post</span>
              <span className="block text-xs text-ink-muted">Shown as the lead story at the top of the blog.</span>
            </span>
          </label>
        </Panel>

        <Panel className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Category &amp; tags</h2>
            <Link href="/admin/blog/categories" className="text-xs font-medium text-brand-navy hover:underline">
              Manage categories
            </Link>
          </div>
          <Field label="Category" htmlFor="blog_category_id" error={errors.blog_category_id?.message}>
            <Select id="blog_category_id" {...register('blog_category_id')}>
              <option value="">Uncategorised</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} error={errors.tags?.message} />
            )}
          />
        </Panel>

        <Panel className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-ink">Cover image</h2>
          <Controller
            control={control}
            name="cover_image"
            render={({ field }) => (
              <ImageField value={field.value} onChange={field.onChange} error={errors.cover_image?.message} folder="blog" />
            )}
          />
          <Field label="Alt text" htmlFor="cover_image_alt" error={errors.cover_image_alt?.message} hint="Describe the image for screen readers.">
            <TextInput id="cover_image_alt" {...register('cover_image_alt')} />
          </Field>
        </Panel>

        <Panel className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-ink">Author</h2>
          <Field label="Name" htmlFor="author_name" error={errors.author_name?.message} hint="Leave empty to hide the byline.">
            <TextInput id="author_name" {...register('author_name')} />
          </Field>
          <Field label="Role" htmlFor="author_role" error={errors.author_role?.message}>
            <TextInput id="author_role" placeholder="e.g. Head of AI Delivery" {...register('author_role')} />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Photo</p>
            <Controller
              control={control}
              name="author_avatar"
              render={({ field }) => (
                <ImageField value={field.value} onChange={field.onChange} error={errors.author_avatar?.message} folder="blog-authors" />
              )}
            />
          </div>
        </Panel>

        <Panel className="space-y-4 p-5">
          <Field
            label="Reading time (minutes)"
            htmlFor="reading_time_minutes"
            error={errors.reading_time_minutes?.message}
            hint="Leave empty to calculate it from the body."
          >
            <TextInput id="reading_time_minutes" type="number" min={0} max={600} {...register('reading_time_minutes')} />
          </Field>
        </Panel>

        <div className="flex items-center justify-end gap-3 lg:sticky lg:bottom-4">
          <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/blog')}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
            {isEdit ? 'Save changes' : 'Create post'}
          </AdminButton>
        </div>
      </div>
    </form>
  );
}

/** Chip-style tag editor: Enter or comma adds a tag, Backspace on empty removes the last. */
function TagInput({ value, onChange, error }: { value: string[]; onChange: (tags: string[]) => void; error?: string }) {
  const [draft, setDraft] = useState('');

  const add = (raw: string) => {
    const tag = raw.trim().replace(/\s+/g, ' ').slice(0, 40);
    if (!tag || value.some((t) => t.toLowerCase() === tag.toLowerCase()) || value.length >= 15) return;
    onChange([...value, tag]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
      setDraft('');
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <Field label="Tags" htmlFor="tag-input" error={error} hint="Press Enter or comma to add. Readers can browse posts by tag.">
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 focus-within:border-brand-navy">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-ink">
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove tag ${tag}`}
              className="text-ink-subtle hover:text-ink"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id="tag-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            add(draft);
            setDraft('');
          }}
          placeholder={value.length ? '' : 'e.g. AI, Hiring'}
          className="min-w-[80px] flex-1 bg-transparent py-0.5 text-sm outline-none"
        />
      </div>
    </Field>
  );
}
