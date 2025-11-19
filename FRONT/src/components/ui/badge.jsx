import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-primary)] text-white hover:opacity-80',
        secondary:
          'border-transparent bg-[var(--color-secondary)] text-white hover:opacity-80',
        success:
          'border-transparent bg-[var(--color-success)] text-white hover:opacity-80',
        warning:
          'border-transparent bg-[var(--color-warning)] text-white hover:opacity-80',
        error:
          'border-transparent bg-[var(--color-error)] text-white hover:opacity-80',
        outline:
          'text-[var(--color-text-primary)] border-[var(--color-border)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
