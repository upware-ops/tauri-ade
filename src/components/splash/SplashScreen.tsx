import { useEffect, useState } from 'react'
import { getVersion } from '@tauri-apps/api/app'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useTranslation } from 'react-i18next'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { initializeLanguage } from '@/i18n/language-init'
import { usePreferences } from '@/services/preferences'
import {
  NEURAL_MESH_LOOP_SECONDS,
  ShaderSurface,
} from '@/components/ui/shader-surface'
import './splash.css'

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
// WebKit stops animation frames in a covered window, which pauses the shader loop.
const READY_CEILING_MS = NEURAL_MESH_LOOP_SECONDS * 2000

interface SplashScreenProps {
  done: boolean
  onReady?: () => void
}

export function SplashArtwork({
  animated = true,
  className,
  onFirstLoopComplete,
}: {
  animated?: boolean
  className?: string
  onFirstLoopComplete?: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className={cn('ade-splash__artwork', className)}>
      <div className="ade-splash__composition">
        <ShaderSurface
          animated={animated}
          className="ade-splash__field"
          onFirstLoopComplete={onFirstLoopComplete}
        />
        <div className="ade-splash__identity">
          <h1>{t('app.name')}</h1>
          <p>{t('splash.subtitle')}</p>
        </div>
      </div>
    </div>
  )
}

export function SplashScreen({ done, onReady }: SplashScreenProps) {
  const { t } = useTranslation()
  const { data: preferences, isPending } = usePreferences()
  const language = preferences?.language ?? null
  const [status, setStatus] = useState<StatusKey>(FIRST_STATUS)
  const [version, setVersion] = useState('')
  const [hidden, setHidden] = useState(false)
  const [minimumElapsed, setMinimumElapsed] = useState(false)
  const [loopComplete, setLoopComplete] = useState(false)

  useEffect(() => {
    if (!isPending) void initializeLanguage(language)
  }, [isPending, language])

  // Tauri creates the window hidden so its first visible frame is the splash.
  useEffect(() => {
    let active = true
    let timer: ReturnType<typeof setTimeout> | undefined
    let ceiling: ReturnType<typeof setTimeout> | undefined

    getCurrentWindow()
      .show()
      .then(() => {
        if (!active) return
        timer = setTimeout(
          () => setMinimumElapsed(true),
          NEURAL_MESH_LOOP_SECONDS * 1000
        )
        ceiling = setTimeout(() => setLoopComplete(true), READY_CEILING_MS)
      })
      .catch(error => {
        logger.error('Failed to show the splash window', { error })
      })

    return () => {
      active = false
      clearTimeout(timer)
      clearTimeout(ceiling)
    }
  }, [])

  useEffect(() => {
    if (minimumElapsed && loopComplete) onReady?.()
  }, [minimumElapsed, loopComplete, onReady])

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
      setStatus(current => NEXT_STATUS[current])
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
    <div className="ade-splash" data-done={done}>
      <SplashArtwork
        className="h-dvh w-full"
        onFirstLoopComplete={() => setLoopComplete(true)}
      />

      <span role="status" aria-live="polite" className="sr-only">
        {t('splash.loading', { appName: t('app.name') })}
        <span aria-hidden="true">{t(status)}</span>
      </span>

      {version && (
        <p className="ade-splash__version">
          {t('splash.version', { version })}
        </p>
      )}
    </div>
  )
}
