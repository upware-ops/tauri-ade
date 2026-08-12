import { CircleDashed } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TaskStatus } from './types'

interface StatusIconProps {
  status: TaskStatus
  size?: number
  className?: string
}

/**
 * Progress rings from the App Shell design. Hand-drawn rather than lucide
 * glyphs because the in-progress state is a half-filled ring lucide has no
 * equivalent for, and the set has to read as one family.
 */
export function StatusIcon({ status, size = 13, className }: StatusIconProps) {
  if (status === 'backlog') {
    return (
      <CircleDashed
        size={size}
        className={cn('text-muted-foreground', className)}
        aria-hidden
      />
    )
  }

  const r = size > 12 ? 5.2 : 5

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      className={className}
      aria-hidden
    >
      {status === 'inProgress' && (
        <>
          <circle
            cx="7"
            cy="7"
            r={r}
            fill="none"
            stroke="var(--chart-3)"
            strokeWidth="1.6"
          />
          <path
            d={`M7 ${7 - r}A${r} ${r} 0 0 1 7 ${7 + r}Z`}
            fill="var(--chart-3)"
          />
        </>
      )}
      {status === 'inReview' && (
        <circle cx="7" cy="7" r={r} fill="var(--chart-1)" />
      )}
      {status === 'done' && (
        <>
          <circle cx="7" cy="7" r={r} fill="var(--muted-foreground)" />
          <path
            d="M4.6 7l1.7 1.7 3.1-3.4"
            stroke="var(--background)"
            strokeWidth="1.4"
            fill="none"
          />
        </>
      )}
    </svg>
  )
}
