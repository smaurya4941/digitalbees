import { cva } from 'class-variance-authority';

/** Shared visual contract for text-like form controls. */
export const control = cva(
  [
    'w-full rounded-md border bg-canvas-raised px-3.5 text-body-md text-ink',
    'placeholder:text-ink-subtle',
    'transition-[border-color,box-shadow] duration-200 ease-standard',
    'disabled:cursor-not-allowed disabled:bg-canvas-sunken disabled:opacity-70',
    'aria-[invalid=true]:border-danger',
  ],
  {
    variants: {
      state: {
        default: 'border-hairline-strong focus-visible:border-focus-ring',
      },
      size: {
        md: 'h-11',
        lg: 'h-13',
      },
    },
    defaultVariants: { state: 'default', size: 'md' },
  },
);
