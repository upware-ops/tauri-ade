# Keyboard Shortcuts

Centralized keyboard shortcut management using native DOM event listeners.

## Current Shortcuts

| Shortcut             | Mac                      | Windows/Linux | Action                |
| -------------------- | ------------------------ | ------------- | --------------------- |
| Open Preferences     | Cmd+,                    | Ctrl+,        | Opens settings dialog |
| Command Palette      | Cmd+K                    | Ctrl+K        | Opens command search  |
| Toggle Left Sidebar  | Cmd+1                    | Ctrl+1        | Show/hide left panel  |
| Toggle Right Sidebar | Cmd+2                    | Ctrl+2        | Show/hide right panel |
| Toggle Fullscreen    | Ctrl+Cmd+F (Window menu) | F11           | Enter/exit fullscreen |

## Architecture

App shortcuts are handled in `src/hooks/use-keyboard-shortcuts.ts`, which `useMainWindowEventListeners` composes. Cmd/Ctrl+K lives in `CommandPalette.tsx`.

```typescript
export function useKeyboardShortcuts(commandContext: CommandContext) {
  useEffect(() => {
    const isMacOS = getPlatform() === 'macos'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMacOS ? e.metaKey : e.ctrlKey) {
        switch (e.key) {
          case ',': {
            e.preventDefault()
            commandContext.openPreferences()
            break
          }
          case '1': {
            e.preventDefault()
            const { leftSidebarVisible, setLeftSidebarVisible } =
              useUIStore.getState()
            setLeftSidebarVisible(!leftSidebarVisible)
            break
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [commandContext])
}
```

**Critical**: Use `getState()` to access store data in event handlers to avoid render cascades. See [State Management](./state-management.md#the-getstate-pattern).

## Adding New Shortcuts

### 1. Add to event handler

```typescript
// src/hooks/use-keyboard-shortcuts.ts
case '3': {
  e.preventDefault()
  commandContext.myNewAction()
  break
}
```

### 2. Add to native menu (if applicable)

```typescript
// src/lib/menu.ts
await MenuItem.new({
  id: 'my-action',
  text: t('menu.myAction'),
  accelerator: 'CmdOrCtrl+3',
  action: handleMyAction,
})
```

See [Menus](./menus.md) for full menu integration details.

## Modifier Keys

```typescript
// Cmd on macOS, Ctrl elsewhere. On macOS, Ctrl is a text-editing modifier (Ctrl+K deletes to end of line)
if (isMacOS ? e.metaKey : e.ctrlKey) {
}

// With Shift
if ((isMacOS ? e.metaKey : e.ctrlKey) && e.shiftKey) {
}

// Function keys (no modifier needed)
if (e.key === 'F1') {
}
```

**Always call `e.preventDefault()`** to prevent browser defaults (like Cmd+, opening browser settings).

## Why Native DOM Events

Native DOM event listeners are used instead of libraries like `react-hotkeys-hook` because they provide more reliable execution in the Tauri environment.

## Conventions

| Pattern         | Keys                |
| --------------- | ------------------- |
| Preferences     | Cmd/Ctrl + ,        |
| Search/Command  | Cmd/Ctrl + K        |
| Panel toggles   | Cmd/Ctrl + 1,2,3... |
| File operations | Cmd/Ctrl + N,O,S    |
| Undo            | Cmd/Ctrl + Z        |
| Redo            | Cmd/Ctrl + Shift+Z  |

## Troubleshooting

| Issue                             | Check                                              |
| --------------------------------- | -------------------------------------------------- |
| Shortcuts not firing              | `useMainWindowEventListeners` called in MainWindow |
| Browser intercepts shortcut       | Add `e.preventDefault()`                           |
| Different behavior Mac vs Windows | macOS checks `metaKey`, others `ctrlKey`           |
