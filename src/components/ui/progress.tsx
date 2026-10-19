import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  max = 100,
  ...props
}: React.ComponentProps<'div'> & { value?: number; max?: number }) {
  const progress =
    value === undefined ? undefined : Math.min(max, Math.max(0, value))

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={progress}
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn(
          'h-full rounded-full bg-primary transition-[width]',
          progress === undefined && 'motion-safe:animate-pulse'
        )}
        style={{
          width: `${progress === undefined ? 40 : (progress / max) * 100}%`,
        }}
      />
    </div>
  )
}

export { Progress }
