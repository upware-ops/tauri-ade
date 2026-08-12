import * as React from 'react'
import { enUS } from 'react-day-picker/locale'
import { Calendar } from '@/components/ui/calendar'

const MAY_2024 = new Date(2024, 4, 1)

export function Single() {
  const [selected, setSelected] = React.useState<Date | undefined>(
    new Date(2024, 4, 15)
  )
  return (
    <Calendar
      mode="single"
      locale={enUS}
      defaultMonth={MAY_2024}
      selected={selected}
      onSelect={setSelected}
      className="rounded-md border"
    />
  )
}

export function Range() {
  const [range, setRange] = React.useState<
    { from?: Date; to?: Date } | undefined
  >({
    from: new Date(2024, 4, 6),
    to: new Date(2024, 4, 12),
  })
  return (
    <Calendar
      mode="range"
      locale={enUS}
      defaultMonth={MAY_2024}
      selected={range as never}
      onSelect={setRange as never}
      className="rounded-md border"
    />
  )
}

export function WithDropdownCaption() {
  const [selected, setSelected] = React.useState<Date | undefined>(
    new Date(2024, 4, 15)
  )
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      locale={enUS}
      defaultMonth={MAY_2024}
      selected={selected}
      onSelect={setSelected}
      className="rounded-md border"
    />
  )
}
