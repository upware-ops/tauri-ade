import { getPlatform } from '@/hooks/use-platform'

/**
 * Formats a shortcut string for display with nice symbols.
 * Converts "CommandOrControl+Shift+." to "⌘⇧." on macOS or "Ctrl+Shift+." on other platforms.
 */
export function formatShortcutForDisplay(shortcut: string): string {
  const platform = getPlatform()
  const isMac = platform === 'macos'

  let formatted = shortcut
    // Handle CommandOrControl first
    .replace(/CommandOrControl/gi, isMac ? '⌘' : 'Ctrl')
    .replace(/CmdOrCtrl/gi, isMac ? '⌘' : 'Ctrl')
    // Then handle individual modifiers
    .replace(/Command/gi, '⌘')
    .replace(/Control/gi, isMac ? '⌃' : 'Ctrl')
    .replace(/Ctrl/gi, isMac ? '⌃' : 'Ctrl')
    .replace(/Shift/gi, isMac ? '⇧' : 'Shift')
    .replace(/Alt/gi, isMac ? '⌥' : 'Alt')
    .replace(/Super/gi, isMac ? '⌘' : platform === 'windows' ? 'Win' : 'Super')
    // Handle common key names
    .replace(/Period/gi, '.')
    .replace(/Comma/gi, ',')
    .replace(/Backslash/gi, '\\')
    .replace(/Slash/gi, '/')
    .replace(/BracketLeft/gi, '[')
    .replace(/BracketRight/gi, ']')
    .replace(/Semicolon/gi, ';')
    .replace(/Backquote/gi, '`')
    .replace(/Quote/gi, "'")
    .replace(/Minus/gi, '-')
    .replace(/Equal/gi, '=')
    .replace(/Space/gi, 'Space')
    .replace(/Enter/gi, '↵')
    .replace(/Escape/gi, 'Esc')
    .replace(/Backspace/gi, '⌫')
    .replace(/Delete/gi, '⌦')
    .replace(/ArrowUp/gi, '↑')
    .replace(/ArrowDown/gi, '↓')
    .replace(/ArrowLeft/gi, '←')
    .replace(/ArrowRight/gi, '→')
    .replace(/Tab/gi, '⇥')

  // On Mac, join with no separator for modifier symbols
  if (isMac) {
    // Replace + between symbols with nothing for compact display
    formatted = formatted.replace(/\+/g, '')
  }

  return formatted
}

export function isSameShortcut(a: string, b: string): boolean {
  return formatShortcutForDisplay(a) === formatShortcutForDisplay(b)
}

/**
 * Converts a KeyboardEvent to a shortcut string format that Tauri understands.
 * Returns null if no valid shortcut (e.g., just a modifier key).
 */
export function keyEventToShortcut(e: KeyboardEvent): string | null {
  // Don't capture if only modifier keys are pressed
  const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta', 'ContextMenu', 'OS']
  if (modifierKeys.includes(e.key)) {
    return null
  }

  const isMac = getPlatform() === 'macos'

  // Build the shortcut string
  const parts: string[] = []

  // Tauri reads CommandOrControl as Cmd on macOS and Ctrl elsewhere
  if (isMac ? e.metaKey : e.ctrlKey) {
    parts.push('CommandOrControl')
  }
  if (isMac ? e.ctrlKey : e.metaKey) {
    parts.push(isMac ? 'Control' : 'Super')
  }
  if (e.shiftKey) {
    parts.push('Shift')
  }
  if (e.altKey) {
    parts.push('Alt')
  }

  // Must have at least one modifier for a global shortcut
  if (parts.length === 0) {
    return null
  }

  // Map key to Tauri-compatible format
  let key = e.code

  // Handle special keys
  if (key.startsWith('Key')) {
    key = key.slice(3) // KeyA -> A
  } else if (key.startsWith('Digit')) {
    key = key.slice(5) // Digit1 -> 1
  } else if (key.startsWith('Numpad')) {
    key = 'Num' + key.slice(6) // Numpad1 -> Num1
  }

  parts.push(key)

  return parts.join('+')
}
