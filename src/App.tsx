import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { initializeCommandSystem } from './lib/commands'
import {
  buildAppMenu,
  setupMenuLanguageListener,
  syncTrayLabels,
} from './lib/menu'
import { checkForUpdates } from './lib/app-actions'
import i18n from './i18n/config'
import { initializeLanguage } from './i18n/language-init'
import { logger } from './lib/logger'
import { cleanupOldFiles } from './lib/recovery'
import { commands, unwrapResult } from './lib/tauri-bindings'
import './App.css'
import { MainWindow } from './components/layout/MainWindow'
import { StartupReveal } from './components/layout/StartupReveal'
import { ThemeProvider } from './components/ThemeProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useSquareCornersEffect } from './hooks/useSquareCornersEffect'

const STARTUP_MAX_MS = 8000

const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms))

function App() {
  useSquareCornersEffect()
  const [startupVisible, setStartupVisible] = useState(false)

  // Initialize command system and cleanup on app startup
  useEffect(() => {
    let active = true
    let listening = false
    let unlisten: (() => void) | undefined
    let revealFrame = 0
    let paintFrame = 0
    let revealRequest = 0
    const revealMain = () => {
      const request = ++revealRequest
      cancelAnimationFrame(revealFrame)
      cancelAnimationFrame(paintFrame)
      revealFrame = requestAnimationFrame(() => {
        paintFrame = requestAnimationFrame(() => {
          if (!active) return
          void Promise.race([
            commands.acknowledgeStartupPaint().then(unwrapResult),
            wait(1500),
          ])
            .catch(error => {
              logger.warn('Failed to acknowledge the startup paint', { error })
            })
            .finally(() => {
              if (active && request === revealRequest) setStartupVisible(true)
            })
        })
      })
    }
    const revealIfShown = async () => {
      if (!active || listening || document.visibilityState !== 'visible') return
      try {
        if (await getCurrentWindow().isVisible()) revealMain()
      } catch (error) {
        logger.warn('Failed to check startup window visibility', { error })
      }
    }
    document.addEventListener('visibilitychange', revealIfShown)
    const revealListener = listen('startup-reveal', revealMain)
      .then(cleanup => {
        if (!active) return cleanup()
        unlisten = cleanup
        listening = true
      })
      .catch(error => {
        logger.warn('Failed to register the startup reveal', { error })
      })

    logger.info('🚀 Frontend application starting up')
    initializeCommandSystem()
    logger.debug('Command system initialized')

    // Initialize language based on saved preference or system locale
    const initLanguageAndMenu = async () => {
      try {
        // Load preferences to get saved language
        const result = await commands.loadPreferences()
        const savedLanguage =
          result.status === 'ok' ? result.data.language : null

        // Initialize language (will use system locale if no preference)
        await initializeLanguage(savedLanguage)

        void syncTrayLabels()
        i18n.on('languageChanged', syncTrayLabels)

        // Build the application menu with the initialized language
        await buildAppMenu()
        setupMenuLanguageListener()
      } catch (error) {
        logger.warn('Failed to initialize language or menu', { error })
      }
    }

    // The race caps a hung IPC: a stuck boot must not leave the splash up
    // forever on top of an app that is otherwise working.
    void Promise.race([
      Promise.all([initLanguageAndMenu(), revealListener]),
      wait(STARTUP_MAX_MS),
    ])
      .then(async () => {
        if (!active) return
        unwrapResult(await commands.completeStartup())
        if (!listening) void revealIfShown()
      })
      .catch(error => {
        logger.error('Failed to finish application startup', { error })
        if (active) void revealIfShown()
      })

    // Clean up old recovery files on startup
    cleanupOldFiles().catch(error => {
      logger.warn('Failed to cleanup old recovery files', { error })
    })

    // Example of logging with context
    logger.info('App environment', {
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE,
    })

    return () => {
      active = false
      unlisten?.()
      document.removeEventListener('visibilitychange', revealIfShown)
      cancelAnimationFrame(revealFrame)
      cancelAnimationFrame(paintFrame)
    }
  }, [])

  useEffect(() => {
    if (!startupVisible) return

    const updateTimer = setTimeout(
      () => void checkForUpdates({ interactive: false }),
      5000
    )
    return () => clearTimeout(updateTimer)
  }, [startupVisible])

  return (
    <StartupReveal visible={startupVisible}>
      <ErrorBoundary>
        <ThemeProvider>
          <MainWindow />
        </ThemeProvider>
      </ErrorBoundary>
    </StartupReveal>
  )
}

export default App
