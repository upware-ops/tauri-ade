import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Bot,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleHelp,
  CircleX,
  Clock3,
  Command,
  Copy,
  Cpu,
  Diff,
  Download,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  File,
  FileText,
  Folder,
  Funnel,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  Home,
  Inbox,
  Info,
  Kanban,
  LayoutGrid,
  Link,
  ListFilter,
  Loader,
  LoaderCircle,
  LogOut,
  MessageSquare,
  Minus,
  Moon,
  PanelLeft,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Square,
  Star,
  Sun,
  Terminal,
  Trash,
  Upload,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MacOSIcons,
  WindowsIcons,
} from '@/components/titlebar/WindowControlIcons'
import { IconSpecimen } from './LibraryCompositions'
import { Specimen } from './Specimen'

const icons = {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Bot,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleHelp,
  CircleX,
  Clock3,
  Command,
  Copy,
  Cpu,
  Diff,
  Download,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  File,
  FileText,
  Folder,
  Funnel,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  Home,
  Inbox,
  Info,
  Kanban,
  LayoutGrid,
  Link,
  ListFilter,
  Loader,
  LoaderCircle,
  LogOut,
  MessageSquare,
  Minus,
  Moon,
  PanelLeft,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Square,
  Star,
  Sun,
  Terminal,
  Trash,
  Upload,
  User,
  Users,
  X,
  Zap,
}

export function IconExamples() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('Bot')
  const [windowState, setWindowState] = useState('open')
  const matchingIcons = Object.entries(icons).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Specimen
        name="Icon Library"
        description={t('library.icons.description')}
      >
        <div className="flex w-full flex-col gap-4">
          <Input
            aria-label={t('library.icons.search')}
            placeholder={t('library.icons.search')}
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          <div className="library-icon-grid">
            {matchingIcons.map(([name, Icon]) => (
              <IconSpecimen
                key={name}
                icon={Icon}
                label={name
                  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                  .replace(/([a-z])(\d)/g, '$1-$2')
                  .toLowerCase()}
                selected={selected === name}
                title={name}
                onClick={() => setSelected(name)}
              />
            ))}
          </div>
          <p className="library-note" role="status">
            {matchingIcons.length
              ? t('library.icons.selected', {
                  name: selected,
                  count: matchingIcons.length,
                })
              : t('library.noResults')}
          </p>
        </div>
      </Specimen>
      <Specimen
        name="Window Controls"
        description={t('library.icons.windowDescription')}
      >
        <div className="flex w-full max-w-xl flex-col gap-3">
          <div className="library-window-sample" data-state={windowState}>
            <div className="library-window-toolbar">
              <div className="library-traffic-lights">
                {(['close', 'minimize', 'maximize'] as const).map(action => {
                  const Icon = MacOSIcons[action]
                  return (
                    <button
                      key={action}
                      data-action={action}
                      aria-label={t(`windowControls.${action}`)}
                      onClick={() => setWindowState(action)}
                    >
                      <Icon />
                    </button>
                  )
                })}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {t('library.icons.mockWindow')}
              </span>
              <div className="flex">
                {(['minimize', 'maximize', 'close'] as const).map(action => {
                  const Icon = WindowsIcons[action]
                  return (
                    <Button
                      key={action}
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${t(`windowControls.${action}`)} (Windows)`}
                      onClick={() => setWindowState(action)}
                    >
                      <Icon />
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="library-window-body">
              <span>{t('library.icons.sampleBody')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="library-note" role="status">
              {t('library.icons.windowState', {
                state: t(
                  `library.icons.${windowState as 'open' | 'close' | 'minimize' | 'maximize'}`
                ),
              })}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setWindowState('open')}
            >
              {t('library.icons.restore')}
            </Button>
          </div>
        </div>
      </Specimen>
    </>
  )
}
