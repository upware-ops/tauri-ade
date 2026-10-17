import { render, screen } from '@/test/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { listen } from '@tauri-apps/api/event'
import { MotionConfig } from 'motion/react'
import { commands } from '@/lib/tauri-bindings'
import App from './App'

// Tauri bindings are mocked globally in src/test/setup.ts

describe('App', () => {
  beforeEach(() => {
    vi.mocked(listen).mockClear()
    vi.mocked(commands.completeStartup).mockImplementation(async () => {
      const listener = vi
        .mocked(listen)
        .mock.calls.find(([event]) => event === 'startup-reveal')
      listener?.[1]({ event: 'startup-reveal', id: 0, payload: null })
      return { status: 'ok', data: null }
    })
  })

  it('renders main window layout', async () => {
    render(
      <MotionConfig skipAnimations>
        <App />
      </MotionConfig>
    )
    expect(
      await screen.findByRole('heading', { name: /hello world/i })
    ).toBeInTheDocument()
  })

  it('renders title bar with traffic light buttons', async () => {
    render(
      <MotionConfig skipAnimations>
        <App />
      </MotionConfig>
    )
    // Find specifically the window control buttons in the title bar
    const titleBarButtons = (await screen.findAllByRole('button')).filter(
      button =>
        button.getAttribute('aria-label')?.includes('window') ||
        button.className.includes('window-control')
    )
    // Should have at least the window control buttons
    expect(titleBarButtons.length).toBeGreaterThan(0)
  })
})
