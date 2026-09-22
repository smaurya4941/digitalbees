'use client';

import { useDeferredValue, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, ImagePlus, Library, Link2, Loader2, Search, Trash2, Upload, X } from 'lucide-react';
import { listMedia, mediaQueryKeys, uploadMedia, type AdminMedia } from '@/lib/admin/media';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import { AdminButton, TextInput, useToast } from '@/components/admin/ui';
import { cn } from '@/lib/utils/cn';

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * `practices.featured_image` editor. The column stores an absolute URL, so a
 * library pick or a fresh upload simply writes that asset's URL — a pasted
 * external URL still works for anything hosted elsewhere.
 */
export function ImageField({
  value,
  onChange,
  error,
  folder = 'practices',
}: {
  value: string;
  onChange: (url: string) => void;
  error?: string;
  folder?: string;
}) {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const canUpload = can('media.upload');

  const upload = useMutation({
    mutationFn: (file: File) => uploadMedia(file, folder),
    onSuccess: (media) => {
      onChange(media.url);
      toast.success('Image uploaded.');
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all });
    },
    onError: (err) =>
      toast.error(err instanceof AdminApiError && err.status === 422 ? err.message : 'Upload failed. Try a smaller JPG, PNG or WebP.'),
  });

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file.');
    if (file.size > MAX_BYTES) return toast.error('Images must be 8 MB or smaller.');
    upload.mutate(file);
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border bg-neutral-50',
          error ? 'border-danger' : 'border-hairline',
          value ? 'aspect-[16/9]' : 'aspect-[16/7]',
        )}
        onDragOver={(e) => canUpload && e.preventDefault()}
        onDrop={(e) => {
          if (!canUpload) return;
          e.preventDefault();
          onFile(e.dataTransfer.files?.[0]);
        }}
      >
        {value ? (
          <>
            <Image src={value} alt="Featured image preview" fill sizes="600px" className="object-cover" unoptimized />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/90 px-3 text-xs font-medium text-ink hover:bg-white"
              >
                <Trash2 className="size-3.5" aria-hidden /> Remove
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="grid size-11 place-items-center rounded-full bg-white text-ink-subtle shadow-sm">
              <ImageIcon className="size-5" aria-hidden />
            </div>
            <p className="text-sm font-medium text-ink">No featured image</p>
            <p className="text-xs text-ink-subtle">
              {canUpload ? 'Drop an image here, upload one, or pick from the library.' : 'Pick from the library or paste a URL.'}
            </p>
          </div>
        )}
        {upload.isPending && (
          <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
            <Loader2 className="size-6 animate-spin text-brand-navy" aria-label="Uploading" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {canUpload && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="sr-only"
              onChange={(e) => {
                onFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <AdminButton type="button" variant="secondary" size="sm" iconLeft={<Upload className="size-4" />} onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
              Upload
            </AdminButton>
          </>
        )}
        <AdminButton type="button" variant="secondary" size="sm" iconLeft={<Library className="size-4" />} onClick={() => setLibraryOpen(true)}>
          Media library
        </AdminButton>
        <AdminButton type="button" variant="ghost" size="sm" iconLeft={<Link2 className="size-4" />} onClick={() => setShowUrl((v) => !v)} aria-expanded={showUrl}>
          {showUrl ? 'Hide URL' : 'Paste URL'}
        </AdminButton>
      </div>

      {showUrl && (
        <TextInput
          type="url"
          aria-label="Featured image URL"
          placeholder="https://images.unsplash.com/…"
          value={value}
          invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <MediaLibraryDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={(media) => {
          onChange(media.url);
          setLibraryOpen(false);
        }}
      />
    </div>
  );
}

function MediaLibraryDialog({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (media: AdminMedia) => void;
}) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const dq = useDeferredValue(q);
  const filters = { q: dq, page };

  const { data, isLoading, isError } = useQuery({
    queryKey: mediaQueryKeys.list(filters),
    queryFn: ({ signal }) => listMedia(filters, signal),
    enabled: open,
  });

  const images = (data?.data ?? []).filter((m) => m.mime_type.startsWith('image/'));
  const lastPage = data?.meta?.last_page ?? 1;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Choose an image">
          <motion.div className="absolute inset-0 bg-brand-navy-deep/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          >
            <div className="flex items-center gap-3 border-b border-hairline p-4">
              <ImagePlus className="size-5 text-brand-navy" aria-hidden />
              <h2 className="flex-1 text-base font-semibold text-ink">Media library</h2>
              <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <div className="border-b border-hairline p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
                <TextInput
                  autoFocus
                  placeholder="Search images"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-neutral-100" />
                  ))}
                </div>
              ) : isError ? (
                <p className="py-10 text-center text-sm text-danger">Couldn’t load the media library.</p>
              ) : images.length === 0 ? (
                <p className="py-10 text-center text-sm text-ink-subtle">No images found. Upload one from the editor instead.</p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => onPick(m)}
                        className="group block w-full overflow-hidden rounded-xl border border-hairline text-left transition hover:border-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                      >
                        <span className="relative block aspect-[4/3] bg-neutral-50">
                          <Image src={m.url} alt={m.alt_text ?? m.name} fill sizes="200px" className="object-cover transition group-hover:scale-105" unoptimized />
                        </span>
                        <span className="block truncate px-2.5 py-2 text-xs text-ink-muted">{m.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {lastPage > 1 && (
              <div className="flex items-center justify-between border-t border-hairline p-3 text-xs text-ink-muted">
                <AdminButton type="button" variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </AdminButton>
                <span>
                  Page {page} of {lastPage}
                </span>
                <AdminButton type="button" variant="ghost" size="sm" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
                  Next
                </AdminButton>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
