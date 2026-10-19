import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Check,
  Code,
  Italic,
  LayoutGrid,
  List,
  Plus,
  Star,
  Underline,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Kbd, KbdGroup, ShortcutHint } from '@/components/ui/kbd'
import { Spinner } from '@/components/ui/spinner'
import { Specimen } from './Specimen'

export function ActionExamples() {
  const { t } = useTranslation()
  const [count, setCount] = useState(3)
  const [starred, setStarred] = useState(false)
  const [running, setRunning] = useState(false)

  return (
    <>
      <Specimen
        name="Button"
        description={t('library.actions.buttonDescription')}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                'default',
                'secondary',
                'outline',
                'ghost',
                'destructive',
                'link',
              ] as const
            ).map(variant => (
              <Button
                key={variant}
                variant={variant}
                onClick={() => toast(t('library.actions.clicked', { variant }))}
              >
                {t(`library.actions.${variant}`)}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCount(value => value + 1)}
            >
              <Plus data-icon="inline-start" />
              {t('library.actions.small')}
            </Button>
            <Button onClick={() => setCount(value => value + 1)}>
              <Plus data-icon="inline-start" />
              {t('library.actions.newTask')}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setCount(value => value + 1)}
            >
              {t('library.actions.large')}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button disabled>{t('library.actions.disabled')}</Button>
            <Button
              variant="outline"
              aria-pressed={running}
              onClick={() => setRunning(value => !value)}
            >
              {running ? <Spinner /> : <Check data-icon="inline-start" />}
              {t(running ? 'library.actions.stop' : 'library.actions.start')}
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label={t('library.actions.addTask')}
              onClick={() => setCount(value => value + 1)}
            >
              <Plus />
            </Button>
          </div>
          <p className="library-note" role="status">
            {t('library.actions.taskCount', { count })}
          </p>
        </div>
      </Specimen>
      <Specimen
        name="Button Group"
        description={t('library.actions.groupDescription')}
      >
        <div className="flex flex-wrap items-center gap-4">
          <ButtonGroup aria-label={t('library.actions.counter')}>
            <Button
              variant="outline"
              aria-label={t('library.actions.previous')}
              onClick={() => setCount(value => Math.max(0, value - 1))}
            >
              <ArrowLeft />
            </Button>
            <ButtonGroupText>{count}</ButtonGroupText>
            <Button
              variant="outline"
              aria-label={t('library.actions.next')}
              onClick={() => setCount(value => value + 1)}
            >
              <ArrowRight />
            </Button>
          </ButtonGroup>
          <ButtonGroup aria-label={t('library.actions.runActions')}>
            <Button
              variant="secondary"
              onClick={() => setRunning(value => !value)}
            >
              {t(running ? 'library.actions.stop' : 'library.actions.start')}
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant="secondary"
              onClick={() => toast(t('library.actions.changesReady'))}
            >
              <Code data-icon="inline-start" />
              {t('library.actions.review')}
            </Button>
          </ButtonGroup>
        </div>
      </Specimen>
      <Specimen
        name="Toggle & Toggle Group"
        description={t('library.actions.toggleDescription')}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Toggle
            aria-label={t('library.actions.star')}
            pressed={starred}
            onPressedChange={setStarred}
          >
            <Star />
            <span>
              {t(starred ? 'library.actions.starred' : 'library.actions.star')}
            </span>
          </Toggle>
          <ToggleGroup
            type="multiple"
            defaultValue={['bold']}
            variant="outline"
            aria-label={t('library.actions.formatting')}
          >
            <ToggleGroupItem
              value="bold"
              aria-label={t('library.actions.bold')}
            >
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              aria-label={t('library.actions.italic')}
            >
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="underline"
              aria-label={t('library.actions.underline')}
            >
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            defaultValue="grid"
            aria-label={t('library.actions.view')}
          >
            <ToggleGroupItem
              value="grid"
              aria-label={t('library.actions.grid')}
            >
              <LayoutGrid />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label={t('library.actions.list')}
            >
              <List />
            </ToggleGroupItem>
          </ToggleGroup>
          <Toggle disabled aria-label={t('library.actions.disabled')}>
            <Star />
          </Toggle>
        </div>
      </Specimen>
      <Specimen name="Kbd" description={t('library.actions.kbdDescription')}>
        <div className="flex flex-wrap items-center gap-4">
          <KbdGroup aria-label="Command K">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup aria-label="Control Shift P">
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
          <Kbd>Enter</Kbd>
          <Kbd>Esc</Kbd>
          <ShortcutHint>
            {t('library.search')}
            <Kbd>⌘K</Kbd>
          </ShortcutHint>
        </div>
      </Specimen>
    </>
  )
}
