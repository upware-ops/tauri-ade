import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ListFilter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * The design specifies the five menu rows and their current values; the
 * submenu options below are a reasonable reading of each, not designed
 * content. State is local because filtering has no backing store yet.
 */
const GROUPS = [
  { id: 'status', options: ['active', 'archived', 'all'], initial: 'active' },
  {
    id: 'environment',
    options: ['all', 'production', 'staging', 'local'],
    initial: 'all',
  },
  { id: 'groupBy', options: ['folder', 'project', 'none'], initial: 'folder' },
  { id: 'sortBy', options: ['recency', 'name', 'status'], initial: 'recency' },
] as const

type GroupId = (typeof GROUPS)[number]['id']

export function ProjectFilterMenu() {
  const { t } = useTranslation()
  const [values, setValues] = React.useState<Record<GroupId, string>>(
    () =>
      Object.fromEntries(GROUPS.map(g => [g.id, g.initial])) as Record<
        GroupId,
        string
      >
  )
  const [showEmpty, setShowEmpty] = React.useState(false)

  const renderGroup = (group: (typeof GROUPS)[number]) => (
    <DropdownMenuSub key={group.id}>
      <DropdownMenuSubTrigger>
        {t(`dashboard.filter.${group.id}`)}
        <span className="ms-auto ps-6 text-muted-foreground">
          {t(`dashboard.filter.${group.id}.${values[group.id]}`)}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup
          value={values[group.id]}
          onValueChange={value =>
            setValues(prev => ({ ...prev, [group.id]: value }))
          }
        >
          {group.options.map(option => (
            <DropdownMenuRadioItem key={option} value={option}>
              {t(`dashboard.filter.${group.id}.${option}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('dashboard.filterProjects')}
        className="inline-flex rounded p-0.5 text-muted-foreground hover:text-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-foreground"
      >
        <ListFilter className="size-[13px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[232px]">
        {GROUPS.slice(0, 2).map(renderGroup)}
        <DropdownMenuCheckboxItem
          checked={showEmpty}
          onCheckedChange={setShowEmpty}
        >
          {t('dashboard.filter.showEmptyFolders')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {GROUPS.slice(2).map(renderGroup)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
