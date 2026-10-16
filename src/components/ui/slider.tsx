import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

function Slider({
  value,
  defaultValue = [60],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  orientation = 'horizontal',
  size = 'default',
  thumbLabels,
  className,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'default' | 'lg'
  thumbLabels?: string[]
}) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const activeThumb = useRef<number | null>(null)
  const values = value ?? internalValue
  const percent = (amount: number) =>
    max === min ? 0 : ((amount - min) / (max - min)) * 100
  const start = values.length > 1 ? percent(values[0] ?? min) : 0
  const end = percent(values[values.length - 1] ?? min)

  const updateValue = (index: number, amount: number) => {
    const next = [...values]
    const stepped = min + Math.round((amount - min) / step) * step
    next[index] = Math.min(
      values[index + 1] ?? max,
      Math.max(values[index - 1] ?? min, Number(stepped.toFixed(10)))
    )

    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  const pointerValue = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const vertical = orientation === 'vertical'
    let position = vertical
      ? 1 - (event.clientY - bounds.top) / bounds.height
      : (event.clientX - bounds.left) / bounds.width

    if (!vertical && getComputedStyle(event.currentTarget).direction === 'rtl')
      position = 1 - position
    return min + Math.min(1, Math.max(0, position)) * (max - min)
  }

  return (
    <div
      data-slot="slider"
      data-orientation={orientation}
      data-size={size}
      data-disabled={disabled}
      role="group"
      aria-disabled={disabled}
      className={cn('relative flex w-full items-center', className)}
      style={
        {
          '--slider-start': `${start}%`,
          '--slider-end': `${end}%`,
          ...style,
        } as React.CSSProperties
      }
      onPointerDown={event => {
        onPointerDown?.(event)
        if (disabled || event.defaultPrevented || event.button !== 0) return

        const amount = pointerValue(event)
        const index = values.reduce(
          (nearest, current, candidate) =>
            Math.abs(current - amount) <
              Math.abs((values[nearest] ?? min) - amount) ||
            (Math.abs(current - amount) ===
              Math.abs((values[nearest] ?? min) - amount) &&
              amount >= current)
              ? candidate
              : nearest,
          0
        )

        activeThumb.current = index
        event.currentTarget.setPointerCapture(event.pointerId)
        event.currentTarget
          .querySelectorAll<HTMLInputElement>('input')
          [index]?.focus()
        updateValue(index, amount)
        event.preventDefault()
      }}
      onPointerMove={event => {
        onPointerMove?.(event)
        if (
          !disabled &&
          !event.defaultPrevented &&
          activeThumb.current !== null
        )
          updateValue(activeThumb.current, pointerValue(event))
      }}
      onPointerUp={event => {
        activeThumb.current = null
        onPointerUp?.(event)
      }}
      onPointerCancel={event => {
        activeThumb.current = null
        onPointerCancel?.(event)
      }}
      {...props}
    >
      <div data-slot="slider-track">
        <div data-slot="slider-range" />
      </div>
      {values.map((amount, index) => (
        <input
          key={index}
          data-slot="slider-thumb"
          type="range"
          min={min}
          max={max}
          step={step}
          value={amount}
          disabled={disabled}
          aria-label={thumbLabels?.[index] ?? props['aria-label']}
          aria-labelledby={props['aria-labelledby']}
          aria-describedby={props['aria-describedby']}
          aria-orientation={orientation}
          aria-valuemin={values[index - 1] ?? min}
          aria-valuemax={values[index + 1] ?? max}
          onChange={event =>
            updateValue(index, event.currentTarget.valueAsNumber)
          }
        />
      ))}
    </div>
  )
}

export { Slider }
