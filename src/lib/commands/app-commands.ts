import { exit } from '@tauri-apps/plugin-process'
import type { AppCommand } from './types'
import { checkForUpdates, showAbout } from '@/lib/app-actions'

export const appCommands: AppCommand[] = [
  {
    id: 'app-about',
    labelKey: 'commands.about.label',
    descriptionKey: 'commands.about.description',
    group: 'app',

    execute: () => showAbout(),
  },

  {
    id: 'app-check-updates',
    labelKey: 'commands.checkForUpdates.label',
    descriptionKey: 'commands.checkForUpdates.description',
    group: 'app',

    execute: () => checkForUpdates({ interactive: true }),
  },

  {
    id: 'app-quit',
    labelKey: 'commands.quit.label',
    descriptionKey: 'commands.quit.description',
    group: 'app',

    execute: () => exit(0),
  },
]
