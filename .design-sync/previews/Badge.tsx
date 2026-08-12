import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Stable</Badge>
      <Badge variant="secondary">Beta</Badge>
      <Badge variant="destructive">Deprecated</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  )
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <Check />
        Synced
      </Badge>
      <Badge variant="destructive">
        <X />
        Failed
      </Badge>
    </div>
  )
}

export function Numeric() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>3</Badge>
      <Badge variant="secondary">12</Badge>
      <Badge variant="outline">99+</Badge>
    </div>
  )
}
