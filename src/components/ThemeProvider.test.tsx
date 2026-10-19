import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { commands } from '@/lib/tauri-bindings'
import { ThemeProvider } from './ThemeProvider'

describe('ThemeProvider', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('writes the saved theme preference to localStorage', async () => {
    vi.mocked(commands.loadPreferences).mockResolvedValue({
      status: 'ok',
      data: { theme: 'dark', quick_pane_shortcut: null, language: null },
    })

    render(
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider>
          <div />
        </ThemeProvider>
      </QueryClientProvider>
    )

    await waitFor(() => expect(localStorage.getItem('ui-theme')).toBe('dark'))
  })
})
