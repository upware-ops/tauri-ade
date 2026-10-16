import { createContext, useContext, useId, useState } from 'react'

import { cn } from '@/lib/utils'

const TabsContext = createContext({
  id: '',
  value: '',
  setValue: (_value: string) => undefined,
})

function Tabs({
  value,
  defaultValue = '',
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  onValueChange?: (value: string) => void
} & (
    | { value: string; defaultValue?: never }
    | { value?: never; defaultValue: string }
  )) {
  const id = useId()
  const [internalValue, setInternalValue] = useState(defaultValue)

  return (
    <TabsContext.Provider
      value={{
        id,
        value: value ?? internalValue,
        setValue: next => {
          if (value === undefined) setInternalValue(next)
          onValueChange?.(next)
        },
      }}
    >
      <div
        data-slot="tabs"
        className={cn('flex flex-col', className)}
        {...props}
      />
    </TabsContext.Provider>
  )
}

function TabsList({
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn('flex min-h-[37px] items-stretch border-b', className)}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (
          event.defaultPrevented ||
          !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
        )
          return

        const tabs = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>(
            '[role="tab"]:not(:disabled)'
          )
        )
        const current = tabs.indexOf(
          document.activeElement as HTMLButtonElement
        )
        const reverse =
          getComputedStyle(event.currentTarget).direction === 'rtl'
        const offset =
          (event.key === 'ArrowRight' ? 1 : -1) * (reverse ? -1 : 1)
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : (current + offset + tabs.length) % tabs.length

        event.preventDefault()
        tabs[next]?.focus()
        tabs[next]?.click()
      }}
      {...props}
    />
  )
}

function TabsTrigger({
  value,
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'> & { value: string }) {
  const tabs = useContext(TabsContext)
  const active = tabs.value === value

  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      data-state={active ? 'active' : 'inactive'}
      role="tab"
      id={`${tabs.id}-tab-${value}`}
      aria-controls={`${tabs.id}-panel-${value}`}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      className={cn(
        'inline-flex h-[37px] items-center justify-center gap-1.5 border-b-2 border-transparent bg-background px-2.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-45 data-[state=active]:border-primary data-[state=active]:text-foreground',
        className
      )}
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented) tabs.setValue(value)
      }}
      {...props}
    />
  )
}

function TabsContent({
  value,
  className,
  ...props
}: React.ComponentProps<'div'> & { value: string }) {
  const tabs = useContext(TabsContext)

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      id={`${tabs.id}-panel-${value}`}
      aria-labelledby={`${tabs.id}-tab-${value}`}
      hidden={tabs.value !== value}
      tabIndex={0}
      className={cn(
        'flex-1 outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
