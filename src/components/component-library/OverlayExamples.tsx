import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  GitBranch,
  ListPlus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Specimen } from './Specimen'

export function OverlayExamples() {
  const { t } = useTranslation()
  const [taskName, setTaskName] = useState(t('library.forms.taskNameValue'))
  const [branch, setBranch] = useState('fix-auth-refresh')
  const [draftName, setDraftName] = useState(taskName)
  const [draftBranch, setDraftBranch] = useState(branch)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [review, setReview] = useState(true)
  const [notify, setNotify] = useState(false)
  const [showCompleted, setShowCompleted] = useState(true)
  const [agent, setAgent] = useState('claude')
  const [deleted, setDeleted] = useState(false)
  const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right')
  const [selectedCommand, setSelectedCommand] = useState('')
  // cmdk scrolls the initial selection through all scrollable ancestors.
  const [commandValue, setCommandValue] = useState('unfocused')
  const branchIsValid = /^[a-zA-Z0-9/-]+$/.test(draftBranch)

  const openDialog = (open: boolean) => {
    if (open) {
      setDraftName(taskName)
      setDraftBranch(branch)
    }
    setDialogOpen(open)
  }

  return (
    <>
      <Specimen
        name={t('library.overlays.dialog')}
        description={t('library.overlays.dialogDescription')}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Dialog open={dialogOpen} onOpenChange={openDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                {t('library.overlays.editTask')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('library.overlays.editTitle')}</DialogTitle>
                <DialogDescription>
                  {t('library.overlays.editDescription')}
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-5"
                onSubmit={event => {
                  event.preventDefault()
                  setTaskName(draftName.trim())
                  setBranch(draftBranch)
                  setDeleted(false)
                  setDialogOpen(false)
                  toast.success(t('library.overlays.taskSaved'))
                }}
              >
                <Field>
                  <FieldLabel htmlFor="demo-dialog-name">
                    {t('library.forms.taskName')}
                  </FieldLabel>
                  <Input
                    id="demo-dialog-name"
                    value={draftName}
                    onChange={event => setDraftName(event.target.value)}
                    required
                  />
                </Field>
                <Field data-invalid={!branchIsValid}>
                  <FieldLabel htmlFor="demo-dialog-branch">
                    {t('library.forms.branchName')}
                  </FieldLabel>
                  <Input
                    id="demo-dialog-branch"
                    value={draftBranch}
                    onChange={event => setDraftBranch(event.target.value)}
                    aria-invalid={!branchIsValid}
                    aria-describedby={
                      branchIsValid ? undefined : 'demo-dialog-branch-error'
                    }
                    required
                  />
                  {!branchIsValid && (
                    <FieldError id="demo-dialog-branch-error">
                      {t('library.forms.branchError')}
                    </FieldError>
                  )}
                </Field>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      {t('library.overlays.cancel')}
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={!draftName.trim() || !branchIsValid}
                  >
                    {t('library.overlays.save')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <span className="text-muted-foreground text-xs" aria-live="polite">
            {taskName}
          </span>
        </div>
      </Specimen>

      <Specimen
        name={t('library.overlays.alertDialog')}
        description={t('library.overlays.alertDescription')}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">{t('library.overlays.reset')}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('library.overlays.resetTitle')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('library.overlays.resetDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t('library.overlays.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: 'destructive' })}
                onClick={() => {
                  setTaskName(t('library.forms.taskNameValue'))
                  setBranch('fix-auth-refresh')
                  setDeleted(false)
                  toast.success(t('library.overlays.taskReset'))
                }}
              >
                {t('library.overlays.confirmReset')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Specimen>

      <Specimen
        name={t('library.overlays.popover')}
        description={t('library.overlays.popoverDescription')}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal aria-hidden="true" />
              {t('library.overlays.runOptions')}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            aria-label={t('library.overlays.runOptions')}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-medium">
                  {t('library.overlays.runOptions')}
                </h4>
                <p className="text-muted-foreground text-xs">
                  {t('library.overlays.runOptionsDescription')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="demo-popover-review"
                  checked={review}
                  onCheckedChange={value => setReview(value === true)}
                />
                <Label htmlFor="demo-popover-review">
                  {t('library.overlays.reviewBeforeMerge')}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="demo-popover-notify"
                  checked={notify}
                  onCheckedChange={value => setNotify(value === true)}
                />
                <Label htmlFor="demo-popover-notify">
                  {t('library.overlays.notifyWhenDone')}
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Specimen>

      <Specimen
        name={t('library.overlays.dropdown')}
        description={t('library.overlays.dropdownDescription')}
      >
        <div className="flex flex-wrap items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t('library.overlays.taskActions')}
                <ChevronDown aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>
                {t('library.overlays.taskActions')}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => openDialog(true)}>
                  {t('library.overlays.rename')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    toast.success(t('library.overlays.duplicated'))
                  }
                >
                  {t('library.overlays.duplicate')}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              >
                {t('library.overlays.showCompleted')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                {t('library.overlays.agent')}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={agent} onValueChange={setAgent}>
                <DropdownMenuRadioItem value="claude">
                  {t('library.forms.claude')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="codex">
                  {t('library.forms.codex')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="gemini">
                  {t('library.forms.gemini')}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {t('library.overlays.moveTo')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(['backlog', 'inProgress', 'done'] as const).map(status => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={() =>
                        toast.info(
                          t('library.overlays.moved', {
                            status: t(`library.overlays.${status}`),
                          })
                        )
                      }
                    >
                      {t(`library.overlays.${status}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={deleted}
                onSelect={() => {
                  setDeleted(true)
                  toast(t('library.overlays.deleted'), {
                    action: {
                      label: t('library.overlays.undo'),
                      onClick: () => {
                        setDeleted(false)
                        toast.success(t('library.overlays.restored'))
                      },
                    },
                  })
                }}
              >
                {t('library.overlays.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-muted-foreground text-xs" aria-live="polite">
            {deleted
              ? t('library.overlays.deleted')
              : t(`library.forms.${agent}`)}
          </span>
        </div>
      </Specimen>

      <Specimen
        name={t('library.overlays.sheet')}
        description={t('library.overlays.sheetDescription')}
      >
        <div className="flex flex-wrap items-center gap-3">
          <NativeSelect
            value={side}
            onChange={event => setSide(event.target.value as typeof side)}
            aria-label={t('library.overlays.side')}
          >
            {(['right', 'left', 'top', 'bottom'] as const).map(direction => (
              <NativeSelectOption key={direction} value={direction}>
                {t(`library.overlays.${direction}`)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                {t('library.overlays.openSheet')}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>{t('library.overlays.sheetTitle')}</SheetTitle>
                <SheetDescription>
                  {t('library.overlays.sheetBody')}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-5 px-4 pb-4">
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-xs">
                    {t('library.forms.taskName')}
                  </p>
                  <p className="text-sm font-medium">{taskName}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-xs">
                    {t('library.forms.branchName')}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <GitBranch className="size-4" aria-hidden="true" />
                    {branch}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-xs">
                    {t('library.overlays.status')}
                  </p>
                  <Badge variant="secondary">
                    {t('library.overlays.ready')}
                  </Badge>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">
                    {t('library.overlays.close')}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </Specimen>

      <Specimen
        name={t('library.overlays.tooltip')}
        description={t('library.overlays.tooltipDescription')}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <Search aria-hidden="true" />
              {t('library.overlays.inspect')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('library.overlays.inspectHint')}</TooltipContent>
        </Tooltip>
      </Specimen>

      <Specimen
        name={t('library.overlays.command')}
        description={t('library.overlays.commandDescription')}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <Command
            className="rounded-lg border"
            label={t('library.overlays.commandSearch')}
            value={commandValue}
            onValueChange={setCommandValue}
          >
            <CommandInput
              placeholder={t('library.overlays.commandPlaceholder')}
              aria-label={t('library.overlays.commandSearch')}
              onFocus={() => {
                if (commandValue === 'unfocused') setCommandValue('new-task')
              }}
            />
            <CommandList>
              <CommandEmpty>{t('library.overlays.noResults')}</CommandEmpty>
              <CommandGroup heading={t('library.overlays.suggestions')}>
                <CommandItem
                  value="new-task"
                  keywords={[t('library.overlays.newTask')]}
                  onSelect={() =>
                    setSelectedCommand(t('library.overlays.newTask'))
                  }
                >
                  <ListPlus aria-hidden="true" />
                  {t('library.overlays.newTask')}
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
                <CommandItem
                  value="open-branch"
                  keywords={[t('library.overlays.openBranch')]}
                  onSelect={() =>
                    setSelectedCommand(t('library.overlays.openBranch'))
                  }
                >
                  <GitBranch aria-hidden="true" />
                  {t('library.overlays.openBranch')}
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
                <CommandItem
                  value="review-task"
                  keywords={[t('library.overlays.reviewTask')]}
                  onSelect={() =>
                    setSelectedCommand(t('library.overlays.reviewTask'))
                  }
                >
                  <Sparkles aria-hidden="true" />
                  {t('library.overlays.reviewTask')}
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
            <CommandFooter>
              <span className="flex items-center gap-1.5">
                <kbd className="font-mono">↑↓</kbd>
                {t('library.overlays.navigate')}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="font-mono">↵</kbd>
                {t('library.overlays.selectCommand')}
              </span>
            </CommandFooter>
          </Command>
          <p className="text-muted-foreground text-xs" aria-live="polite">
            {selectedCommand
              ? t('library.overlays.selectedCommand', {
                  command: selectedCommand,
                })
              : t('library.overlays.commandHint')}
          </p>
        </div>
      </Specimen>

      <Specimen
        name={t('library.overlays.toast')}
        description={t('library.overlays.toastDescription')}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.success(t('library.overlays.successMessage'), {
                description: t('library.overlays.successDescription'),
              })
            }
          >
            {t('library.overlays.success')}
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info(t('library.overlays.infoMessage'))}
          >
            {t('library.overlays.info')}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error(t('library.overlays.errorMessage'), {
                description: t('library.overlays.errorDescription'),
              })
            }
          >
            {t('library.overlays.error')}
          </Button>
        </div>
      </Specimen>
    </>
  )
}
