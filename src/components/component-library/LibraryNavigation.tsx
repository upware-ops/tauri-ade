import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  Boxes,
  CircleDot,
  Command,
  FormInput,
  Layers,
  Palette,
  Shapes,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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

export function LibrarySections() {
  const { t } = useTranslation()
  const [active, setActive] = useState('top')
  const items = [
    { id: 'top', icon: BookOpen },
    { id: 'actions', icon: Command },
    { id: 'status', icon: CircleDot },
    { id: 'forms', icon: FormInput },
    { id: 'structure', icon: Layers },
    { id: 'overlays', icon: Boxes },
    { id: 'materials', icon: Palette },
    { id: 'icons', icon: Shapes },
  ] as const

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('library.navigation.library')}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(({ id, icon: Icon }) => (
            <SidebarMenuItem key={id}>
              <SidebarMenuButton asChild isActive={active === id}>
                <a href={`#library-${id}`} onClick={() => setActive(id)}>
                  <Icon />
                  <span>
                    {id === 'top'
                      ? t('library.navigation.overview')
                      : t(`library.sections.${id}`)}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function LibraryNavigation() {
  const { t } = useTranslation()

  return (
    <SidebarProvider className="library-navigation min-h-0 h-full">
      <Sidebar collapsible="none" className="w-full">
        <SidebarHeader className="p-4">
          <a href="#library-top" className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                <Boxes className="size-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-[13px] font-medium">Tauri ADE</span>
            <Badge variant="code">UI</Badge>
          </a>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {t('library.navigation.subtitle')}
          </p>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <LibrarySections />
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarSeparator />
          <div className="flex items-center gap-2 pt-2">
            <span className="size-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-muted-foreground">
              {t('library.navigation.ready')}
            </span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            tauri.pen
          </p>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
