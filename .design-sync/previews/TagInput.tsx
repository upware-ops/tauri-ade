import * as React from 'react'
import { Label } from '@/components/ui/label'
import { TagInput, type Tag } from '@/components/ui/tag-input'

const seed = (texts: string[]): Tag[] =>
  texts.map((text, i) => ({ id: `t${i}`, text }))

export function WithTags() {
  const [tags, setTags] = React.useState<Tag[]>(
    seed(['desktop', 'tauri', 'rust'])
  )
  return (
    <div className="grid w-[360px] gap-2">
      <Label>Workspace tags</Label>
      <TagInput tags={tags} onTagsChange={setTags} />
    </div>
  )
}

export function EmptyState() {
  const [tags, setTags] = React.useState<Tag[]>([])
  return (
    <div className="w-[360px]">
      <TagInput
        tags={tags}
        onTagsChange={setTags}
        placeholder="Add a tag and press Enter…"
      />
    </div>
  )
}

export function Disabled() {
  const [tags, setTags] = React.useState<Tag[]>(seed(['locked', 'read-only']))
  return (
    <div className="w-[360px]">
      <TagInput tags={tags} onTagsChange={setTags} disabled />
    </div>
  )
}
