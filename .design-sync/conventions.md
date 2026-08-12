# Tauri ADE Design System — how to build with it

shadcn/ui (new-york) primitives themed for a desktop app, styled with Tailwind v4
utilities over semantic CSS custom properties.

## Setup

No provider is required for styling. Every token is a plain CSS custom property
defined on `:root` in the shipped stylesheet — import it and components are
themed. Three components need a wrapper for _behaviour_:

- `TooltipProvider` — wrap any subtree containing `Tooltip`.
- `SidebarProvider` — wrap `Sidebar` + `SidebarInset` (it owns the open/collapsed state).
- `Toaster` — mount once near the app root; push messages with `toast()` from `sonner`.

**Dark mode**: add `class="dark"` to a root ancestor (`<html>` or a wrapper div).
Every token has a dark value; no other switch exists. Light is the default.

## Styling idiom

Tailwind utility classes bound to semantic tokens. **Never hard-code a hex colour
or px radius** — use the token utilities so light/dark both work:

| Family   | Real class names                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| Surfaces | `bg-background` `bg-card` `bg-popover` `bg-muted` `bg-accent` `bg-sidebar`                                          |
| Text     | `text-foreground` `text-muted-foreground` `text-card-foreground` `text-primary-foreground` `text-accent-foreground` |
| Actions  | `bg-primary` `bg-secondary` `bg-destructive` (+ their `-foreground` pairs)                                          |
| Lines    | `border-border` `border-input` `ring-ring` `divide-border`                                                          |
| Charts   | `text-chart-1` … `text-chart-5` (also `bg-`/`fill-`)                                                                |
| Radius   | `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-2xl` (all derived from `--radius`)                     |
| Type     | `text-xs`…`text-5xl`, `font-medium` `font-semibold`, `leading-tight` `tracking-tight`                               |

Layout uses ordinary Tailwind: `flex` `grid` `grid-cols-*` `gap-*` `p-*` `w-*`
`max-w-*` `items-center` `justify-between`, plus `sm:` `md:` `lg:` `xl:` and the
`dark:` `hover:` `focus-visible:` `disabled:` variants.

**The stylesheet is a compiled subset, not all of Tailwind.** Everything listed
above is guaranteed present, along with the common spacing/sizing scale. Exotic
utilities and arbitrary values (`p-[13px]`, `bg-[#ff0000]`) are NOT compiled and
will silently do nothing — stay in the vocabulary above.

## Composition

Compound components are **flat named exports, not namespaced**: `CardHeader`, not
`Card.Header`. Import the parts you need alongside the root:

- `Card` + `CardHeader` `CardTitle` `CardDescription` `CardAction` `CardContent` `CardFooter`
- `Field` + `FieldLabel` `FieldDescription` `FieldError` `FieldGroup` `FieldSet` `FieldLegend`
- `Select` + `SelectTrigger` `SelectValue` `SelectContent` `SelectItem` `SelectGroup` `SelectLabel`
- `Dialog`/`Sheet`/`AlertDialog` + their `*Content` `*Header` `*Title` `*Description` `*Footer` `*Trigger`
- `DropdownMenu`, `Command`, `Empty`, `Item`, `InputGroup`, `Breadcrumb`, `Sidebar`, `ToggleGroup`,
  `RadioGroup`, `ResizablePanelGroup`, `ScrollArea`, `Tooltip`, `Popover`, `NativeSelect`, `Kbd`
  follow the same `<Root><RootPart>` naming.

Each component's full part list, props and a worked example are in its
`<Name>.prompt.md`; the exact prop contract is in `<Name>.d.ts`.

## Where the truth lives

Read `_ds/<folder>/styles.css` and the `_ds_bundle.css` it imports before styling
— that file defines every token and every utility that exists. Per-component
docs sit next to each component under `components/<group>/<Name>/`.

## Idiomatic example

```jsx
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Appearance</CardTitle>
    <CardDescription>Choose how the app looks on this device.</CardDescription>
  </CardHeader>
  <CardContent className="flex flex-col gap-6">
    <Field>
      <FieldLabel htmlFor="theme">Color Theme</FieldLabel>
      <Select defaultValue="system">
        <SelectTrigger id="theme">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Applies immediately.</FieldDescription>
    </Field>
    <Field orientation="horizontal">
      <FieldLabel htmlFor="launch">Launch at login</FieldLabel>
      <Switch id="launch" defaultChecked />
    </Field>
  </CardContent>
  <CardFooter className="justify-end gap-2">
    <Button variant="ghost">Reset</Button>
    <Button>Save changes</Button>
  </CardFooter>
</Card>
```
