'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, X } from 'lucide-react';
import { ImageField } from '@/components/admin/practice/ImageField';
import { AdminButton, Field, TextInput } from '@/components/admin/ui';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Markdown for an inline body image. A caption needs a <figure>, which the
 * server-side BlogContentRenderer allowlists alongside <img>/<figcaption>.
 */
export function imageMarkdown(url: string, alt: string, caption: string): string {
  if (caption) {
    return [
      '<figure>',
      `  <img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" />`,
      `  <figcaption>${escapeHtml(caption)}</figcaption>`,
      '</figure>',
    ].join('\n');
  }
  const safeAlt = alt.replace(/[[\]\\]/g, '\\$&');
  // Angle brackets let URLs with spaces or parentheses survive Markdown parsing.
  const safeUrl = /[\s()]/.test(url) ? `<${url.replace(/[<>]/g, encodeURIComponent)}>` : url;
  return `![${safeAlt}](${safeUrl})`;
}

export function InsertImageDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (markdown: string) => void;
}) {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');

  const close = () => {
    setUrl('');
    setAlt('');
    setCaption('');
    onClose();
  };

  const validUrl = /^(https?:\/\/|\/)\S+$/i.test(url.trim());

  const insert = () => {
    if (!validUrl) return;
    onInsert(imageMarkdown(url.trim(), alt.trim(), caption.trim()));
    close();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Insert image">
          <motion.div
            className="absolute inset-0 bg-brand-navy-deep/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onKeyDown={(e) => e.key === 'Escape' && close()}
          >
            <div className="flex items-center gap-3 border-b border-hairline p-4">
              <ImagePlus className="size-5 text-brand-navy" aria-hidden />
              <h2 className="flex-1 text-base font-semibold text-ink">Insert image</h2>
              <button type="button" onClick={close} className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <ImageField value={url} onChange={setUrl} folder="blog" label="image selected" />
              <Field label="Alt text" htmlFor="insert-image-alt" hint="Describe the image for screen readers and search engines.">
                <TextInput id="insert-image-alt" value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={255} />
              </Field>
              <Field label="Caption (optional)" htmlFor="insert-image-caption" hint="Shown in small text under the image.">
                <TextInput id="insert-image-caption" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={300} />
              </Field>
            </div>

            <div className="flex justify-end gap-2 border-t border-hairline p-4">
              <AdminButton type="button" variant="ghost" onClick={close}>
                Cancel
              </AdminButton>
              <AdminButton type="button" onClick={insert} disabled={!validUrl}>
                Insert image
              </AdminButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
