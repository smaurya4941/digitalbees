'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  type AdminBlogCategory,
  type BlogCategoryInput,
  blogCategoryQueryKeys,
  createBlogCategory,
  deleteBlogCategory,
  listBlogCategories,
  updateBlogCategory,
} from '@/lib/admin/blog-categories';
import { resourceQueryKeys } from '@/lib/admin/resources';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { AdminButton, EmptyState, Field, PageHeading, Panel, Spinner, TextInput, Textarea, useToast } from '@/components/admin/ui';

type Draft = { name: string; slug: string; description: string; sort_order: string };

const EMPTY: Draft = { name: '', slug: '', description: '', sort_order: '0' };

function toInput(draft: Draft, includeSlug: boolean): BlogCategoryInput {
  return {
    name: draft.name.trim(),
    ...(includeSlug && draft.slug.trim() ? { slug: draft.slug.trim() } : {}),
    description: draft.description.trim() || null,
    sort_order: Number(draft.sort_order) || 0,
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof AdminApiError && error.status === 422) {
    return Object.values(error.errors)[0]?.[0] ?? 'Please check the fields.';
  }
  if (error instanceof AdminApiError && error.isForbidden) return 'You do not have permission for this action.';
  return 'Something went wrong. Please try again.';
}

export default function BlogCategoriesPage() {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [creating, setCreating] = useState<Draft>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Draft>(EMPTY);
  const [pendingDelete, setPendingDelete] = useState<AdminBlogCategory | null>(null);

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: blogCategoryQueryKeys.all,
    queryFn: ({ signal }) => listBlogCategories(signal),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: blogCategoryQueryKeys.all });
    void queryClient.invalidateQueries({ queryKey: resourceQueryKeys.all });
  };

  const create = useMutation({
    mutationFn: (input: BlogCategoryInput) => createBlogCategory(input),
    onSuccess: (saved) => {
      toast.success(`“${saved.name}” added.`);
      setCreating(EMPTY);
      invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: number; input: BlogCategoryInput }) => updateBlogCategory(id, input),
    onSuccess: () => {
      toast.success('Category saved.');
      setEditingId(null);
      invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteBlogCategory(id),
    onSuccess: () => {
      toast.success('Category deleted. Its posts are now uncategorised.');
      setPendingDelete(null);
      invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const startEdit = (c: AdminBlogCategory) => {
    setEditingId(c.id);
    setEditing({ name: c.name, slug: c.slug, description: c.description ?? '', sort_order: String(c.sort_order) });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink">
          <ArrowLeft className="size-4" /> Blog
        </Link>
        <PageHeading
          title="Blog categories"
          description="Categories appear as filters on the blog and on every post. Lower sort order shows first."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="overflow-hidden">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Spinner />
            </div>
          ) : isError ? (
            <p className="p-6 text-sm text-red-600">Could not load categories.</p>
          ) : !categories?.length ? (
            <div className="p-6">
              <EmptyState title="No categories yet" description="Add your first category using the form." />
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {categories.map((c) =>
                editingId === c.id ? (
                  <li key={c.id} className="space-y-3 bg-neutral-50 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Name" htmlFor={`name-${c.id}`} required>
                        <TextInput id={`name-${c.id}`} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                      </Field>
                      <Field label="Slug" htmlFor={`slug-${c.id}`} hint="Changing it changes the category URL.">
                        <TextInput id={`slug-${c.id}`} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                      </Field>
                    </div>
                    <Field label="Description" htmlFor={`desc-${c.id}`}>
                      <Textarea
                        id={`desc-${c.id}`}
                        rows={2}
                        value={editing.description}
                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      />
                    </Field>
                    <div className="flex items-end justify-between gap-3">
                      <Field label="Sort order" htmlFor={`order-${c.id}`}>
                        <TextInput
                          id={`order-${c.id}`}
                          type="number"
                          min={0}
                          className="w-28"
                          value={editing.sort_order}
                          onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })}
                        />
                      </Field>
                      <div className="flex gap-2">
                        <AdminButton type="button" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="size-4" /> Cancel
                        </AdminButton>
                        <AdminButton
                          type="button"
                          loading={update.isPending}
                          disabled={!editing.name.trim()}
                          onClick={() => update.mutate({ id: c.id, input: toInput(editing, editing.slug !== c.slug) })}
                        >
                          <Check className="size-4" /> Save
                        </AdminButton>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={c.id} className="flex items-center gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink">{c.name}</span>
                        <span className="text-xs text-ink-subtle">/blog/category/{c.slug}</span>
                      </div>
                      {c.description && <p className="mt-0.5 truncate text-sm text-ink-muted">{c.description}</p>}
                    </div>
                    <span className="shrink-0 rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-ink-muted">
                      {c.posts_count ?? 0} {c.posts_count === 1 ? 'post' : 'posts'}
                    </span>
                    <div className="flex shrink-0 gap-1">
                      {can('content.update') && (
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="rounded-md p-2 text-ink-muted hover:bg-neutral-100 hover:text-ink"
                          aria-label={`Edit ${c.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                      )}
                      {can('content.delete') && (
                        <button
                          type="button"
                          onClick={() => setPendingDelete(c)}
                          className="rounded-md p-2 text-ink-muted hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </li>
                ),
              )}
            </ul>
          )}
        </Panel>

        {can('content.create') && (
          <Panel className="h-fit space-y-4 p-5">
            <h2 className="text-sm font-semibold text-ink">Add a category</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (creating.name.trim()) create.mutate(toInput(creating, true));
              }}
            >
              <Field label="Name" htmlFor="new-name" required>
                <TextInput id="new-name" value={creating.name} onChange={(e) => setCreating({ ...creating, name: e.target.value })} />
              </Field>
              <Field label="Slug" htmlFor="new-slug" hint="Optional — generated from the name.">
                <TextInput id="new-slug" value={creating.slug} onChange={(e) => setCreating({ ...creating, slug: e.target.value })} />
              </Field>
              <Field label="Description" htmlFor="new-desc" hint="Shown at the top of the category page.">
                <Textarea
                  id="new-desc"
                  rows={3}
                  value={creating.description}
                  onChange={(e) => setCreating({ ...creating, description: e.target.value })}
                />
              </Field>
              <Field label="Sort order" htmlFor="new-order">
                <TextInput
                  id="new-order"
                  type="number"
                  min={0}
                  value={creating.sort_order}
                  onChange={(e) => setCreating({ ...creating, sort_order: e.target.value })}
                />
              </Field>
              <AdminButton type="submit" loading={create.isPending} disabled={!creating.name.trim()} className="w-full">
                <Plus className="size-4" /> Add category
              </AdminButton>
            </form>
          </Panel>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete “${pendingDelete?.name ?? ''}”?`}
        description="Posts in this category stay published but become uncategorised. This cannot be undone."
        confirmLabel="Delete category"
        pending={remove.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  );
}
