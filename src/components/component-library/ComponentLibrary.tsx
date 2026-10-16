import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RotateCcw, Search, SunMoon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useTheme } from '@/hooks/use-theme'
import { useUIStore } from '@/store/ui-store'
import { ActionExamples } from './ActionExamples'
import { FormExamples } from './FormExamples'
import { MaterialExamples } from './MaterialExamples'
import { OverlayExamples } from './OverlayExamples'
import { StatusExamples } from './StatusExamples'
import { StructureExamples } from './StructureExamples'
import { CompositionExamples } from './CompositionExamples'
import { IconExamples } from './IconExamples'
import { LibrarySearchContext } from './library-search'

export function ComponentLibrary() {
  const { t } = useTranslation()
  const { setTheme } = useTheme()
  const [search, setSearch] = useState('')
  const [revision, setRevision] = useState(0)
  const lastQuickPaneEntry = useUIStore(state => state.lastQuickPaneEntry)
  const sections = [
    { id: 'actions', content: <ActionExamples /> },
    { id: 'status', content: <StatusExamples /> },
    { id: 'forms', content: <FormExamples /> },
    {
      id: 'structure',
      content: (
        <>
          <StructureExamples />
          <CompositionExamples />
        </>
      ),
    },
    { id: 'overlays', content: <OverlayExamples /> },
    { id: 'materials', content: <MaterialExamples /> },
    { id: 'icons', content: <IconExamples /> },
  ] as const

  return (
    <main className="component-library" id="library-top">
      <div className="library-page-header">
        <div className="flex flex-col gap-1">
          <p className="library-eyebrow">TAURI ADE / DESIGN SYSTEM</p>
          <h1>{t('library.title')}</h1>
          <p className="library-subtitle">{t('library.subtitle')}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t('preferences.appearance.colorTheme')}
            onClick={() =>
              setTheme(
                document.documentElement.classList.contains('dark')
                  ? 'light'
                  : 'dark'
              )
            }
          >
            <SunMoon />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRevision(value => value + 1)
              setSearch('')
            }}
          >
            <RotateCcw data-icon="inline-start" />
            {t('library.reset')}
          </Button>
        </div>
      </div>
      {lastQuickPaneEntry && (
        <p className="library-entry" role="status">
          {t('mainContent.lastEntry', { text: lastQuickPaneEntry })}
        </p>
      )}
      <div className="library-toolbar">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            aria-label={t('library.search')}
            placeholder={t('library.searchPlaceholder')}
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          {search && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label={t('library.clearSearch')}
                onClick={() => setSearch('')}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <span className="library-note">{t('library.localOnly')}</span>
      </div>
      <LibrarySearchContext.Provider value={search.trim().toLocaleLowerCase()}>
        <div key={revision} className="library-results">
          {sections.map(({ id, content }) => (
            <section
              key={id}
              id={`library-${id}`}
              className="library-section"
              aria-labelledby={`library-heading-${id}`}
            >
              <h2 id={`library-heading-${id}`}>
                {t(`library.sections.${id}`)}
              </h2>
              {content}
            </section>
          ))}
        </div>
      </LibrarySearchContext.Provider>
      <Empty className="library-no-results">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search />
          </EmptyMedia>
          <EmptyTitle>{t('library.noResults')}</EmptyTitle>
          <EmptyDescription>
            {t('library.noResultsBody', { search })}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => setSearch('')}>
            {t('library.clearSearch')}
          </Button>
        </EmptyContent>
      </Empty>
      <footer className="library-footer">
        <span>tauri.pen</span>
        <span>{t('library.footer')}</span>
      </footer>
    </main>
  )
}
