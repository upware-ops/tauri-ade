import { Skeleton } from '@/components/ui/skeleton'

export function Shapes() {
  return (
    <div className="grid w-[320px] gap-3">
      <Skeleton className="h-4 w-[240px]" />
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[210px]" />
    </div>
  )
}

export function ListRow() {
  return (
    <div className="flex w-[320px] items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
    </div>
  )
}

export function CardBlock() {
  return (
    <div className="grid w-[320px] gap-4">
      <Skeleton className="h-[120px] w-full rounded-xl" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[140px]" />
    </div>
  )
}
