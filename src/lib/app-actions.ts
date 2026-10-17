/**
 * App-level actions shared by the native menu, the command palette and
 * keyboard shortcuts.
 */
import { getCurrentWindow } from '@tauri-apps/api/window'
import { ask, message } from '@tauri-apps/plugin-dialog'
import { relaunch } from '@tauri-apps/plugin-process'
import { check, type Update } from '@tauri-apps/plugin-updater'
import i18n from '@/i18n/config'
import { logger } from '@/lib/logger'
import { notifications } from '@/lib/notifications'
import { commands, unwrapResult } from '@/lib/tauri-bindings'

let updateCheck: Promise<void> | null = null
let interactiveUpdateCheck = false

/**
 * Check for an update and install it only after the user agrees.
 * Interactive checks also report "up to date" and check failures.
 */
export async function checkForUpdates({
  interactive,
}: {
  interactive: boolean
}): Promise<void> {
  interactiveUpdateCheck ||= interactive
  if (updateCheck && interactive) {
    await Promise.all([updateCheck, getCurrentWindow().show()])
    return
  }
  updateCheck ??= Promise.resolve().then(runUpdateCheck)
  return updateCheck
}

async function runUpdateCheck(): Promise<void> {
  try {
    const t = i18n.t.bind(i18n)

    // Toasts and dialogs live in the main window, which may be hidden
    if (interactiveUpdateCheck) {
      await getCurrentWindow().show()
    }

    let update: Update | null
    try {
      update = await check()
    } catch (error) {
      logger.error('Update check failed', { error })
      if (interactiveUpdateCheck) {
        await getCurrentWindow().show()
        await notifications.error(t('updates.checkFailed'))
      }
      return
    }

    if (!update) {
      if (interactiveUpdateCheck) {
        await getCurrentWindow().show()
        await notifications.success(t('updates.upToDate'))
      }
      return
    }

    logger.info(`Update available: ${update.version}`)
    await getCurrentWindow().show()
    const shouldInstall = await ask(
      t('updates.availableMessage', { version: update.version }),
      {
        title: t('updates.availableTitle'),
        okLabel: t('updates.install'),
        cancelLabel: t('updates.later'),
      }
    )
    if (!shouldInstall) return

    try {
      await update.downloadAndInstall(event => {
        switch (event.event) {
          case 'Started':
            logger.info(`Downloading ${event.data.contentLength} bytes`)
            break
          case 'Progress':
            logger.info(`Downloaded: ${event.data.chunkLength} bytes`)
            break
          case 'Finished':
            logger.info('Download complete, installing...')
            break
        }
      })
    } catch (error) {
      logger.error(`Update installation failed: ${String(error)}`)
      await message(t('updates.failedMessage', { message: String(error) }), {
        title: t('updates.failedTitle'),
        kind: 'error',
      })
      return
    }

    const shouldRestart = await ask(
      t('updates.restartMessage', { appName: t('app.name') }),
      {
        title: t('updates.installedTitle'),
        okLabel: t('updates.restart'),
        cancelLabel: t('updates.later'),
      }
    )
    if (shouldRestart) {
      await relaunch()
    }
  } finally {
    updateCheck = null
    interactiveUpdateCheck = false
  }
}

export async function showAbout(): Promise<void> {
  const t = i18n.t.bind(i18n)

  await getCurrentWindow().show()
  await message(t('about.message', { version: __APP_VERSION__ }), {
    title: t('menu.about', { appName: t('app.name') }),
  })
}

export async function toggleFullscreen(): Promise<void> {
  const appWindow = getCurrentWindow()
  unwrapResult(
    await commands.setMainWindowFullscreen(!(await appWindow.isFullscreen()))
  )
}
