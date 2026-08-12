import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DiffStat } from './DiffStat'
import { StatusIcon } from './StatusIcon'
import type { Task } from './types'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { t } = useTranslation()
  const inReview = task.status === 'inReview'

  return (
    <article className="rounded-[10px] border bg-secondary p-3 shadow-sm">
      <div className="flex items-center gap-2 font-mono text-[11px]">
        <span className="text-muted-foreground">{task.branch}</span>
        {task.diff && <DiffStat value={task.diff} />}
        <span className="flex-1" />
        <StatusIcon status={task.status} size={11} />
      </div>

      <div className="mt-[7px] mb-1 font-medium">{task.title}</div>

      <p className="line-clamp-2 text-xs leading-[1.45] text-muted-foreground">
        {task.summary}
      </p>

      <div className="mt-3 flex items-center gap-2.5">
        <Button variant="outline" size="sm">
          {inReview
            ? t('dashboard.action.readyForReview')
            : t('dashboard.action.createPr')}
        </Button>
        {task.pullRequest && (
          <a
            href={task.pullRequest.url}
            className="font-mono text-[11px] text-brand hover:underline"
          >
            #{task.pullRequest.number} ↗
          </a>
        )}
        <span className="flex-1" />
        <span className="text-[11px] text-muted-foreground">
          {task.updatedLabel}
        </span>
      </div>
    </article>
  )
}
