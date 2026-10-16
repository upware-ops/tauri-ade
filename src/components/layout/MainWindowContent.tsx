import { cn } from '@/lib/utils'
import { ComponentLibrary } from '@/components/component-library/ComponentLibrary'
import { useUIStore } from '@/store/ui-store'
import { HomeScreen } from './HomeScreen'

interface MainWindowContentProps {
  children?: React.ReactNode
  className?: string
}

export function MainWindowContent({
  children,
  className,
}: MainWindowContentProps) {
  const activeView = useUIStore(state => state.activeView)

  return (
    <div
      className={cn(
        'flex h-full min-h-0 min-w-0 flex-col overflow-y-auto overscroll-contain bg-background',
        className
      )}
    >
      {children ||
        (activeView === 'library' ? <ComponentLibrary /> : <HomeScreen />)}
    </div>
  )
}
