import { useTranslation } from 'react-i18next'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

export function LibraryInspector() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <ScrollArea className="h-full">
      <aside
        className="library-inspector"
        aria-label={t('library.inspector.title')}
      >
        <h2>{t('library.inspector.title')}</h2>
        <div className="flex flex-col gap-3">
          <p className="library-eyebrow">{t('library.inspector.appearance')}</p>
          <ToggleGroup
            type="single"
            variant="outline"
            value={theme}
            onValueChange={value => {
              if (value === 'dark' || value === 'light' || value === 'system')
                setTheme(value)
            }}
            aria-label={t('library.inspector.appearance')}
          >
            <ToggleGroupItem
              value="light"
              aria-label={t('preferences.appearance.theme.light')}
            >
              <Sun />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="dark"
              aria-label={t('preferences.appearance.theme.dark')}
            >
              <Moon />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="system"
              aria-label={t('preferences.appearance.theme.system')}
            >
              <Monitor />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <p className="library-eyebrow">{t('library.inspector.palette')}</p>
          {(
            ['background', 'card', 'raised', 'foreground', 'signal'] as const
          ).map(token => (
            <div key={token} className="library-token">
              <span className="library-color" data-color={token} />
              <code>{token}</code>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <p className="library-eyebrow">{t('library.inspector.typography')}</p>
          <p className="text-base">
            Inter <span className="library-note">400 / 500 / 600</span>
          </p>
          <p className="font-mono text-xs">Geist Mono</p>
          <p className="library-note">11 / 12 / 13 / 14 / 16 / 20 / 32</p>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <p className="library-eyebrow">{t('library.inspector.geometry')}</p>
          <p className="library-note">{t('library.inspector.radii')}</p>
          <p className="font-mono text-[11px]">4 · 8 · 12 · 16 · 24 · 32</p>
        </div>
        <Separator />
        <p className="library-note">{t('library.inspector.instructions')}</p>
      </aside>
    </ScrollArea>
  )
}
