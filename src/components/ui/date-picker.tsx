import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  id?: string
  'aria-label'?: string
  disabled?: boolean
  clearLabel?: string
}

function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  id,
  'aria-label': ariaLabel,
  disabled,
  clearLabel = 'Clear',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          aria-label={ariaLabel}
          disabled={disabled}
          variant="outline"
          className={`w-full justify-between font-normal ${className || ''}`}
        >
          {value ? value.toLocaleDateString() : placeholder}
          <ChevronDownIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-x-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={date => {
            onChange?.(date)
            setOpen(false)
          }}
        />
        {value && (
          <div className="border-t p-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange?.(undefined)
                setOpen(false)
              }}
            >
              {clearLabel}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
