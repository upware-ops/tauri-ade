import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import i18n from '@/i18n/config'
import { useUIStore } from '@/store/ui-store'
import { registerCommands } from '@/lib/commands/registry'
import { navigationCommands } from '@/lib/commands/navigation-commands'
import { CommandPalette } from './CommandPalette'

// jsdom implements neither API, and cmdk calls both
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
)
Element.prototype.scrollIntoView = vi.fn()

describe('CommandPalette', () => {
  afterEach(async () => {
    useUIStore.setState({ commandPaletteOpen: false })
    await i18n.changeLanguage('en')
  })

  it('finds commands by their translated label', async () => {
    registerCommands(navigationCommands)
    await i18n.changeLanguage('fr')
    useUIStore.setState({ commandPaletteOpen: true })

    render(<CommandPalette />)
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'préf' },
    })

    expect(screen.getByText('Ouvrir les préférences')).toBeInTheDocument()
  })
})
