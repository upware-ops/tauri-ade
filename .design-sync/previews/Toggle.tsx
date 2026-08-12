import { Toggle } from '@/components/ui/toggle'
import { Bold, Italic, Star } from 'lucide-react'

export function Variants() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Bold">
        <Bold />
      </Toggle>
      <Toggle variant="outline" aria-label="Italic">
        <Italic />
      </Toggle>
    </div>
  )
}

export function States() {
  return (
    <div className="flex items-center gap-3">
      <Toggle defaultPressed aria-label="Pressed">
        <Star />
      </Toggle>
      <Toggle aria-label="Not pressed">
        <Star />
      </Toggle>
      <Toggle disabled aria-label="Disabled">
        <Star />
      </Toggle>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <Toggle size="sm" variant="outline">
        Small
      </Toggle>
      <Toggle size="default" variant="outline">
        Default
      </Toggle>
      <Toggle size="lg" variant="outline">
        Large
      </Toggle>
    </div>
  )
}

export function WithLabel() {
  return (
    <Toggle variant="outline" defaultPressed>
      <Star />
      Favourite
    </Toggle>
  )
}
