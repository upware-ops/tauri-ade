import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const FILES = [
  'App.tsx',
  'main.tsx',
  'ThemeProvider.tsx',
  'ErrorBoundary.tsx',
  'CommandPalette.tsx',
  'PreferencesDialog.tsx',
  'GeneralPane.tsx',
  'AppearancePane.tsx',
  'AdvancedPane.tsx',
  'TitleBar.tsx',
  'LeftSideBar.tsx',
  'RightSideBar.tsx',
  'MainWindow.tsx',
]

export function Vertical() {
  return (
    <ScrollArea className="h-[220px] w-[280px] rounded-md border">
      <div className="p-4">
        <div className="mb-3 text-sm font-medium">Recent files</div>
        {FILES.map(f => (
          <div key={f}>
            <div className="py-1.5 text-sm">{f}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export function Horizontal() {
  return (
    <ScrollArea className="w-[320px] rounded-md border whitespace-nowrap">
      <div className="flex w-max gap-3 p-4">
        {[
          'General',
          'Appearance',
          'Advanced',
          'Shortcuts',
          'Updates',
          'Privacy',
        ].map(t => (
          <div
            key={t}
            className="bg-muted flex h-[70px] w-[110px] items-center justify-center rounded-md text-sm"
          >
            {t}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
