import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Info,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { LoadingBoard, SkeletonCard } from '@/components/ui/skeleton-card'
import { Spinner } from '@/components/ui/spinner'
import { StatusIcon } from '@/components/ui/status-icon'
import { Throbber } from '@/components/ui/throbber'
import { Specimen } from './Specimen'

export function StatusExamples() {
  const { t } = useTranslation()
  const [progress, setProgress] = useState([40])
  const [throbberPlay, setThrobberPlay] = useState(true)
  const [failed, setFailed] = useState(true)

  return (
    <>
      <Specimen name="Badge" description={t('library.status.badgeDescription')}>
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              'default',
              'secondary',
              'outline',
              'destructive',
              'ghost',
              'link',
              'code',
            ] as const
          ).map(variant => (
            <Badge key={variant} variant={variant}>
              {variant === 'code'
                ? 'fix-auth-refresh'
                : t(`library.actions.${variant}`)}
            </Badge>
          ))}
        </div>
      </Specimen>
      <Specimen
        name="Avatar"
        description={t('library.status.avatarDescription')}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Avatar>
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
          <Avatar className="size-8">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="library-note">
            {t('library.status.collaborators')}
          </span>
        </div>
      </Specimen>
      <Specimen
        name="Status icons"
        description={t('library.status.iconsDescription')}
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="library-status">
            <CircleDashed />
            {t('library.status.backlog')}
          </span>
          <span className="library-status text-status-progress">
            <StatusIcon status="progress" />
            {t('library.status.inProgress')}
          </span>
          <span className="library-status text-status-review">
            <StatusIcon status="review" />
            {t('library.status.inReview')}
          </span>
          <span className="library-status text-success">
            <StatusIcon status="complete" />
            {t('library.status.complete')}
          </span>
          <span className="library-status">
            <StatusIcon status="selection" />
            {t('library.actions.starred')}
          </span>
          <span className="library-status text-status-blocked">
            <CircleAlert />
            {t('library.status.blocked')}
          </span>
        </div>
      </Specimen>
      <Specimen
        name="Spinner & Throbber"
        description={t('library.status.spinnerDescription')}
      >
        <div className="flex flex-wrap items-center gap-5">
          <Spinner />
          {(['tide', 'bloom', 'orbit', 'ripple', 'comets'] as const).map(
            animation => (
              <span key={animation} className="inline-flex items-center gap-2">
                <Throbber animation={animation} play={throbberPlay} />
                <code className="text-[10px] text-muted-foreground">
                  {animation}
                </code>
              </span>
            )
          )}
          <span className="library-note">{t('library.status.working')}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setThrobberPlay(value => !value)}
          >
            {t(
              throbberPlay
                ? 'library.materials.pause'
                : 'library.materials.play'
            )}
          </Button>
        </div>
      </Specimen>
      <Specimen
        name="Progress"
        description={t('library.status.progressDescription')}
      >
        <div className="flex w-full max-w-80 flex-col gap-4">
          <Progress
            value={progress[0]}
            aria-label={t('library.status.runProgress')}
          />
          <Slider
            value={progress}
            onValueChange={setProgress}
            thumbLabels={[t('library.status.runProgress')]}
          />
          <p className="library-note" role="status">
            {t('library.status.progressValue', { value: progress[0] })}
          </p>
        </div>
      </Specimen>
      <Specimen name="Alert" description={t('library.status.alertDescription')}>
        <div className="flex w-full max-w-xl flex-col gap-3">
          <Alert>
            <Info />
            <AlertTitle>{t('library.status.workspaceReady')}</AlertTitle>
            <AlertDescription>
              {t('library.status.workspaceBody')}
            </AlertDescription>
          </Alert>
          <Alert variant={failed ? 'inline-error' : 'default'}>
            {failed ? <CircleAlert /> : <CircleCheck />}
            <AlertTitle>
              {t(
                failed
                  ? 'library.status.runFailed'
                  : 'library.status.reconnected'
              )}
            </AlertTitle>
            <AlertDescription>
              <p>
                {t(
                  failed
                    ? 'library.status.failureBody'
                    : 'library.status.reconnectedBody'
                )}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFailed(value => !value)}
              >
                <RefreshCw data-icon="inline-start" />
                {t(
                  failed
                    ? 'library.status.retry'
                    : 'library.status.simulateError'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </Specimen>
      <Specimen
        name="Skeleton"
        description={t('library.status.skeletonDescription')}
      >
        <div
          className="flex w-full flex-wrap items-start gap-4"
          aria-label={t('library.status.loadingCard')}
          role="status"
        >
          <LoadingBoard />
          <SkeletonCard />
        </div>
      </Specimen>
    </>
  )
}
