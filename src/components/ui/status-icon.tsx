import { cn } from '@/lib/utils'

function StatusIcon({
  status,
  className,
  ...props
}: React.ComponentProps<'svg'> & {
  status: 'progress' | 'review' | 'complete' | 'selection'
}) {
  return (
    <svg
      data-slot="status-icon"
      viewBox="0 0 13 13"
      aria-hidden="true"
      className={cn(
        'size-[13px] shrink-0',
        status === 'progress' && 'text-[var(--status-progress-icon)]',
        status === 'review' && 'text-[var(--success)]',
        status === 'complete' && 'text-muted-foreground',
        status === 'selection' && 'size-2 text-primary',
        className
      )}
      {...props}
    >
      {status === 'progress' ? (
        <>
          <circle
            cx="6.5"
            cy="6.5"
            r="4.82857"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.08333"
          />
          <path
            d="M6.5 1.67143a4.82857 4.82857 0 0 1 0 9.65714Z"
            fill="currentColor"
          />
        </>
      ) : (
        <circle
          cx="6.5"
          cy="6.5"
          r={status === 'selection' ? 5.41667 : 4.82857}
          fill="currentColor"
        />
      )}
      {status === 'complete' && (
        <path
          d="m4.27143 6.5 1.57857 1.57857L8.72857 4.92143"
          fill="none"
          stroke="var(--background)"
          strokeWidth="1.08333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export { StatusIcon }
