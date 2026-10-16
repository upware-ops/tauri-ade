import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GitBranch, Search, Send, X } from 'lucide-react'
import { toast } from 'sonner'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { InputOTP } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { TagInput, type Tag } from '@/components/ui/tag-input'
import { Textarea } from '@/components/ui/textarea'
import { Specimen } from './Specimen'

export function FormExamples() {
  const { t, i18n } = useTranslation()
  const [branch, setBranch] = useState('fix-auth-refresh')
  const [invalidBranch, setInvalidBranch] = useState('fix auth refresh')
  const [description, setDescription] = useState(t('library.forms.taskValue'))
  const [taskName, setTaskName] = useState(t('library.forms.taskNameValue'))
  const [search, setSearch] = useState('')
  const [prompt, setPrompt] = useState('')
  const [agent, setAgent] = useState('claude')
  const [priority, setPriority] = useState('normal')
  const [review, setReview] = useState(true)
  const [includeTests, setIncludeTests] = useState(false)
  const [mixed, setMixed] = useState<boolean | 'indeterminate'>('indeterminate')
  const [autoReview, setAutoReview] = useState(true)
  const [mode, setMode] = useState('sequential')
  const [tags, setTags] = useState<Tag[]>([
    { id: 'bug', text: t('library.forms.bug') },
    { id: 'auth', text: t('library.forms.authentication') },
  ])
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 16))
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    new Date(2026, 9, 16)
  )
  const [code, setCode] = useState('123')
  const [budget, setBudget] = useState([64])
  const [range, setRange] = useState([24, 80])
  const branchIsValid = /^[a-zA-Z0-9/-]+$/.test(invalidBranch)

  return (
    <>
      <Specimen
        name={t('library.forms.input')}
        description={t('library.forms.inputDescription')}
      >
        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="demo-branch">
              {t('library.forms.branchName')}
            </FieldLabel>
            <Input
              id="demo-branch"
              value={branch}
              onChange={event => setBranch(event.target.value)}
              placeholder={t('library.forms.branchPlaceholder')}
            />
          </Field>
          <Field data-disabled>
            <FieldLabel htmlFor="demo-disabled-input">
              {t('library.forms.disabled')}
            </FieldLabel>
            <Input id="demo-disabled-input" value="main" disabled />
          </Field>
          <Field data-invalid={!branchIsValid}>
            <FieldLabel htmlFor="demo-invalid-branch">
              {t('library.forms.invalidBranch')}
            </FieldLabel>
            <Input
              id="demo-invalid-branch"
              value={invalidBranch}
              onChange={event => setInvalidBranch(event.target.value)}
              aria-invalid={!branchIsValid}
              aria-describedby={branchIsValid ? undefined : 'demo-branch-error'}
            />
            {!branchIsValid && (
              <FieldError id="demo-branch-error">
                {t('library.forms.branchError')}
              </FieldError>
            )}
          </Field>
        </div>
      </Specimen>

      <Specimen
        name={t('library.forms.textarea')}
        description={t('library.forms.textareaDescription')}
      >
        <Field className="max-w-xl">
          <FieldLabel htmlFor="demo-task-description">
            {t('library.forms.taskDescription')}
          </FieldLabel>
          <Textarea
            id="demo-task-description"
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder={t('library.forms.taskPlaceholder')}
            rows={3}
          />
        </Field>
      </Specimen>

      <Specimen
        name={t('library.forms.field')}
        description={t('library.forms.fieldDescription')}
      >
        <Field className="max-w-xl" data-invalid={!taskName.trim()}>
          <FieldLabel htmlFor="demo-field-task">
            {t('library.forms.taskName')}
          </FieldLabel>
          <Input
            id="demo-field-task"
            value={taskName}
            onChange={event => setTaskName(event.target.value)}
            aria-invalid={!taskName.trim()}
            aria-describedby={
              taskName.trim()
                ? 'demo-field-hint'
                : 'demo-field-hint demo-field-error'
            }
          />
          <FieldDescription id="demo-field-hint">
            {t('library.forms.taskNameHint')}
          </FieldDescription>
          <FieldError id="demo-field-error">
            {!taskName.trim() && t('library.forms.requiredError')}
          </FieldError>
        </Field>
      </Specimen>

      <Specimen
        name={t('library.forms.inputGroup')}
        description={t('library.forms.inputGroupDescription')}
      >
        <div className="grid w-full max-w-xl gap-3">
          <InputGroup>
            <InputGroupInput
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder={t('library.forms.searchPlaceholder')}
              aria-label={t('library.forms.searchTasks')}
            />
            <InputGroupAddon>
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label={t('library.forms.clearSearch')}
                disabled={!search}
                onClick={() => setSearch('')}
              >
                <X aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput
              value={branch}
              onChange={event => setBranch(event.target.value)}
              aria-label={t('library.forms.branchName')}
            />
            <InputGroupAddon>
              <GitBranch aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupTextarea
              value={prompt}
              onChange={event => setPrompt(event.target.value)}
              placeholder={t('library.forms.promptPlaceholder')}
              aria-label={t('library.forms.prompt')}
            />
            <InputGroupAddon align="block-end" className="justify-end">
              <InputGroupButton
                variant="default"
                disabled={!prompt.trim()}
                onClick={() => {
                  toast.success(t('library.forms.messageSent'))
                  setPrompt('')
                }}
              >
                <Send aria-hidden="true" />
                {t('library.forms.send')}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Specimen>

      <Specimen
        name={t('library.forms.select')}
        description={t('library.forms.selectDescription')}
      >
        <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="demo-agent">
              {t('library.forms.agent')}
            </FieldLabel>
            <Select value={agent} onValueChange={setAgent}>
              <SelectTrigger id="demo-agent" className="w-full">
                <SelectValue placeholder={t('library.forms.selectAgent')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="claude">
                    {t('library.forms.claude')}
                  </SelectItem>
                  <SelectItem value="codex">
                    {t('library.forms.codex')}
                  </SelectItem>
                  <SelectItem value="gemini">
                    {t('library.forms.gemini')}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="demo-priority">
              {t('library.forms.priority')}
            </FieldLabel>
            <NativeSelect
              id="demo-priority"
              className="min-w-40"
              value={priority}
              onChange={event => setPriority(event.target.value)}
            >
              <NativeSelectOption value="low">
                {t('library.forms.low')}
              </NativeSelectOption>
              <NativeSelectOption value="normal">
                {t('library.forms.normal')}
              </NativeSelectOption>
              <NativeSelectOption value="high">
                {t('library.forms.high')}
              </NativeSelectOption>
            </NativeSelect>
          </Field>
        </div>
      </Specimen>

      <Specimen
        name={t('library.forms.checkbox')}
        description={t('library.forms.checkboxDescription')}
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="demo-review"
              checked={review}
              onCheckedChange={value => setReview(value === true)}
            />
            <Label htmlFor="demo-review">
              {t('library.forms.reviewChanges')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="demo-include-tests"
              checked={includeTests}
              onCheckedChange={value => setIncludeTests(value === true)}
            />
            <Label htmlFor="demo-include-tests">
              {t('library.forms.includeTests')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="demo-mixed"
              checked={mixed}
              onCheckedChange={setMixed}
            />
            <Label htmlFor="demo-mixed">{t('library.forms.selectFiles')}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="demo-locked" disabled />
            <Label htmlFor="demo-locked">{t('library.forms.locked')}</Label>
          </div>
        </div>
      </Specimen>

      <Specimen
        name={t('library.forms.switch')}
        description={t('library.forms.switchDescription')}
      >
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="demo-auto-review"
              checked={autoReview}
              onCheckedChange={setAutoReview}
            />
            <Label htmlFor="demo-auto-review">
              {t('library.forms.autoReview')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="demo-network" disabled />
            <Label htmlFor="demo-network">
              {t('library.forms.networkAccess')}
            </Label>
          </div>
        </div>
      </Specimen>

      <Specimen
        name={t('library.forms.radio')}
        description={t('library.forms.radioDescription')}
      >
        <RadioGroup
          value={mode}
          onValueChange={setMode}
          aria-label={t('library.forms.executionMode')}
          className="flex flex-wrap gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem id="demo-sequential" value="sequential" />
            <Label htmlFor="demo-sequential">
              {t('library.forms.sequential')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="demo-parallel" value="parallel" />
            <Label htmlFor="demo-parallel">{t('library.forms.parallel')}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="demo-scheduled" value="scheduled" disabled />
            <Label htmlFor="demo-scheduled">
              {t('library.forms.scheduled')}
            </Label>
          </div>
        </RadioGroup>
      </Specimen>

      <Specimen
        name={t('library.forms.tags')}
        description={t('library.forms.tagsDescription')}
      >
        <Field className="max-w-xl">
          <FieldLabel htmlFor="demo-labels">
            {t('library.forms.labels')}
          </FieldLabel>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder={t('library.forms.addLabel')}
            inputProps={{ id: 'demo-labels' }}
            removeTagLabel={tag => t('library.forms.removeTag', { tag })}
          />
        </Field>
      </Specimen>

      <Specimen
        name={t('library.forms.date')}
        description={t('library.forms.dateDescription')}
      >
        <Field className="max-w-xs">
          <FieldLabel htmlFor="demo-due-date">
            {t('library.forms.dueDate')}
          </FieldLabel>
          <DatePicker
            id="demo-due-date"
            value={date}
            onChange={setDate}
            placeholder={t('library.forms.selectDate')}
            clearLabel={t('library.forms.clearDate')}
          />
        </Field>
      </Specimen>

      <Specimen
        name={t('library.forms.calendar')}
        description={t('library.forms.calendarDescription')}
      >
        <div className="flex flex-col gap-3">
          <Calendar
            mode="single"
            defaultMonth={calendarDate}
            selected={calendarDate}
            onSelect={setCalendarDate}
            aria-label={t('library.forms.scheduleDate')}
            className="rounded-lg border"
          />
          <p className="text-muted-foreground text-xs" aria-live="polite">
            {calendarDate
              ? t('library.forms.selectedDate', {
                  date: calendarDate.toLocaleDateString(i18n.language),
                })
              : t('library.forms.noDate')}
          </p>
        </div>
      </Specimen>

      <Specimen
        name={t('library.forms.otp')}
        description={t('library.forms.otpDescription')}
      >
        <div className="flex flex-col gap-3">
          <InputOTP
            value={code}
            onChange={setCode}
            aria-label={t('library.forms.verificationCode')}
          />
          <p className="text-muted-foreground text-xs" aria-live="polite">
            {code
              ? t('library.forms.otpValue', { code })
              : t('library.forms.otpEmpty')}
          </p>
        </div>
      </Specimen>

      <Specimen
        name={t('library.forms.slider')}
        description={t('library.forms.sliderDescription')}
      >
        <div className="grid w-full max-w-xl gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4 text-xs">
              <Label htmlFor="demo-context-budget">
                {t('library.forms.contextBudget')}
              </Label>
              <output htmlFor="demo-context-budget">{budget[0]}%</output>
            </div>
            <Slider
              id="demo-context-budget"
              value={budget}
              onValueChange={setBudget}
              thumbLabels={[t('library.forms.contextBudget')]}
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span>{t('library.forms.contextRange')}</span>
              <output>
                {t('library.forms.rangeValue', {
                  min: range[0],
                  max: range[1],
                })}
              </output>
            </div>
            <Slider
              value={range}
              onValueChange={setRange}
              thumbLabels={[
                t('library.forms.minimumContext'),
                t('library.forms.maximumContext'),
              ]}
            />
          </div>
        </div>
      </Specimen>
    </>
  )
}
