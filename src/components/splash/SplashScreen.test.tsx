import { render, screen, act } from '@/test/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { SplashScreen } from './SplashScreen'

const flushVersionFetch = () =>
  act(async () => {
    await Promise.resolve()
  })

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the app name and the first status message', async () => {
    render(<SplashScreen done={false} />)
    await flushVersionFetch()

    expect(
      screen.getByRole('heading', { name: 'Tauri ADE' })
    ).toBeInTheDocument()
    expect(screen.getByText('Loading preferences...')).toBeInTheDocument()
  })

  it('rotates to the next status message', async () => {
    render(<SplashScreen done={false} />)
    await flushVersionFetch()

    act(() => {
      vi.advanceTimersByTime(900)
    })

    expect(
      screen.getByText('Applying language settings...')
    ).toBeInTheDocument()
  })

  it('unmounts itself once done and the fade has elapsed', async () => {
    const { container, rerender } = render(<SplashScreen done={false} />)
    await flushVersionFetch()

    rerender(<SplashScreen done />)
    expect(container).not.toBeEmptyDOMElement()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(container).toBeEmptyDOMElement()
  })
})
