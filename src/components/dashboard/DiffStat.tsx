import { cn } from '@/lib/utils'
import type { DiffStat as DiffStatValue } from './types'

interface DiffStatProps {
  value: DiffStatValue
  /** Sidebar rows render the counts in one muted colour; cards colour them. */
  muted?: boolean
  className?: string
}

const format = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n)

export function DiffStat({ value, muted, className }: DiffStatProps) {
  const label = `+${format(value.added)} -${format(value.removed)}`

  return (
    <span
      title={label}
      className={cn(
        // shrink-0: the row's label absorbs all truncation, so counts stay readable.
        'shrink-0 font-mono text-[11px] whitespace-nowrap',
        muted && 'text-muted-foreground',
        className
      )}
    >
      {muted ? (
        label
      ) : (
        <>
          <span className="text-chart-1">+{format(value.added)}</span>{' '}
          <span className="text-destructive">-{format(value.removed)}</span>
        </>
      )}
    </span>
  )
}
