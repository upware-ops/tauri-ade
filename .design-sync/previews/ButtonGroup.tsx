import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group'
import { Bold, Italic, Underline } from 'lucide-react'

export function Horizontal() {
  return (
    <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  )
}

export function WithSeparator() {
  return (
    <ButtonGroup>
      <Button variant="outline">Save</Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon" aria-label="Bold">
        <Bold />
      </Button>
      <Button variant="outline" size="icon" aria-label="Italic">
        <Italic />
      </Button>
      <Button variant="outline" size="icon" aria-label="Underline">
        <Underline />
      </Button>
    </ButtonGroup>
  )
}

export function WithText() {
  return (
    <ButtonGroup>
      <ButtonGroupText>Branch</ButtonGroupText>
      <Button variant="outline">main</Button>
      <Button variant="outline">Switch</Button>
    </ButtonGroup>
  )
}

export function Vertical() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Copy path</Button>
      <Button variant="outline">Reveal in Finder</Button>
      <Button variant="outline">Remove</Button>
    </ButtonGroup>
  )
}
