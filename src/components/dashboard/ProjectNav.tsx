import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  CircleHelp,
  GitBranch,
  Home,
  LayoutGrid,
  ListFilter,
  Plus,
  Search,
  Settings,
  Zap,
} from 'lucide-react'
import { useUIStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'
import { DiffStat } from './DiffStat'
import { SAMPLE_PROJECTS } from './sample-data'

const NAV = [
  { id: 'dashboard', icon: LayoutGrid, labelKey: 'dashboard.nav.dashboard' },
  { id: 'home', icon: Home, labelKey: 'dashboard.nav.home' },
  { id: 'create', icon: Plus, labelKey: 'dashboard.nav.create' },
  { id: 'search', icon: Search, labelKey: 'dashboard.nav.search' },
] as const

const iconButton =
  'inline-flex cursor-pointer rounded p-0.5 text-muted-foreground hover:text-foreground'

export function ProjectNav() {
  const { t } = useTranslation()

  const openPreferences = () => {
    useUIStore.getState().setPreferencesOpen(true)
  }

  return (
    <nav className="flex h-full flex-col bg-sidebar text-[13px] text-sidebar-foreground">
      <button
        type="button"
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-2 px-3.5 pt-4 pb-2.5 text-foreground"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">
          A
        </span>
        <span className="font-semibold">Acme&rsquo;s Mac</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </button>

      <div className="flex flex-col gap-px px-2">
        {NAV.map((item, index) => {
          const Icon = item.icon
          const active = index === 0
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-start',
                active
                  ? 'bg-sidebar-accent text-foreground'
                  : 'hover:bg-sidebar-accent'
              )}
            >
              <Icon className="size-[15px]" strokeWidth={1.8} />
              {t(item.labelKey)}
            </button>
          )
        })}
      </div>

      <div className="flex items-center px-4 pt-[18px] pb-1.5 text-xs font-medium text-muted-foreground">
        {t('dashboard.projects')}
        <span className="flex-1" />
        <button
          type="button"
          aria-label={t('dashboard.filterProjects')}
          className={iconButton}
        >
          <ListFilter className="size-[13px]" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-px overflow-y-auto px-2 pb-2">
        {SAMPLE_PROJECTS.map((project, projectIndex) => (
          <div key={project.id} className="contents">
            <button
              type="button"
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-foreground hover:bg-sidebar-accent',
                projectIndex > 0 && 'mt-2'
              )}
            >
              <span className="flex size-4 items-center justify-center rounded bg-secondary text-[9px] font-bold text-muted-foreground">
                {project.name.charAt(0).toUpperCase()}
              </span>
              <span className="font-medium">{project.name}</span>
              <span className="flex-1" />
              <span aria-label={t('dashboard.newTask')} className={iconButton}>
                <Plus className="size-3" />
              </span>
            </button>

            {project.items.map(item => (
              <button
                key={item.id}
                type="button"
                aria-current={item.active ? 'true' : undefined}
                title={item.label}
                className={cn(
                  'flex cursor-pointer items-center gap-[7px] rounded-md py-[5px] pe-2 ps-[26px]',
                  item.active
                    ? 'bg-sidebar-accent text-foreground'
                    : 'hover:bg-sidebar-accent'
                )}
              >
                {item.branch && (
                  <GitBranch className="size-[13px] flex-shrink-0 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    'min-w-0 truncate text-start',
                    item.active && 'font-medium'
                  )}
                >
                  {item.label}
                </span>
                <span className="flex-1" />
                {item.spotlight && (
                  <span className="flex items-center gap-[3px] text-[11px] text-brand">
                    <Zap className="size-2.5" strokeWidth={2.2} />
                    {t('dashboard.spotlight')}
                  </span>
                )}
                {item.diff && (
                  <DiffStat value={item.diff} muted={!item.active} />
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center border-t px-3.5 py-2.5">
        <span className="rounded-md border border-dashed border-input px-2 py-[3px] font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
          {t('dashboard.plan.free')}
        </span>
        <span className="flex-1" />
        <button
          type="button"
          aria-label={t('dashboard.help')}
          className={cn(iconButton, 'me-1.5')}
        >
          <CircleHelp className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={t('dashboard.settings')}
          onClick={openPreferences}
          className={iconButton}
        >
          <Settings className="size-3.5" />
        </button>
      </div>
    </nav>
  )
}
