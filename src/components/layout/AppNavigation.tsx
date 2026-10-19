import { useTranslation } from 'react-i18next'
import { Boxes, House, Settings } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { LibrarySections } from '@/components/component-library/LibraryNavigation'
import { useUIStore } from '@/store/ui-store'

export function AppNavigation() {
  const { t } = useTranslation()
  const activeView = useUIStore(state => state.activeView)
  const setActiveView = useUIStore(state => state.setActiveView)
  const setPreferencesOpen = useUIStore(state => state.setPreferencesOpen)

  return (
    <SidebarProvider className="app-navigation h-full min-h-0">
      <Sidebar collapsible="none" className="w-full">
        <SidebarHeader className="p-4">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar>
              <AvatarFallback>
                <Boxes className="size-3" />
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-[13px] font-medium">
              {t('app.name')}
            </span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <nav aria-label={t('navigation.primary')}>
            <SidebarGroup>
              <SidebarGroupLabel>{t('navigation.workspace')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeView === 'home'}
                      aria-current={activeView === 'home' ? 'page' : undefined}
                      onClick={() => setActiveView('home')}
                    >
                      <House />
                      <span>{t('navigation.home')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {activeView === 'library' && <LibrarySections />}
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeView === 'library'}
                aria-current={activeView === 'library' ? 'page' : undefined}
                onClick={() => setActiveView('library')}
              >
                <Boxes />
                <span>{t('library.title')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setPreferencesOpen(true)}>
                <Settings />
                <span>{t('titlebar.settings')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
