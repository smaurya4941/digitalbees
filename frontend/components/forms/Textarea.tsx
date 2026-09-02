'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';
import { control } from './controlStyles';
import { fieldAria, useField } from './Field';

type TextareaProps = Omit<ComponentProps<'textarea'>, 'id'>;

export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  const ctx = useField();
  return (
    <textarea
      {...fieldAria(ctx)}
      rows={rows}
      className={cn(control({ size: 'md' }), 'h-auto min-h-24 py-2.5', className)}
      {...props}
    />
  );
}
