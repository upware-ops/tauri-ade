import { useEffect, useState } from 'react'
import { getVersion } from '@tauri-apps/api/app'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useTranslation } from 'react-i18next'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'

const NEXT_STATUS = {
  'splash.status.preferences': 'splash.status.language',
  'splash.status.language': 'splash.status.commands',
  'splash.status.commands': 'splash.status.ready',
  'splash.status.ready': 'splash.status.preferences',
} as const

type StatusKey = keyof typeof NEXT_STATUS

const FIRST_STATUS: StatusKey = 'splash.status.preferences'
const ROTATE_MS = 900
const SPLASH_FADE_MS = 300

interface SplashScreenProps {
  done: boolean
}

export function SplashScreen({ done }: SplashScreenProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<{
    current: StatusKey
    previous: StatusKey | null
  }>({ current: FIRST_STATUS, previous: null })
  const [version, setVersion] = useState('')
  const [hidden, setHidden] = useState(false)

  // The window is created hidden (see tauri.conf.json) so the first frame the
  // user sees is the splash, not an empty webview.
  useEffect(() => {
    getCurrentWindow()
      .show()
      .catch(error => {
        logger.error('Failed to show the main window', { error })
      })
  }, [])

  useEffect(() => {
    getVersion()
      .then(setVersion)
      .catch(error => {
        logger.warn('Failed to read app version', { error })
      })
  }, [])

  useEffect(() => {
    if (done) return

    const rotation = setInterval(() => {
      setStatus(({ current }) => ({
        current: NEXT_STATUS[current],
        previous: current,
      }))
    }, ROTATE_MS)

    return () => clearInterval(rotation)
  }, [done])

  useEffect(() => {
    if (!done) return

    const exit = setTimeout(() => setHidden(true), SPLASH_FADE_MS)
    return () => clearTimeout(exit)
  }, [done])

  if (hidden) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex select-none flex-col items-center justify-center rounded-[var(--app-corner-radius)] bg-background',
        done &&
          'pointer-events-none animate-out fade-out duration-300 fill-mode-forwards'
      )}
    >
      <div className="relative" aria-hidden>
        <div className="absolute inset-0 -z-10 rounded-full bg-brand/25 blur-3xl motion-safe:animate-splash-breathe" />
        <img
          src="/Icon.svg"
          alt=""
          className="size-24 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700"
        />
      </div>

      <h1 className="text-lg font-medium tracking-tight">{t('app.name')}</h1>

      <p
        className="mt-2 grid place-items-center text-sm text-muted-foreground"
        aria-hidden
      >
        <span
          key={`enter-${status.current}`}
          className="col-start-1 row-start-1 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-500"
        >
          {t(status.current)}
        </span>
        {status.previous !== null && (
          <span
            key={`exit-${status.previous}`}
            className="col-start-1 row-start-1 motion-reduce:hidden motion-safe:animate-out motion-safe:fade-out motion-safe:slide-out-to-top-1 motion-safe:duration-500 motion-safe:fill-mode-forwards"
          >
            {t(status.previous)}
          </span>
        )}
      </p>

      <span role="status" aria-live="polite" className="sr-only">
        {t('splash.loading', { appName: t('app.name') })}
      </span>

      {version && (
        <p className="absolute bottom-3 right-3 text-xs text-muted-foreground/70">
          {t('splash.version', { version })}
        </p>
      )}
    </div>
  )
}
