import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  CircleHelp,
  GitBranch,
  Home,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Zap,
} from 'lucide-react'
import { useUIStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'
import { DiffStat } from './DiffStat'
import { ProjectFilterMenu } from './ProjectFilterMenu'
import { SAMPLE_PROJECTS } from './sample-data'

const NAV = [
  { id: 'dashboard', icon: LayoutGrid, labelKey: 'dashboard.nav.dashboard' },
  { id: 'home', icon: Home, labelKey: 'dashboard.nav.home' },
  { id: 'create', icon: Plus, labelKey: 'dashboard.nav.create' },
  { id: 'search', icon: Search, labelKey: 'dashboard.nav.search' },
] as const

const iconButton =
  'inline-flex rounded p-0.5 text-muted-foreground hover:text-foreground'

/** Initials are decorative — the adjacent name already carries the label. */
const avatar =
  'flex items-center justify-center bg-secondary text-muted-foreground'

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
        className="flex items-center gap-2 px-3.5 pt-4 pb-2.5 text-foreground"
      >
        <span
          aria-hidden
          className={cn(
            avatar,
            'size-5 rounded-full text-[10px] font-semibold'
          )}
        >
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
                'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-start',
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
        <ProjectFilterMenu />
      </div>

      <div className="flex flex-1 flex-col gap-px overflow-y-auto px-2 pb-2">
        {SAMPLE_PROJECTS.map((project, projectIndex) => (
          <div key={project.id} className="contents">
            {/* Two sibling buttons, not one nested in the other: a control
                inside a button is unreachable by keyboard and its label leaks
                into the parent's accessible name. */}
            <div
              className={cn(
                'flex items-center rounded-md pe-2 hover:bg-sidebar-accent',
                projectIndex > 0 && 'mt-2'
              )}
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-start text-foreground"
              >
                <span
                  aria-hidden
                  className={cn(avatar, 'size-4 rounded text-[9px] font-bold')}
                >
                  {project.name.charAt(0).toUpperCase()}
                </span>
                <span className="truncate font-medium">{project.name}</span>
              </button>
              <button
                type="button"
                aria-label={t('dashboard.newTask', { project: project.name })}
                className={iconButton}
              >
                <Plus className="size-3" />
              </button>
            </div>

            {project.items.map(item => (
              <button
                key={item.id}
                type="button"
                aria-current={item.active ? 'true' : undefined}
                title={item.label}
                className={cn(
                  'flex items-center gap-[7px] rounded-md py-[5px] pe-2 ps-[26px]',
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
