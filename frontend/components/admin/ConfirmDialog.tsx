'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { AdminButton } from './ui';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  variant = 'danger',
  pending,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-brand-navy-deep/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.16 }}
            className="relative w-full max-w-md rounded-2xl border border-hairline bg-white p-6 shadow-xl"
          >
            <div
              className={
                variant === 'danger'
                  ? 'grid size-11 place-items-center rounded-full bg-danger-surface text-danger'
                  : 'grid size-11 place-items-center rounded-full bg-brand-navy/10 text-brand-navy'
              }
            >
              <AlertTriangle className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
            {description && <p className="mt-1.5 text-sm text-ink-muted">{description}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="ghost" onClick={onCancel} disabled={pending}>
                Cancel
              </AdminButton>
              <AdminButton
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
                loading={pending}
              >
                {confirmLabel}
              </AdminButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
