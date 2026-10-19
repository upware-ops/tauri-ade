import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Archive,
  GitBranch,
  LayoutGrid,
  Sparkles,
  Terminal,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  IconSpecimen,
  ScreenPreviewCard,
  ScreenSummary,
} from './LibraryCompositions'
import { Specimen } from './Specimen'

export function CompositionExamples() {
  const { t } = useTranslation()
  const [selectedIcon, setSelectedIcon] = useState('archive')
  const [selectedScreen, setSelectedScreen] = useState<'dashboard' | 'session'>(
    'dashboard'
  )
  const [previewOpen, setPreviewOpen] = useState(false)
  const screens = {
    dashboard: {
      id: 'dashboard' as const,
      icon: LayoutGrid,
      title: t('library.compositions.dashboard'),
      description: t('library.compositions.dashboardDescription'),
      filename: 'Dashboard.html',
    },
    session: {
      id: 'session' as const,
      icon: Terminal,
      title: t('library.compositions.session'),
      description: t('library.compositions.sessionDescription'),
      filename: 'Session.html',
    },
  }
  const currentScreen = screens[selectedScreen]
  const previewSrc = '/design/library/acoCn.png'

  return (
    <>
      <Specimen
        name="Icon Specimen"
        description={t('library.compositions.iconDescription')}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Archive, label: 'archive' },
              { icon: GitBranch, label: 'git-branch' },
              { icon: Sparkles, label: 'sparkles' },
              { icon: Terminal, label: 'terminal' },
            ].map(({ icon, label }) => (
              <IconSpecimen
                key={label}
                icon={icon}
                label={label}
                selected={selectedIcon === label}
                onClick={() => setSelectedIcon(label)}
              />
            ))}
          </div>
          <p className="library-note" role="status">
            {t('library.compositions.selectedIcon', { icon: selectedIcon })}
          </p>
        </div>
      </Specimen>

      <Specimen
        name="Screen Summary"
        description={t('library.compositions.summaryDescription')}
      >
        <ScreenSummary
          title="Tauri ADE"
          description={t('library.compositions.designSummary')}
          metadata={t('library.compositions.offlineFiles', { count: 10 })}
        />
      </Specimen>

      <Specimen
        name="Screen Preview Card"
        description={t('library.compositions.previewDescription')}
      >
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap items-start gap-3">
            {Object.values(screens).map(screen => (
              <ScreenPreviewCard
                key={screen.id}
                icon={screen.icon}
                title={screen.title}
                description={screen.description}
                filename={screen.filename}
                previewSrc={previewSrc}
                selected={selectedScreen === screen.id}
                aria-haspopup="dialog"
                onClick={() => {
                  setSelectedScreen(screen.id)
                  setPreviewOpen(true)
                }}
              />
            ))}
          </div>
          <p className="library-note" role="status">
            {t('library.compositions.selectedScreen', {
              screen: currentScreen.title,
            })}
          </p>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[740px]">
              <DialogHeader>
                <DialogTitle>{currentScreen.title}</DialogTitle>
                <DialogDescription>
                  {currentScreen.description}
                </DialogDescription>
              </DialogHeader>
              <img
                src={previewSrc}
                alt={t('library.compositions.previewAlt', {
                  screen: currentScreen.title,
                })}
                className="w-full rounded-md border"
              />
              <p className="font-mono text-[10.5px] text-muted-foreground">
                {currentScreen.filename}
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </Specimen>
    </>
  )
}
