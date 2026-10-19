import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { emit, listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { MessageSquareText } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import i18n from '@/i18n/config'
import { commands } from '@/lib/tauri-bindings'
import { logger } from '@/lib/logger'

/** Dismiss the quick pane window, logging any errors */
async function dismissQuickPane() {
  const result = await commands.dismissQuickPane()
  if (result.status === 'error') {
    logger.error('Failed to dismiss quick pane', { error: result.error })
  }
}

/**
 * QuickPaneApp - A minimal floating window for quick text entry.
 *
 * This component demonstrates the quick pane pattern:
 * - Single text input with submit on Enter
 * - Emits 'quick-pane-submit' event with the entered text
 * - Theme and language synced with main window via localStorage
 * - Hides window on submit or Escape
 */
// Apply theme from localStorage to document
function applyTheme() {
  const theme = localStorage.getItem('ui-theme') || 'system'
  const root = document.documentElement

  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

function applyLanguage() {
  const language = localStorage.getItem('ui-language')
  if (language) {
    void i18n.changeLanguage(language)
  }
}

export default function QuickPaneApp() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Apply theme and language on mount and listen for theme changes
  useEffect(() => {
    applyTheme()
    applyLanguage()

    const unlisten = listen('theme-changed', () => {
      applyTheme()
    })

    return () => {
      unlisten.then(fn => fn())
    }
  }, [])

  // Focus input when window becomes visible, hide on blur
  useEffect(() => {
    const currentWindow = getCurrentWindow()
    const unlisten = currentWindow.onFocusChanged(
      async ({ payload: focused }) => {
        if (focused) {
          // Re-apply theme and language in case they changed while hidden
          applyTheme()
          applyLanguage()
          inputRef.current?.focus()
        } else {
          // Hide window when it loses focus (dismiss on blur)
          // Use dismiss command for consistent behavior (no animation)
          await dismissQuickPane()
        }
      }
    )

    return () => {
      unlisten.then(fn => fn())
    }
  }, [])

  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault() // Prevent system "boop" sound
        await dismissQuickPane()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (text.trim()) {
      // Emit the event for main window to handle
      await emit('quick-pane-submit', { text: text.trim() })
      setText('')
    }

    // Use dismiss command to avoid space switching on macOS
    await dismissQuickPane()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="quick-pane-surface flex h-dvh w-screen items-center rounded-[var(--app-corner-radius)] border border-border bg-background p-3 text-foreground"
    >
      <InputGroup>
        <InputGroupAddon>
          <MessageSquareText aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          aria-label={t('quickPane.placeholder')}
          placeholder={t('quickPane.placeholder')}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <InputGroupAddon align="inline-end">
          <Kbd aria-hidden="true">↵</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
