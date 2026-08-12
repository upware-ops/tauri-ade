import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Search, Star } from 'lucide-react'

export function WithIcon() {
  return (
    <InputGroup className="w-[340px]">
      <InputGroupAddon align="inline-start">
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search commands" />
    </InputGroup>
  )
}

export function WithButton() {
  return (
    <InputGroup className="w-[340px]">
      <InputGroupInput defaultValue="~/Projects/tauri-ade" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Browse</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export function WithText() {
  return (
    <InputGroup className="w-[340px]">
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput defaultValue="example.com/releases" />
    </InputGroup>
  )
}

export function WithTextarea() {
  return (
    <InputGroup className="w-[340px]">
      <InputGroupTextarea placeholder="Describe the issue…" />
      <InputGroupAddon align="block-end">
        <InputGroupButton variant="ghost">
          <Star />
          Attach logs
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
