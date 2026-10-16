import { Fragment, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

function InputOTP({
  value,
  defaultValue = '',
  onChange,
  maxLength = 6,
  size = 'default',
  className,
  disabled,
  onSelect,
  onFocus,
  onBlur,
  ...props
}: Omit<
  React.ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'ref'
> & {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  size?: 'sm' | 'default' | 'lg'
}) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [selection, setSelection] = useState(0)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const code = value ?? internalValue

  return (
    <div
      data-slot="input-otp"
      data-size={size}
      data-disabled={disabled}
      data-invalid={props['aria-invalid']}
      className={cn('relative inline-flex w-fit items-center gap-2', className)}
    >
      {Array.from({ length: maxLength }, (_, index) => (
        <Fragment key={index}>
          {index === 3 && maxLength > 3 && (
            <span aria-hidden="true" className="text-muted-foreground">
              −
            </span>
          )}
          <span
            data-slot="input-otp-slot"
            data-active={
              focused && Math.min(selection, maxLength - 1) === index
            }
            className="inline-flex shrink-0 items-center justify-center rounded-md border border-input bg-background font-mono text-base text-foreground"
            aria-hidden="true"
            onPointerDown={event => {
              if (disabled) return
              event.preventDefault()
              inputRef.current?.focus()
              inputRef.current?.setSelectionRange(
                Math.min(index, code.length),
                Math.min(index, code.length)
              )
              setSelection(Math.min(index, code.length))
            }}
          >
            {code[index] ??
              (focused && selection === index ? (
                <span className="h-[18px] w-px bg-foreground motion-safe:animate-pulse" />
              ) : null)}
          </span>
        </Fragment>
      ))}
      <input
        ref={inputRef}
        data-slot="input-otp-control"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        value={code}
        maxLength={maxLength}
        disabled={disabled}
        className="pointer-events-none absolute inset-0 size-full opacity-0"
        onChange={event => {
          const next = event.currentTarget.value
            .replace(/\D/g, '')
            .slice(0, maxLength)
          if (value === undefined) setInternalValue(next)
          setSelection(
            Math.min(
              event.currentTarget.selectionStart ?? next.length,
              next.length
            )
          )
          onChange?.(next)
        }}
        onSelect={event => {
          setSelection(event.currentTarget.selectionStart ?? code.length)
          onSelect?.(event)
        }}
        onFocus={event => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={event => {
          setFocused(false)
          onBlur?.(event)
        }}
        {...props}
      />
    </div>
  )
}

export { InputOTP }
