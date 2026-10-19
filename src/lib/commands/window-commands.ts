import type { AppCommand } from './types'
import { getCurrentWindow } from '@tauri-apps/api/window'
import i18n from '@/i18n/config'
import { getPlatform } from '@/hooks/use-platform'
import { commands, unwrapResult } from '@/lib/tauri-bindings'

const shortcuts: { close?: string; minimize?: string } = {
  macos: { close: '⌘W', minimize: '⌘M' },
  windows: { close: 'Alt+F4' },
  linux: {},
}[getPlatform()]

export const windowCommands: AppCommand[] = [
  {
    id: 'window-close',
    labelKey: 'commands.windowClose.label',
    descriptionKey: 'commands.windowClose.description',
    group: 'window',
    shortcut: shortcuts.close,

    execute: async context => {
      try {
        const appWindow = getCurrentWindow()
        await appWindow.close()
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        context.showToast(
          i18n.t('toast.error.windowCloseFailed', { message }),
          'error'
        )
      }
    },
  },

  {
    id: 'window-minimize',
    labelKey: 'commands.windowMinimize.label',
    descriptionKey: 'commands.windowMinimize.description',
    group: 'window',
    shortcut: shortcuts.minimize,

    execute: async context => {
      try {
        const appWindow = getCurrentWindow()
        await appWindow.minimize()
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        context.showToast(
          i18n.t('toast.error.windowMinimizeFailed', { message }),
          'error'
        )
      }
    },
  },

  {
    id: 'window-toggle-maximize',
    labelKey: 'commands.windowToggleMaximize.label',
    descriptionKey: 'commands.windowToggleMaximize.description',
    group: 'window',

    execute: async context => {
      try {
        unwrapResult(await commands.toggleMainWindowMaximize())
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        context.showToast(
          i18n.t('toast.error.windowMaximizeFailed', { message }),
          'error'
        )
      }
    },
  },

  {
    id: 'window-fullscreen',
    labelKey: 'commands.windowFullscreen.label',
    descriptionKey: 'commands.windowFullscreen.description',
    group: 'window',
    execute: async context => {
      try {
        unwrapResult(await commands.setMainWindowFullscreen(true))
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        context.showToast(
          i18n.t('toast.error.fullscreenEnterFailed', { message }),
          'error'
        )
      }
    },
  },

  {
    id: 'window-exit-fullscreen',
    labelKey: 'commands.windowExitFullscreen.label',
    descriptionKey: 'commands.windowExitFullscreen.description',
    group: 'window',
    execute: async context => {
      try {
        unwrapResult(await commands.setMainWindowFullscreen(false))
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        context.showToast(
          i18n.t('toast.error.fullscreenExitFailed', { message }),
          'error'
        )
      }
    },
  },
]
