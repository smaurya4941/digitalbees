'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Copy, FileText, FolderInput, Pencil, Trash2, Upload } from 'lucide-react';
import {
  type AdminMedia,
  deleteMedia,
  getMediaDetail,
  listMedia,
  mediaQueryKeys,
  updateMedia,
  uploadMedia,
} from '@/lib/admin/media';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import { Pagination } from '@/components/admin/Pagination';
import { ListToolbar } from '@/components/admin/ListToolbar';
import {
  AdminButton,
  EmptyState,
  Field,
  PageHeading,
  Panel,
  Select,
  Spinner,
  TextInput,
  useToast,
} from '@/components/admin/ui';

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function AdminMediaPage() {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<AdminMedia | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const canUpload = can('media.upload');
  const canDelete = can('media.delete');

  const { data, isLoading, isError } = useQuery({
    queryKey: mediaQueryKeys.list({ page, q, folder }),
    queryFn: ({ signal }) => listMedia({ page, q, folder }, signal),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadMedia(file, folder || undefined),
    onSuccess: () => {
      toast.success('File uploaded.');
      setPage(1);
      void invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError ? (error.fieldError('file') ?? error.message) : 'Upload failed.',
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) => deleteMedia(id, force),
    onSuccess: () => {
      toast.success('File deleted.');
      void invalidate();
    },
    onError: (error) => {
      if (error instanceof AdminApiError && error.status === 422) {
        toast.error(error.message);
      } else if (error instanceof AdminApiError && error.isForbidden) {
        toast.error('You do not have permission to delete media.');
      } else {
        toast.error('Could not delete the file.');
      }
    },
  });

  const items = data?.data ?? [];
  const meta = data?.meta;
  const folders = meta?.folders ?? [];

  async function requestDelete(item: AdminMedia) {
    let confirmMessage = `Delete “${item.name}”? This cannot be undone.`;
    try {
      const detail = await getMediaDetail(item.id);
      if (detail.usages.length > 0) {
        confirmMessage =
          `“${item.name}” is used in ${detail.usages.length} place(s):\n` +
          detail.usages.map((u) => `• ${u.label}`).join('\n') +
          `\n\nDelete anyway?`;
        if (window.confirm(confirmMessage)) deleteMutation.mutate({ id: item.id, force: true });
        return;
      }
    } catch {
      /* fall through to a plain confirm */
    }
    if (window.confirm(confirmMessage)) deleteMutation.mutate({ id: item.id });
  }

  function onCopy(item: AdminMedia) {
    void navigator.clipboard.writeText(item.url).then(() => {
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId((id) => (id === item.id ? null : id)), 1500);
    });
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Media Library"
        description="Images and documents used across the website."
        actions={
          canUpload ? (
            <>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadMutation.mutate(file);
                  e.target.value = '';
                }}
              />
              <AdminButton
                onClick={() => fileInput.current?.click()}
                loading={uploadMutation.isPending}
                iconLeft={<Upload className="size-4" />}
              >
                Upload{folder ? ` to “${folder}”` : ''}
              </AdminButton>
            </>
          ) : undefined
        }
      />

      <ListToolbar
        q={q}
        onQ={(v) => {
          setQ(v);
          setPage(1);
        }}
        placeholder="Search files"
      >
        <Select
          className="h-10 w-44"
          value={folder ?? '__any'}
          onChange={(e) => {
            const v = e.target.value;
            setFolder(v === '__any' ? undefined : v === '__none' ? '' : v);
            setPage(1);
          }}
        >
          <option value="__any">All folders</option>
          <option value="__none">No folder</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
      </ListToolbar>

      <Panel className="p-5">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load media" description="Refresh the page to try again." />
        ) : items.length === 0 ? (
          <EmptyState
            title="No media"
            description={canUpload ? 'Upload your first file to get started.' : 'Nothing has been uploaded.'}
          />
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <li key={item.id} className="group overflow-hidden rounded-xl border border-hairline bg-white">
                  <div className="relative aspect-[4/3] bg-neutral-50">
                    {item.mime_type.startsWith('image/') ? (
                      <Image
                        src={item.url}
                        alt={item.alt_text ?? item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-ink-subtle">
                        <FileText className="size-10" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-brand-navy-deep/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => onCopy(item)}
                        className="grid size-8 place-items-center rounded-lg bg-white/90 text-ink hover:bg-white"
                        aria-label={`Copy URL for ${item.name}`}
                      >
                        {copiedId === item.id ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                      </button>
                      {canUpload && (
                        <button
                          onClick={() => setEditing(item)}
                          className="grid size-8 place-items-center rounded-lg bg-white/90 text-ink hover:bg-white"
                          aria-label={`Edit ${item.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => void requestDelete(item)}
                          className="grid size-8 place-items-center rounded-lg bg-white/90 text-danger hover:bg-white"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-ink" title={item.name}>
                      {item.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-subtle">
                      {item.folder && (
                        <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-ink-muted">
                          <FolderInput className="size-3" /> {item.folder}
                        </span>
                      )}
                      {item.width && item.height ? `${item.width}×${item.height}` : ''}
                      {item.width && item.height ? ' · ' : ''}
                      {formatBytes(item.size)}
                    </p>
                    {!item.alt_text && item.mime_type.startsWith('image/') && (
                      <p className="mt-1 text-xs text-warning">No alt text</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <Pagination meta={meta} page={page} onPage={setPage} itemLabel="files" />
            </div>
          </>
        )}
      </Panel>

      {editing && (
        <EditMediaDialog
          media={editing}
          folders={folders}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void invalidate();
          }}
        />
      )}
    </div>
  );
}

function EditMediaDialog({
  media,
  folders,
  onClose,
  onSaved,
}: {
  media: AdminMedia;
  folders: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState(media.name);
  const [altText, setAltText] = useState(media.alt_text ?? '');
  const [folder, setFolder] = useState(media.folder ?? '');

  const mutation = useMutation({
    mutationFn: () =>
      updateMedia(media.id, { name, alt_text: altText || null, folder: folder || null }),
    onSuccess: () => {
      toast.success('Details saved.');
      onSaved();
    },
    onError: () => toast.error('Could not save the changes.'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy-deep/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-hairline bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-ink">Edit media</h3>
        <div className="mt-4 space-y-4">
          <Field label="File name">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Alt text" hint="Describe the image for screen readers and SEO.">
            <TextInput value={altText} onChange={(e) => setAltText(e.target.value)} />
          </Field>
          <Field label="Folder" hint="Type a new name or reuse an existing one.">
            <TextInput
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              list="media-folders"
              placeholder="e.g. Brand"
            />
            <datalist id="media-folders">
              {folders.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </AdminButton>
          <AdminButton onClick={() => mutation.mutate()} loading={mutation.isPending}>
            Save
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
