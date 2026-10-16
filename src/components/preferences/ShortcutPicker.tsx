import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  formatShortcutForDisplay,
  isSameShortcut,
  keyEventToShortcut,
} from '@/lib/shortcut-format'

interface ShortcutPickerProps {
  id: string
  'aria-describedby'?: string
  value: string | null
  defaultValue: string
  onChange: (shortcut: string | null) => void
  disabled?: boolean
  className?: string
}

export function ShortcutPicker({
  id,
  'aria-describedby': ariaDescribedBy,
  value,
  defaultValue,
  onChange,
  disabled = false,
  className,
}: ShortcutPickerProps) {
  const { t } = useTranslation()
  const [isCapturing, setIsCapturing] = useState(false)
  const [pendingShortcut, setPendingShortcut] = useState<string | null>(null)
  const inputRef = useRef<HTMLButtonElement>(null)

  const displayValue = value ?? defaultValue
  const isDefault = value === null

  // Handle keyboard events when capturing
  useEffect(() => {
    if (!isCapturing) return

    const inputElement = inputRef.current

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Escape cancels capture
      if (e.key === 'Escape') {
        setPendingShortcut(null)
        setIsCapturing(false)
        return
      }

      const shortcut = keyEventToShortcut(e)
      if (shortcut) {
        setPendingShortcut(shortcut)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // If we have a pending shortcut and key is released, confirm it
      if (pendingShortcut) {
        // Compare to default to determine if we should save null or the shortcut
        const valueToSave = isSameShortcut(pendingShortcut, defaultValue)
          ? null
          : pendingShortcut
        onChange(valueToSave)
        setPendingShortcut(null)
        setIsCapturing(false)
      }
    }

    const handleBlur = () => {
      setPendingShortcut(null)
      setIsCapturing(false)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)
    inputElement?.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('keyup', handleKeyUp, true)
      inputElement?.removeEventListener('blur', handleBlur)
    }
  }, [isCapturing, pendingShortcut, defaultValue, onChange])

  const handleClick = () => {
    if (disabled) return
    setIsCapturing(true)
    inputRef.current?.focus()
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    onChange(null)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        id={id}
        ref={inputRef}
        type="button"
        variant="outline"
        aria-describedby={ariaDescribedBy}
        aria-pressed={isCapturing}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'h-auto min-h-8 min-w-0 flex-1 py-1.5 font-mono text-xs whitespace-normal break-words',
          isCapturing && 'border-ring ring-ring/50 ring-[3px] bg-muted/50',
          className
        )}
      >
        {isCapturing ? (
          <span className="text-muted-foreground animate-pulse">
            {pendingShortcut
              ? formatShortcutForDisplay(pendingShortcut)
              : t('preferences.general.pressShortcut')}
          </span>
        ) : (
          <span className={isDefault ? 'text-muted-foreground' : ''}>
            {formatShortcutForDisplay(displayValue)}
          </span>
        )}
      </Button>

      {!isDefault && !disabled && (
        <Button type="button" variant="ghost" size="xs" onClick={handleReset}>
          {t('common.reset')}
        </Button>
      )}
    </div>
  )
}
