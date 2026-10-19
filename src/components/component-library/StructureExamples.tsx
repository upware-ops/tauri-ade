import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, FileCode, Folder, Inbox, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { FilterChip } from '@/components/ui/filter-chip'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Specimen } from './Specimen'

export function StructureExamples() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [tasks, setTasks] = useState(0)
  const [reviewed, setReviewed] = useState(false)
  const files = [
    'src/auth/session.ts',
    'src/auth/refresh.ts',
    'src/components/SignIn.tsx',
    'src/lib/tokens.ts',
    'src/store/session.ts',
    'src/services/auth.ts',
    'src/lib/api.ts',
    'src/components/Profile.tsx',
  ]

  return (
    <>
      <Specimen
        name="Tabs"
        description={t('library.structure.tabsDescription')}
      >
        <Tabs defaultValue="diff" className="w-full max-w-xl">
          <TabsList aria-label={t('library.structure.sessionViews')}>
            <TabsTrigger value="diff">
              {t('library.structure.diff')}{' '}
              <span className="font-mono text-[10.5px]">7</span>
            </TabsTrigger>
            <TabsTrigger value="activity">
              {t('library.structure.activity')}
            </TabsTrigger>
            <TabsTrigger value="terminal">
              {t('library.structure.terminal')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="diff">
            <p className="library-note">{t('library.structure.diffBody')}</p>
          </TabsContent>
          <TabsContent value="activity">
            <p className="library-note">
              {t('library.structure.activityBody')}
            </p>
          </TabsContent>
          <TabsContent value="terminal">
            <pre className="library-code">
              $ npm run typecheck{'\n'}✓ Type check complete
            </pre>
          </TabsContent>
        </Tabs>
      </Specimen>
      <Specimen
        name="Filter Chip"
        description={t('library.structure.filterDescription')}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {(['all', 'running', 'review'] as const).map(value => (
              <FilterChip
                key={value}
                active={filter === value}
                count={value === 'all' ? 7 : value === 'running' ? 3 : 4}
                onClick={() => setFilter(value)}
              >
                {t(`library.structure.${value}`)}
              </FilterChip>
            ))}
          </div>
          <p className="library-note" role="status">
            {t('library.structure.filtered', {
              filter: t(
                `library.structure.${filter as 'all' | 'running' | 'review'}`
              ),
            })}
          </p>
        </div>
      </Specimen>
      <Specimen
        name="Card"
        description={t('library.structure.cardDescription')}
      >
        <Card className="w-full max-w-[420px]">
          <CardHeader>
            <CardTitle>{t('library.structure.taskTitle')}</CardTitle>
            <CardDescription>
              fix-auth-refresh · {t('library.structure.minutesAgo')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t('library.structure.taskBody')}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReviewed(value => !value)
                toast(
                  t(
                    reviewed
                      ? 'library.structure.reviewReopened'
                      : 'library.structure.reviewed'
                  )
                )
              }}
            >
              {t(
                reviewed
                  ? 'library.structure.reviewed'
                  : 'library.structure.reviewChanges'
              )}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </Specimen>
      <Specimen
        name="Item"
        description={t('library.structure.itemDescription')}
      >
        <ItemGroup className="w-full max-w-xl">
          <Item variant="outline" role="listitem">
            <ItemMedia variant="icon">
              <FileCode />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>src/auth/refresh.ts</ItemTitle>
              <ItemDescription>
                {t('library.structure.changedFile')}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="code">+24 −8</Badge>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('library.structure.inspectFile')}
                onClick={() => toast(t('library.structure.fileSelected'))}
              >
                <ArrowRight />
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item size="sm" role="listitem">
            <ItemMedia>
              <Folder />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>src/auth</ItemTitle>
              <ItemDescription>
                {t('library.structure.folderBody')}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </Specimen>
      <Specimen
        name="Empty"
        description={t('library.structure.emptyDescription')}
      >
        <div className="w-full">
          {tasks === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Inbox />
                </EmptyMedia>
                <EmptyTitle>{t('library.structure.noTasks')}</EmptyTitle>
                <EmptyDescription>
                  {t('library.structure.noTasksBody')}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setTasks(1)}>
                  <Plus data-icon="inline-start" />
                  {t('library.structure.createTask')}
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileCode />
                </EmptyMedia>
                <EmptyTitle>{t('library.structure.taskCreated')}</EmptyTitle>
                <EmptyDescription>
                  {t('library.structure.taskTitle')}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={() => setTasks(0)}>
                  {t('library.structure.clearTasks')}
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </Specimen>
      <Specimen
        name="Resizable Panels & Scroll Area"
        description={t('library.structure.panelsDescription')}
      >
        <div className="h-44 w-full max-w-xl overflow-hidden rounded-md border">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={40} minSize={25}>
              <div className="flex h-full items-center justify-center bg-sidebar p-4 text-muted-foreground">
                {t('library.structure.dragDivider')}
              </div>
            </ResizablePanel>
            <ResizableHandle
              withHandle
              aria-label={t('library.structure.resizePanels')}
            />
            <ResizablePanel minSize={25}>
              <ScrollArea className="h-44">
                <div className="p-4">
                  <p className="mb-2 text-xs font-medium">
                    {t('library.structure.changedFiles')}
                  </p>
                  {files.map(file => (
                    <div
                      key={file}
                      className="flex items-center gap-2 border-t py-2 font-mono text-[11px]"
                    >
                      <FileCode className="size-3 shrink-0" />
                      <span className="truncate">{file}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Specimen>
      <Specimen
        name="Breadcrumb & Separator"
        description={t('library.structure.breadcrumbDescription')}
      >
        <div className="flex w-full flex-col gap-4">
          <Breadcrumb aria-label={t('library.structure.location')}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#library-top">UpWare</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#library-structure">
                  tauri-ade
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>fix-auth-refresh</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Separator />
          <div className="flex h-5 items-center gap-3 text-xs text-muted-foreground">
            <span>src/auth</span>
            <Separator orientation="vertical" />
            <span>TypeScript</span>
            <Separator orientation="vertical" />
            <span>UTF-8</span>
          </div>
        </div>
      </Specimen>
    </>
  )
}
