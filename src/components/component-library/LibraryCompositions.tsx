import type { ComponentProps } from 'react'
import { Sparkles, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface IconSpecimenProps extends ComponentProps<typeof Button> {
  icon: LucideIcon
  label: string
  selected?: boolean
}

export function IconSpecimen({
  icon: Icon,
  label,
  selected = false,
  className,
  ...props
}: IconSpecimenProps) {
  return (
    <Button
      variant="ghost"
      aria-pressed={selected}
      className={cn(
        'h-[77px] w-[105px] flex-col gap-[11px] rounded-lg bg-transparent px-[7px] pt-[19px] pb-[14px] whitespace-normal [background-image:none] aria-pressed:bg-accent aria-pressed:text-foreground',
        className
      )}
      {...props}
    >
      <Icon className="size-[18px]" aria-hidden="true" />
      <span className="w-full truncate text-center font-mono text-[9.5px] leading-[1.6] font-normal text-muted-foreground">
        {label}
      </span>
    </Button>
  )
}

interface ScreenSummaryProps extends ComponentProps<'header'> {
  icon?: LucideIcon
  title: string
  description: string
  metadata: string
}

export function ScreenSummary({
  icon: Icon = Sparkles,
  title,
  description,
  metadata,
  className,
  ...props
}: ScreenSummaryProps) {
  return (
    <header
      className={cn(
        'flex w-full max-w-[360px] items-center gap-[11px]',
        className
      )}
      {...props}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand text-background [background-image:var(--grain-control)] [background-size:776px_776px]">
        <Icon className="size-[15px]" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <p className="text-[15px] leading-[1.6] font-semibold">{title}</p>
        <p className="text-xs leading-[1.6] text-muted-foreground">
          {description}
        </p>
      </div>
      <Badge
        variant="outline"
        className="h-auto rounded-md px-[9px] py-1 font-mono text-[10.5px] leading-[1.6] font-normal tracking-[0.63px] text-muted-foreground"
      >
        {metadata}
      </Badge>
    </header>
  )
}

interface ScreenPreviewCardProps extends ComponentProps<typeof Button> {
  icon: LucideIcon
  title: string
  description: string
  filename: string
  previewSrc: string
  selected?: boolean
}

export function ScreenPreviewCard({
  icon: Icon,
  title,
  description,
  filename,
  previewSrc,
  selected = false,
  className,
  ...props
}: ScreenPreviewCardProps) {
  return (
    <Button
      variant="ghost"
      aria-pressed={selected}
      className={cn(
        'min-h-[205px] h-auto w-[360px] max-w-full flex-col items-stretch justify-start gap-0 overflow-hidden rounded-[11px] border border-border bg-card p-px text-start whitespace-normal hover:bg-card aria-pressed:border-ring',
        className
      )}
      {...props}
    >
      <img
        src={previewSrc}
        alt=""
        className="h-24 w-full shrink-0 border-b object-fill"
      />
      <span className="flex flex-col gap-1 px-[13px] pt-[11px] pb-[13px]">
        <span className="flex items-center gap-[7px] text-[12.5px] leading-[1.6] font-semibold">
          <Icon
            className="size-[13px] text-muted-foreground"
            aria-hidden="true"
          />
          {title}
        </span>
        <span className="min-h-[37.78px] w-full max-w-[199.25px] text-xs leading-[1.45] font-normal text-muted-foreground">
          {description}
        </span>
        <span className="font-mono text-[10.5px] leading-[1.6] font-normal text-muted-foreground">
          {filename}
        </span>
      </span>
    </Button>
  )
}
