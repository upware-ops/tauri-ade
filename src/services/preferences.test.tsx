import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import '@/i18n/config'
import { commands } from '@/lib/tauri-bindings'
import { useSavePreferences } from './preferences'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: 1, retryDelay: 0 } },
})

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSavePreferences', () => {
  it('shows one error toast when every attempt fails', async () => {
    vi.mocked(commands.savePreferences).mockResolvedValue({
      status: 'error',
      error: 'disk full',
    })

    const { result } = renderHook(() => useSavePreferences(), { wrapper })
    result.current.mutate({
      theme: 'dark',
      quick_pane_shortcut: null,
      language: null,
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(commands.savePreferences).toHaveBeenCalledTimes(2)
    expect(toast.error).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledWith('Failed to save preferences', {
      description: 'disk full',
    })
  })
})
