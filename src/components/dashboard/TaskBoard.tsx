import { useTranslation } from 'react-i18next'
import { Kbd } from '@/components/ui/kbd'
import { cn } from '@/lib/utils'
import { StatusIcon } from './StatusIcon'
import { TaskCard } from './TaskCard'
import { SAMPLE_PROJECTS, SAMPLE_TASKS } from './sample-data'
import type { TaskStatus } from './types'

const COLUMNS: { status: TaskStatus; labelKey: string; width: string }[] = [
  {
    status: 'backlog',
    labelKey: 'dashboard.status.backlog',
    width: 'w-[290px]',
  },
  {
    status: 'inProgress',
    labelKey: 'dashboard.status.inProgress',
    width: 'w-[290px]',
  },
  {
    status: 'inReview',
    labelKey: 'dashboard.status.inReview',
    width: 'w-[290px]',
  },
  { status: 'done', labelKey: 'dashboard.status.done', width: 'w-[220px]' },
]

export function TaskBoard() {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col text-[13px]">
      <header className="flex h-[46px] flex-shrink-0 items-center gap-3 border-b px-5">
        <h1 className="text-[13.5px] font-semibold">{t('dashboard.title')}</h1>
        <span className="flex-1" />
        <button
          type="button"
          className="flex items-center gap-[7px] text-xs text-muted-foreground hover:text-foreground"
        >
          {t('dashboard.search')}
          <Kbd>⌘K</Kbd>
        </button>
      </header>

      <div className="flex items-center gap-1.5 px-5 pt-3">
        <button
          type="button"
          aria-pressed="true"
          className="rounded-md bg-accent px-2.5 py-1 text-[12.5px] font-medium"
        >
          {t('dashboard.allProjects')}
        </button>
        {SAMPLE_PROJECTS.map(project => (
          <button
            key={project.id}
            type="button"
            aria-pressed="false"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12.5px] text-muted-foreground hover:bg-accent"
          >
            <span
              aria-hidden
              className="flex size-3.5 items-center justify-center rounded-[3px] bg-secondary text-[8px] font-bold"
            >
              {project.name.charAt(0).toUpperCase()}
            </span>
            {project.name}
          </button>
        ))}
      </div>

      <div className="flex flex-1 items-start gap-7 overflow-auto px-5 pt-[18px] pb-6">
        {COLUMNS.map(column => {
          const tasks = SAMPLE_TASKS.filter(
            task => task.status === column.status
          )
          return (
            <section
              key={column.status}
              className={cn('flex flex-shrink-0 flex-col gap-3', column.width)}
            >
              <div className="flex items-center gap-2 text-[13px] font-semibold">
                <StatusIcon status={column.status} />
                {t(column.labelKey)}
                <span className="font-normal text-muted-foreground">
                  {tasks.length}
                </span>
              </div>
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </section>
          )
        })}
      </div>
    </div>
  )
}
