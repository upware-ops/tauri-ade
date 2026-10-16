import { useTranslation } from 'react-i18next'
import { Inbox, MessageSquareText } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { useUIStore } from '@/store/ui-store'

export function HomeScreen() {
  const { t } = useTranslation()
  const lastQuickPaneEntry = useUIStore(state => state.lastQuickPaneEntry)

  return (
    <main className="home-screen" aria-label={t('navigation.home')}>
      <p className="home-eyebrow">{t('navigation.home')}</p>
      <Empty className="home-empty">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {lastQuickPaneEntry ? <MessageSquareText /> : <Inbox />}
          </EmptyMedia>
          <EmptyTitle>
            <h1 className="break-words text-xl font-semibold tracking-tight">
              {lastQuickPaneEntry
                ? t('mainContent.lastEntry', { text: lastQuickPaneEntry })
                : t('mainContent.helloWorld')}
            </h1>
          </EmptyTitle>
          <EmptyDescription>
            {t(
              lastQuickPaneEntry
                ? 'mainContent.entryDescription'
                : 'mainContent.emptyDescription'
            )}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  )
}
