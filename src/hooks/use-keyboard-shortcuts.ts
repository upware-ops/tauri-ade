import { useEffect } from 'react'
import { useUIStore } from '@/store/ui-store'
import { getPlatform } from '@/hooks/use-platform'
import { toggleFullscreen } from '@/lib/app-actions'
import type { CommandContext } from '@/lib/commands/types'

/**
 * Handles global keyboard shortcuts for the application.
 * The modifier is Cmd on macOS and Ctrl elsewhere.
 *
 * Currently handles:
 * - Mod+, : Open preferences
 * - Mod+1 : Toggle left sidebar
 * - Mod+2 : Toggle right sidebar
 * - F11 (Windows/Linux) : Toggle fullscreen
 */
export function useKeyboardShortcuts(commandContext: CommandContext) {
  useEffect(() => {
    const isMacOS = getPlatform() === 'macos'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMacOS && e.key === 'F11') {
        e.preventDefault()
        void toggleFullscreen()
        return
      }

      if (isMacOS ? e.metaKey : e.ctrlKey) {
        switch (e.key) {
          case ',': {
            e.preventDefault()
            commandContext.openPreferences()
            break
          }
          case '1': {
            e.preventDefault()
            const { leftSidebarVisible, setLeftSidebarVisible } =
              useUIStore.getState()
            setLeftSidebarVisible(!leftSidebarVisible)
            break
          }
          case '2': {
            e.preventDefault()
            const { rightSidebarVisible, setRightSidebarVisible } =
              useUIStore.getState()
            setRightSidebarVisible(!rightSidebarVisible)
            break
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [commandContext])
}
