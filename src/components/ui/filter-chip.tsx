import { cn } from '@/lib/utils'

function FilterChip({
  active = false,
  count,
  className,
  children,
  ...props
}: React.ComponentProps<'button'> & {
  active?: boolean
  count?: React.ReactNode
}) {
  return (
    <button
      type="button"
      data-slot="filter-chip"
      data-active={active}
      aria-pressed={active}
      className={cn(
        'inline-flex h-[29px] shrink-0 items-center gap-1.5 rounded-full border border-transparent bg-background px-[11px] text-xs leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-45 data-[active=true]:border-border data-[active=true]:bg-accent data-[active=true]:text-foreground',
        className
      )}
      {...props}
    >
      {children}
      {count !== undefined && (
        <span className="font-mono text-[10.5px] text-muted-foreground">
          {count}
        </span>
      )}
    </button>
  )
}

export { FilterChip }
