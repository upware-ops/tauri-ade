'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[18px] w-8 shrink-0 items-center rounded-full p-px shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-45',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-[var(--text-inverse)] dark:data-[state=unchecked]:bg-primary pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-[14px]'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
