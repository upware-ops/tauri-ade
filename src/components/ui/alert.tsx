import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-[8px] border px-4 py-3.5 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-[var(--ring)]',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-destructive/10 border-destructive/45 [&>svg]:text-current *:data-[slot=alert-description]:text-muted-foreground',
        'inline-error':
          'rounded-[9px] border-destructive/45 bg-destructive/10 px-[13px] py-3 text-foreground has-[>svg]:grid-cols-[15px_1fr] has-[>svg]:gap-x-2.5 gap-y-[3px] [&>svg]:size-[15px] [&>svg]:translate-y-0 [&>svg]:text-destructive *:data-[slot=alert-title]:font-semibold *:data-[slot=alert-title]:leading-[1.6] *:data-[slot=alert-description]:text-[12.5px] *:data-[slot=alert-description]:leading-normal *:data-[slot=alert-description]:font-normal [&_[data-slot=alert-description]_p]:leading-normal',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 text-[13px] font-medium',
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-xs [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
