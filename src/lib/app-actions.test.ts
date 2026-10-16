import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ask } from '@tauri-apps/plugin-dialog'
import { relaunch } from '@tauri-apps/plugin-process'
import { check, type Update } from '@tauri-apps/plugin-updater'
import { checkForUpdates } from './app-actions'

vi.mock('@tauri-apps/plugin-dialog', () => ({
  ask: vi.fn(),
  message: vi.fn(),
}))

vi.mock('@tauri-apps/plugin-process', () => ({
  relaunch: vi.fn(),
}))

const downloadAndInstall = vi.fn()

describe('checkForUpdates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(check).mockResolvedValue({
      version: '9.9.9',
      downloadAndInstall,
    } as unknown as Update)
  })

  it('never downloads when the install is declined', async () => {
    vi.mocked(ask).mockResolvedValueOnce(false)

    await checkForUpdates({ interactive: false })

    expect(downloadAndInstall).not.toHaveBeenCalled()
  })

  it('never relaunches when the restart is declined', async () => {
    vi.mocked(ask).mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    await checkForUpdates({ interactive: false })

    expect(downloadAndInstall).toHaveBeenCalledOnce()
    expect(relaunch).not.toHaveBeenCalled()
  })

  it('relaunches when the install and the restart are accepted', async () => {
    vi.mocked(ask).mockResolvedValueOnce(true).mockResolvedValueOnce(true)

    await checkForUpdates({ interactive: false })

    expect(relaunch).toHaveBeenCalledOnce()
  })
})
