import { useState } from 'react'

import { cn } from '@/lib/utils'

function Avatar({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        'relative inline-flex size-[22px] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-secondary text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  src,
  onLoad,
  onError,
  ...props
}: React.ComponentProps<'img'>) {
  const [loadedSource, setLoadedSource] = useState<string>()
  const loaded = Boolean(src) && loadedSource === src

  return (
    <img
      data-slot="avatar-image"
      src={src}
      className={cn(
        'absolute inset-0 z-10 size-full bg-secondary object-cover',
        !loaded && 'opacity-0',
        className
      )}
      onLoad={event => {
        setLoadedSource(src)
        onLoad?.(event)
      }}
      onError={event => {
        setLoadedSource(undefined)
        onError?.(event)
      }}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center text-[9.5px] leading-none font-bold',
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
