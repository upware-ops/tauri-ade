import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function SkeletonCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton-card"
      aria-hidden="true"
      className={cn(
        'flex h-12 w-[332px] max-w-full flex-col gap-2 rounded-[9px] bg-secondary p-3 shadow-[inset_0_0_0_1px_var(--border)]',
        className
      )}
      {...props}
    >
      <div className="flex gap-2">
        <Skeleton className="h-2 w-24 bg-accent opacity-[0.91]" />
        <Skeleton className="h-2 w-11 bg-accent opacity-[0.91]" />
      </div>
      <Skeleton className="h-2 w-full bg-accent opacity-[0.91]" />
    </div>
  )
}

function LoadingBoard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="loading-board"
      role="status"
      aria-busy="true"
      className={cn(
        'flex h-[218px] w-[362px] max-w-full flex-col gap-[11px] rounded-[11px] bg-card p-[15px] shadow-[inset_0_0_0_1px_var(--border)]',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <Skeleton className="size-[11px] rounded-full bg-accent opacity-[0.91]" />
        <Skeleton className="h-[9px] w-[88px] rounded-[5px] bg-accent opacity-[0.91]" />
      </div>
      <SkeletonCard className="w-full" />
      <SkeletonCard className="w-full" />
      <SkeletonCard className="w-full" />
    </div>
  )
}

export { SkeletonCard, LoadingBoard }
