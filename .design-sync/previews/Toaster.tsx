import * as React from 'react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

// Toasts are imperative — nothing renders until one is pushed. duration=Infinity
// keeps them on screen for the static card instead of animating away.
function useToasts(push: () => void) {
  React.useEffect(push, [push])
}

export function Notifications() {
  useToasts(
    React.useCallback(() => {
      toast('Preferences saved')
      toast.success('Update installed — restart to apply')
      toast.error('Could not reach the update server')
    }, [])
  )
  return (
    <div className="h-[260px] w-full">
      <Toaster
        position="top-center"
        duration={Infinity}
        expand
        visibleToasts={3}
      />
    </div>
  )
}
