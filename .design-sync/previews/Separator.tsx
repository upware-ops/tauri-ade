import { Separator } from '@/components/ui/separator'

export function Horizontal() {
  return (
    <div className="w-[320px]">
      <div className="text-sm font-medium">Appearance</div>
      <Separator className="my-3" />
      <p className="text-muted-foreground text-sm">
        Choose your preferred color theme and language.
      </p>
    </div>
  )
}

export function Vertical() {
  return (
    <div className="flex h-6 items-center gap-4 text-sm">
      <span>General</span>
      <Separator orientation="vertical" />
      <span>Appearance</span>
      <Separator orientation="vertical" />
      <span>Advanced</span>
    </div>
  )
}
