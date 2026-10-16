/**
 * Application menu builder using Tauri's JavaScript API.
 *
 * This module creates native menus from JavaScript, enabling i18n support
 * through react-i18next. Menus are rebuilt when the language changes.
 */
import {
  Menu,
  MenuItem,
  Submenu,
  PredefinedMenuItem,
} from '@tauri-apps/api/menu'
import { getCurrentWindow } from '@tauri-apps/api/window'
import i18n from '@/i18n/config'
import { getPlatform } from '@/hooks/use-platform'
import { useUIStore } from '@/store/ui-store'
import { checkForUpdates, showAbout, toggleFullscreen } from '@/lib/app-actions'
import { logger } from '@/lib/logger'
import { commands, unwrapResult } from '@/lib/tauri-bindings'

/**
 * Build and set the application menu with translated labels.
 * Only macOS gets a native menu bar.
 */
export async function buildAppMenu(): Promise<void> {
  if (getPlatform() !== 'macos') return

  const t = i18n.t.bind(i18n)
  const appName = t('app.name')

  try {
    // Build the main application submenu (appears as app name on macOS)
    const appSubmenu = await Submenu.new({
      text: appName,
      items: [
        await MenuItem.new({
          id: 'about',
          text: t('menu.about', { appName }),
          action: handleAbout,
        }),
        await PredefinedMenuItem.new({ item: 'Separator' }),
        await MenuItem.new({
          id: 'check-updates',
          text: t('menu.checkForUpdates'),
          action: handleCheckForUpdates,
        }),
        await PredefinedMenuItem.new({ item: 'Separator' }),
        await MenuItem.new({
          id: 'preferences',
          text: t('menu.preferences'),
          accelerator: 'CmdOrCtrl+,',
          action: handleOpenPreferences,
        }),
        await MenuItem.new({
          id: 'component-library',
          text: t('library.title'),
          action: handleOpenLibrary,
        }),
        await PredefinedMenuItem.new({ item: 'Separator' }),
        await PredefinedMenuItem.new({
          item: 'Hide',
          text: t('menu.hide', { appName }),
        }),
        await PredefinedMenuItem.new({
          item: 'HideOthers',
          text: t('menu.hideOthers'),
        }),
        await PredefinedMenuItem.new({
          item: 'ShowAll',
          text: t('menu.showAll'),
        }),
        await PredefinedMenuItem.new({ item: 'Separator' }),
        await PredefinedMenuItem.new({
          item: 'Quit',
          text: t('menu.quit', { appName }),
        }),
      ],
    })

    // Build the Edit submenu
    const editSubmenu = await Submenu.new({
      text: t('menu.edit'),
      items: [
        await PredefinedMenuItem.new({ item: 'Undo', text: t('menu.undo') }),
        await PredefinedMenuItem.new({ item: 'Redo', text: t('menu.redo') }),
        await PredefinedMenuItem.new({ item: 'Separator' }),
        await PredefinedMenuItem.new({ item: 'Cut', text: t('menu.cut') }),
        await PredefinedMenuItem.new({ item: 'Copy', text: t('menu.copy') }),
        await PredefinedMenuItem.new({ item: 'Paste', text: t('menu.paste') }),
        await PredefinedMenuItem.new({
          item: 'SelectAll',
          text: t('menu.selectAll'),
        }),
      ],
    })

    // Build the View submenu
    const viewSubmenu = await Submenu.new({
      text: t('menu.view'),
      items: [
        await MenuItem.new({
          id: 'home',
          text: t('navigation.home'),
          action: handleOpenHome,
        }),
        await PredefinedMenuItem.new({ item: 'Separator' }),
        await MenuItem.new({
          id: 'toggle-left-sidebar',
          text: t('menu.toggleLeftSidebar'),
          accelerator: 'CmdOrCtrl+1',
          action: handleToggleLeftSidebar,
        }),
        await MenuItem.new({
          id: 'toggle-right-sidebar',
          text: t('menu.toggleRightSidebar'),
          accelerator: 'CmdOrCtrl+2',
          action: handleToggleRightSidebar,
        }),
      ],
    })

    // Build the Window submenu; AppKit's predefined items need a title bar
    const windowSubmenu = await Submenu.new({
      text: t('menu.window'),
      items: [
        await MenuItem.new({
          id: 'minimize',
          text: t('menu.minimize'),
          accelerator: 'CmdOrCtrl+M',
          action: () =>
            void whenMainWindowFocused(() => getCurrentWindow().minimize()),
        }),
        await MenuItem.new({
          id: 'zoom',
          text: t('menu.zoom'),
          action: () =>
            void whenMainWindowFocused(async () => {
              unwrapResult(await commands.toggleMainWindowMaximize())
            }),
        }),
        await PredefinedMenuItem.new({ item: 'Separator' }),
        await MenuItem.new({
          id: 'toggle-fullscreen',
          text: t('menu.toggleFullscreen'),
          accelerator: 'Ctrl+Cmd+F',
          action: () => void whenMainWindowFocused(toggleFullscreen),
        }),
        await PredefinedMenuItem.new({ item: 'Separator' }),
        await MenuItem.new({
          id: 'close-window',
          text: t('menu.closeWindow'),
          accelerator: 'CmdOrCtrl+W',
          action: () =>
            void whenMainWindowFocused(() => getCurrentWindow().close()),
        }),
      ],
    })

    // Build the complete menu
    const menu = await Menu.new({
      items: [appSubmenu, editSubmenu, viewSubmenu, windowSubmenu],
    })

    // Set as the application menu
    await menu.setAsAppMenu()

    logger.info('Application menu built successfully')
  } catch (error) {
    logger.error('Failed to build application menu', { error })
    throw error
  }
}

/**
 * Set up a listener to rebuild the menu when the language changes.
 * Returns an unsubscribe function for cleanup.
 */
export function setupMenuLanguageListener(): () => void {
  const handler = async () => {
    logger.info('Language changed, rebuilding menu')
    try {
      await buildAppMenu()
    } catch (error) {
      logger.error('Failed to rebuild menu on language change', { error })
    }
  }
  i18n.on('languageChanged', handler)
  return () => i18n.off('languageChanged', handler)
}

/**
 * Apply the current language to the tray menu (every desktop platform).
 */
export async function syncTrayLabels(): Promise<void> {
  const t = i18n.t.bind(i18n)
  const appName = t('app.name')

  try {
    unwrapResult(
      await commands.setTrayLabels(
        t('tray.show', { appName }),
        t('menu.quit', { appName })
      )
    )
  } catch (error) {
    logger.error('Failed to set tray labels', { error })
  }
}

// Menu action handlers

// Unlike AppKit's predefined items, custom items don't follow the key window
async function whenMainWindowFocused(
  action: () => Promise<void>
): Promise<void> {
  if (await getCurrentWindow().isFocused()) {
    await action()
  }
}

function handleAbout(): void {
  logger.info('About menu item clicked')
  void showAbout()
}

function handleCheckForUpdates(): void {
  logger.info('Check for Updates menu item clicked')
  void checkForUpdates({ interactive: true })
}

// The menu bar stays usable while the main window is hidden
function handleOpenPreferences(): void {
  logger.info('Preferences menu item clicked')
  void getCurrentWindow().show()
  useUIStore.getState().setPreferencesOpen(true)
}

function handleOpenHome(): void {
  void getCurrentWindow().show()
  useUIStore.getState().setActiveView('home')
}

function handleOpenLibrary(): void {
  void getCurrentWindow().show()
  useUIStore.getState().setActiveView('library')
}

function handleToggleLeftSidebar(): void {
  logger.info('Toggle Left Sidebar menu item clicked')
  void getCurrentWindow().show()
  useUIStore.getState().toggleLeftSidebar()
}

function handleToggleRightSidebar(): void {
  logger.info('Toggle Right Sidebar menu item clicked')
  void getCurrentWindow().show()
  useUIStore.getState().toggleRightSidebar()
}
