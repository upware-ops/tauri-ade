import { Button } from '@/components/ui/button'
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
import { FileText, FolderOpen } from 'lucide-react'

export function Variants() {
  return (
    <div className="grid w-[420px] gap-3">
      <Item variant="default">
        <ItemContent>
          <ItemTitle>Default</ItemTitle>
          <ItemDescription>Transparent background.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline</ItemTitle>
          <ItemDescription>Bordered container.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted</ItemTitle>
          <ItemDescription>Filled with the muted token.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export function WithMediaAndActions() {
  return (
    <Item variant="outline" className="w-[420px]">
      <ItemMedia variant="icon">
        <FolderOpen />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>tauri-ade</ItemTitle>
        <ItemDescription>
          ~/Projects/tauri-ade · indexed 2 minutes ago
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Open
        </Button>
      </ItemActions>
    </Item>
  )
}

export function Grouped() {
  return (
    <ItemGroup className="w-[420px] rounded-lg border">
      <Item size="sm">
        <ItemMedia>
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>PreferencesDialog.tsx</ItemTitle>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item size="sm">
        <ItemMedia>
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>CommandPalette.tsx</ItemTitle>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
