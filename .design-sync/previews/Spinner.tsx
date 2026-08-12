import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function Sizes() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  )
}

export function InButton() {
  return (
    <div className="flex items-center gap-3">
      <Button disabled>
        <Spinner />
        Installing…
      </Button>
      <Button variant="outline" disabled>
        <Spinner />
        Checking for updates
      </Button>
    </div>
  )
}

export function WithLabel() {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <Spinner />
      Indexing workspace…
    </div>
  )
}
