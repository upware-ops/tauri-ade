import * as React from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'

export function Empty() {
  const [value, setValue] = React.useState<Date | undefined>(undefined)
  return (
    <div className="grid w-[280px] gap-2">
      <Label>Release date</Label>
      <DatePicker value={value} onChange={setValue} />
    </div>
  )
}

export function Selected() {
  const [value, setValue] = React.useState<Date | undefined>(
    new Date(2024, 4, 15)
  )
  return (
    <div className="grid w-[280px] gap-2">
      <Label>Release date</Label>
      <DatePicker value={value} onChange={setValue} />
    </div>
  )
}

export function CustomPlaceholder() {
  const [value, setValue] = React.useState<Date | undefined>(undefined)
  return (
    <div className="w-[280px]">
      <DatePicker
        value={value}
        onChange={setValue}
        placeholder="Pick an expiry date"
      />
    </div>
  )
}
