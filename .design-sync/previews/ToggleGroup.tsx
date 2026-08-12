import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'

export function Single() {
  return (
    <ToggleGroup type="single" defaultValue="left" variant="outline">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align centre">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export function Multiple() {
  return (
    <ToggleGroup
      type="multiple"
      defaultValue={['errors', 'warnings']}
      variant="outline"
    >
      <ToggleGroupItem value="errors">Errors</ToggleGroupItem>
      <ToggleGroupItem value="warnings">Warnings</ToggleGroupItem>
      <ToggleGroupItem value="info">Info</ToggleGroupItem>
    </ToggleGroup>
  )
}

export function Disabled() {
  return (
    <ToggleGroup type="single" defaultValue="week" variant="outline" disabled>
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}
