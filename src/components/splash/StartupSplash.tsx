import { useEffect, useState } from 'react'
import { commands, unwrapResult } from '@/lib/tauri-bindings'
import { logger } from '@/lib/logger'
import { SplashScreen } from './SplashScreen'

export function StartupSplash() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!ready) return

    void commands
      .completeStartup()
      .then(unwrapResult)
      .catch(error => {
        logger.error('Failed to finish splash startup', { error })
      })
  }, [ready])

  return <SplashScreen done={false} onReady={() => setReady(true)} />
}
