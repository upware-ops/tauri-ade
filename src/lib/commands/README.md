# Simplified Command System

A lightweight, extensible command system that enables consistent behavior across keyboard shortcuts, menus, and command palette.

## Architecture

**80/20 Approach**: Maximum extensibility with minimal complexity

1. **Command Definition**: Pure objects with predictable structure
2. **Command Context**: Essential actions commands need
3. **Command Registry**: Simple Map-based storage and execution

## Usage

### Using Commands in Components

```typescript
import { executeCommand, useCommandContext } from '@/lib/commands'

function MyComponent() {
  const context = useCommandContext()

  const handleButtonClick = () => {
    executeCommand('show-left-sidebar', context)
  }

  return (
    <button onClick={handleButtonClick}>
      Toggle Sidebar
    </button>
  )
}
```

### Adding New Commands

1. **Create commands** (e.g., `my-feature-commands.ts`):

```typescript
import { useUIStore } from '@/store/ui-store'
import type { AppCommand } from './types'

export const myFeatureCommands: AppCommand[] = [
  {
    id: 'my-action',
    labelKey: 'commands.myAction.label',
    descriptionKey: 'commands.myAction.description', // optional

    execute: context => {
      // Direct store access using getState() pattern
      const currentState = useUIStore.getState()

      // Call actions: context.toggleSidebar()
      // Show feedback: context.showToast('Done!', 'success')
    },

    isAvailable: () => {
      // Optional availability check
      return useUIStore.getState().someCondition
    },
  },
]
```

2. **Register commands in `index.ts`**:

```typescript
import { myFeatureCommands } from './my-feature-commands'

export function initializeCommandSystem(): void {
  registerCommands(navigationCommands)
  registerCommands(myFeatureCommands) // Add here
}
```

3. **Update CommandContext if needed**:

If your commands need new actions, add them to:

- `CommandContext` interface in `src/lib/commands/types.ts`
- the `commandContext` object in `src/hooks/use-command-context.ts`

## Performance Patterns

### getState() Pattern in Commands

Commands use direct store access for optimal performance:

```typescript
execute: context => {
  // ✅ Good: Direct store access in commands
  const { sidebarVisible, toggleSidebar } = useUIStore.getState()
  if (!sidebarVisible) {
    toggleSidebar()
  }
}
```

### Minimal Context

Context only provides essential actions, no state subscriptions:

```typescript
// Only essential actions - no state values. A module-level singleton, so it's stable.
const commandContext: CommandContext = {
  openPreferences: () => useUIStore.getState().togglePreferences(),
  showToast: (message, type = 'info') =>
    void notify(message, undefined, { type }),
}
```

## Available Commands

- **Navigation** (`navigation-commands.ts`): `open-home`, `open-library`, `show-left-sidebar` and `hide-left-sidebar`, `show-right-sidebar` and `hide-right-sidebar` (only when applicable), `open-preferences`
- **Window** (`window-commands.ts`): `window-close`, `window-minimize`, `window-toggle-maximize`, `window-fullscreen`, `window-exit-fullscreen`
- **App** (`app-commands.ts`): `app-about`, `app-check-updates`, `app-quit`
- **Debug** (`notification-commands.ts`): `notification.test-toast`

These categories identify source modules. Palette grouping is separate: `open-home` uses the `navigation` group; `open-library` and `open-preferences` use `settings`.

## Command Structure (Simplified)

```typescript
interface AppCommand {
  id: string // Unique identifier
  labelKey: string // Translation key (e.g., 'commands.myAction.label')
  descriptionKey?: string // Optional translation key for description
  execute: (context) => void // Execution function
  isAvailable?: (context) => boolean // Optional availability check
  shortcut?: string // Optional keyboard shortcut
}
```

Labels use translation keys for runtime language switching. Add translations to `locales/*.json`.

## Key Simplifications

- ✅ **Registry**: Extensible Map-based storage
- ✅ **Performance**: Direct getState() access in commands
- ✅ **Essential Context**: Only actions, no state subscriptions
- ❌ **Removed**: Complex finding functions, hook wrappers, unused utilities
- ❌ **Removed**: Group-based organization (YAGNI)
- ❌ **Removed**: Over-abstracted availability patterns

This gives you **extensibility for teams** while keeping the **complexity minimal**.
