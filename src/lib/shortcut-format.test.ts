import { describe, it, expect, vi } from 'vitest'
import { getPlatform } from '@/hooks/use-platform'
import {
  formatShortcutForDisplay,
  isSameShortcut,
  keyEventToShortcut,
} from './shortcut-format'

vi.mock('@/hooks/use-platform', () => ({ getPlatform: vi.fn() }))

const DEFAULT_SHORTCUT = 'CommandOrControl+Shift+.'

const keyK = (modifiers: KeyboardEventInit) =>
  new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', ...modifiers })

describe('keyEventToShortcut', () => {
  it('maps Cmd to CommandOrControl and Ctrl to Control on macOS', () => {
    vi.mocked(getPlatform).mockReturnValue('macos')

    expect(keyEventToShortcut(keyK({ metaKey: true }))).toBe(
      'CommandOrControl+K'
    )
    expect(keyEventToShortcut(keyK({ ctrlKey: true }))).toBe('Control+K')
  })

  it('maps Ctrl to CommandOrControl and Meta to Super elsewhere', () => {
    vi.mocked(getPlatform).mockReturnValue('windows')

    expect(keyEventToShortcut(keyK({ ctrlKey: true }))).toBe(
      'CommandOrControl+K'
    )
    expect(keyEventToShortcut(keyK({ metaKey: true }))).toBe('Super+K')
  })
})

describe('formatShortcutForDisplay', () => {
  it('formats key names that contain other key names', () => {
    vi.mocked(getPlatform).mockReturnValue('windows')

    expect(formatShortcutForDisplay('CommandOrControl+Backslash')).toBe(
      'Ctrl+\\'
    )
    expect(formatShortcutForDisplay('CommandOrControl+Backquote')).toBe(
      'Ctrl+`'
    )
  })

  it('names the Super key per platform', () => {
    vi.mocked(getPlatform).mockReturnValue('windows')
    expect(formatShortcutForDisplay('Super+K')).toBe('Win+K')

    vi.mocked(getPlatform).mockReturnValue('linux')
    expect(formatShortcutForDisplay('Super+K')).toBe('Super+K')
  })
})

describe('isSameShortcut', () => {
  it.each(['macos', 'windows'] as const)(
    'treats Period and . as the same key on %s',
    platform => {
      vi.mocked(getPlatform).mockReturnValue(platform)

      expect(
        isSameShortcut('CommandOrControl+Shift+Period', DEFAULT_SHORTCUT)
      ).toBe(true)
      expect(
        isSameShortcut('CommandOrControl+Shift+Comma', DEFAULT_SHORTCUT)
      ).toBe(false)
    }
  )
})
