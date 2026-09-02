'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';
import { control } from './controlStyles';
import { fieldAria, useField } from './Field';

type InputProps = Omit<ComponentProps<'input'>, 'id' | 'size'> & {
  inputSize?: 'md' | 'lg';
};

export function Input({ className, inputSize = 'md', ...props }: InputProps) {
  const ctx = useField();
  return (
    <input
      {...fieldAria(ctx)}
      className={cn(control({ size: inputSize }), className)}
      {...props}
    />
  );
}
