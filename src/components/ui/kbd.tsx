import { cn } from '@/lib/utils'

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'bg-accent text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-[5px] font-mono text-[11px] leading-[1.33] font-normal select-none',
        "[&_svg:not([class*='size-'])]:size-3",
        '[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10',
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    />
  )
}

function ShortcutHint({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="shortcut-hint"
      className={cn(
        'inline-flex items-center gap-1.5 text-[11.5px] leading-[1.6] text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

export { Kbd, KbdGroup, ShortcutHint }
