import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings, Palette, Zap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUIStore } from '@/store/ui-store'
import { GeneralPane } from './panes/GeneralPane'
import { AppearancePane } from './panes/AppearancePane'
import { AdvancedPane } from './panes/AdvancedPane'
import './preferences.css'

const navigationItems = [
  {
    id: 'general' as const,
    labelKey: 'preferences.general',
    icon: Settings,
  },
  {
    id: 'appearance' as const,
    labelKey: 'preferences.appearance',
    icon: Palette,
  },
  {
    id: 'advanced' as const,
    labelKey: 'preferences.advanced',
    icon: Zap,
  },
] as const

type PreferencesPane = (typeof navigationItems)[number]['id']

export function PreferencesDialog() {
  const { t } = useTranslation()
  const [activePane, setActivePane] = useState<PreferencesPane>('general')
  const preferencesOpen = useUIStore(state => state.preferencesOpen)
  const setPreferencesOpen = useUIStore(state => state.setPreferencesOpen)

  return (
    <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
      <DialogContent className="preferences-dialog">
        <header className="preferences-header">
          <DialogTitle>{t('preferences.title')}</DialogTitle>
          <DialogDescription>{t('preferences.description')}</DialogDescription>
        </header>

        <Tabs
          value={activePane}
          onValueChange={value => {
            const pane = navigationItems.find(item => item.id === value)
            if (pane) setActivePane(pane.id)
          }}
          className="preferences-tabs"
        >
          <TabsList
            aria-label={t('preferences.title')}
            className="preferences-navigation"
          >
            {navigationItems.map(item => (
              <TabsTrigger key={item.id} value={item.id}>
                <item.icon className="size-3.5" aria-hidden="true" />
                {t(item.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="preferences-content">
            <TabsContent value="general">
              {activePane === 'general' && <GeneralPane />}
            </TabsContent>
            <TabsContent value="appearance">
              {activePane === 'appearance' && <AppearancePane />}
            </TabsContent>
            <TabsContent value="advanced">
              {activePane === 'advanced' && <AdvancedPane />}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
