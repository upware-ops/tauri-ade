# Architecture Guide

High-level architectural overview and mental models for this app.

## Philosophy

1. **Clarity over Cleverness** - Predictable patterns over magic
2. **AI-Friendly Architecture** - Clear patterns that AI agents can follow
3. **Performance by Design** - Patterns that prevent common performance pitfalls
4. **Security First** - Built-in security patterns for file system operations
5. **Extensible Foundation** - Easy to add new features without refactoring

## Mental Models

### The "Onion" State Architecture

State management follows a three-layer hierarchy:

```
┌─────────────────────────────────────┐
│           useState                  │  ← Component UI State
│  ┌─────────────────────────────────┐│
│  │          Zustand                ││  ← Global UI State
│  │  ┌─────────────────────────────┐││
│  │  │      TanStack Query         │││  ← Persistent Data
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

**Decision Tree:**

```
Is this data needed across multiple components?
├─ No → useState
└─ Yes → Does this data persist between app sessions?
    ├─ No → Zustand
    └─ Yes → TanStack Query
```

See [state-management.md](./state-management.md) for implementation details.

### Event-Driven Bridge

Rust and React communicate through events for loose coupling:

```
Native Menu Click (macOS) → JS menu action → Store Action / app-actions → State Update
Keyboard Shortcut → Event Handler → Store Action / Command Context → State Update
Command Palette → Command Selection → Command Execution → State Update
```

This ensures the same actions work consistently across all interaction methods.

### Command-Centric Design

The command palette, the title bar's Settings button and the window controls run actions through a centralized [command system](./command-system.md):

- **Commands** are pure objects with `execute()` functions
- **Context** provides all state and actions commands need
- **Registration** merges commands from different domains at runtime

This decouples UI triggers from implementations and enables consistent behavior.

## Pattern Dependencies

Understanding how patterns work together:

```
Command System
├── Depends on: State Management (context)
├── Integrates with: Keyboard Shortcuts, Menus
└── Enables: Consistent behavior across UI

State Management
├── Enables: Performance (getState pattern)
├── Supports: Data Persistence, UI State
└── Foundation for: All other systems

Event-Driven Bridge
├── Enables: Rust-React communication
├── Supports: Security (validation in Rust)
└── Foundation for: Menus, Updates, Notifications
```

## Core Systems

| System               | Documentation                                    |
| -------------------- | ------------------------------------------------ |
| Command System       | [command-system.md](./command-system.md)         |
| Keyboard Shortcuts   | [keyboard-shortcuts.md](./keyboard-shortcuts.md) |
| Native Menus         | [menus.md](./menus.md)                           |
| Quick Panes          | [quick-panes.md](./quick-panes.md)               |
| Data Persistence     | [data-persistence.md](./data-persistence.md)     |
| Internationalization | [i18n-patterns.md](./i18n-patterns.md)           |
| Cross-Platform       | [cross-platform.md](./cross-platform.md)         |

## Component Hierarchy

```
MainWindow (Top-level orchestrator)
├── TitleBar (Window controls + toolbar)
├── LeftSidebar (Collapsible panel)
├── MainWindowContent (Primary content area)
├── RightSidebar (Collapsible panel)
└── Global Overlays
    ├── PreferencesDialog (Settings)
    ├── CommandPalette (Cmd+K)
    └── Toaster (Notifications)
```

## File Organization

```
locales/                  # Translation JSON files
src/
├── components/
│   ├── layout/          # Layout components (MainWindow, sidebars)
│   ├── command-palette/ # Command palette system
│   ├── preferences/     # Preferences dialog system
│   └── ui/              # Shadcn UI components
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization config
├── lib/
│   ├── commands/        # Command system implementation
│   └── menu.ts          # Native menu builder with i18n
├── services/            # TanStack Query + Tauri integration
└── store/               # Zustand stores
```

## Multi-Window Architecture

Tauri applications can have multiple windows, each running a separate JavaScript context. Windows cannot share React state directly.

**Key patterns:**

1. **Separate entry points** - Each window has its own HTML file and React root
2. **Event-based communication** - Use Tauri events to communicate between windows
3. **Window reuse** - Create windows once at startup, then show/hide as needed
4. **Theme synchronization** - Emit theme changes so all windows stay in sync

```typescript
// Window A: emit event
await emit('data-updated', { value: 'new data' })

// Window B: listen and react
listen('data-updated', ({ payload }) => {
  setData(payload.value)
})
```

See [quick-panes.md](./quick-panes.md) for a complete implementation example.

### App Readiness and the Splash Screen

The splash has its own native `splash` window and `splash.html` entry. `MainWindow` mounts once in the hidden `main` window and warms up while the splash runs; revealing it does not remount the application.

Both windows call the typed `commands.completeStartup()` command when ready. Rust identifies the caller from its injected window handle and waits for both signals before beginning the native handoff:

- `App.tsx` registers the reveal listener before signaling readiness after language/menu initialization, with an 8s ceiling for hung startup IPC. Keeping this coordination outside the error boundary also permits handoff to a rendered error screen.
- `SplashScreen` waits for at least 5s after its native window is shown and for `ShaderSurface` to complete the shader's first animation period. `NEURAL_MESH_LOOP_SECONDS` supplies both the 5s visible floor and `u_period`; animation time pauses when hidden/offscreen, so a 10s wall-clock ceiling after show stands in for the period when the splash is covered.
- Reduced motion, unavailable WebGL, shader failures and context loss use the static fallback with the same 5s visible floor.

The native windows stay hidden until their content is ready to paint. `SplashScreen` shows its own window on mount. A Rust watchdog rescues failed startup after 10s; it leaves a visible splash with a ready main application alone, because the splash's ceiling completes a paused animation.

**Covered handoff.** Both readiness signals apply the main window's final saved bounds while it is hidden, then show it at that size. The splash stays at its original size until it closes; startup performs no animated resizing. On macOS, both windows disable AppKit's automatic show/hide animations so the first visible bounds are final. Main renders behind a matching opaque grain cover. After `startup-reveal`, two animation frames and a main-only `acknowledgeStartupPaint` command hide the splash. `StartupReveal` holds its cover opaque for 300ms, then Motion fades it over 300ms with ease-in-out timing and enables the already-mounted content. Reduced motion skips the hold and fade. The shader retains its 10:7 proportions. A 3s paint watchdog rescues an interrupted bridge; the ordinary 10s startup watchdog remains for earlier failures. Reloaded main roots receive a fresh reveal signal even after startup is complete.

**Default and restored bounds.** All four platform configurations set `main.create` and `main.visible` to `false`. Rust computes centered 1000×700 logical-pixel base bounds, scaled down uniformly to fit within 80% of the primary monitor's usable work area. Before main is shown, its native minimum and restoration fitting enlarge these bounds to at least 1280×800 whenever the usable area permits. `window_state.rs` restores normal size and centers the main window on the primary monitor. Only maximized windows save monitor and normal restore positions; fullscreen keeps its mode and the last normal size without positions. Moves stay in memory, settled size/mode changes are saved after 300ms, and close/exit flushes pending state. Typed maximize/fullscreen commands capture normal bounds before changing mode. The prior plugin file is migrated read-only into `main-window-state.json`; neither the splash nor quick pane participates in this record. The splash keeps the calculated base bounds on every launch without inheriting main's minimum. Defaults are content dimensions; decorated native frames are included in the final work-area cap. Main-window minimums are 1280×800 logical pixels, reduced only when the usable area is smaller. Move-only event batches refresh the size limits without clamping the drag position; resize, scale and focus events also fit placement.

Saved maximized windows are fitted against their saved monitor before being shown. Keep startup geometry explicit: GTK setters are queued, and hidden-window getters can still describe the primary monitor.

**Pre-paint theme bootstrap.** `index.html` and `splash.html` read `ui-theme` from `localStorage` before React mounts and paint the matching background and grain. `ThemeProvider` synchronizes persistent preferences afterward. The background and corner radius live on `#root`, preserving macOS transparency and vibrancy.

### App Lifecycle

- **Closing hides.** Closing `main` hides it on every platform (`CloseRequested` in `lib.rs`), and the quick-pane shortcut keeps working. On Windows, the taskbar's "Close window" also hides, because it sends the same close request as the X button.
- **Quitting.** The app quits through the tray's Quit, the palette's Quit (`exit(0)`), and on macOS through ⌘Q or the Dock menu. Cleanup runs in `RunEvent::Exit`.
- **Showing `main` from Rust.** Relaunching, the macOS Dock reopen, the tray's Show and the watchdog all call `show_main_window()` in `lib.rs`.
  - It dispatches to the main thread for native window operations.
  - A hidden normal window is centered when reopened; visible, maximized and fullscreen windows retain their placement.
- **Hidden window.** The macOS menu bar stays usable while `main` is hidden. Menu actions that show UI therefore call `getCurrentWindow().show()` first; see [menus.md](./menus.md).

## Security Architecture

### Tauri Capabilities

Tauri v2 uses a permission-based capabilities system. Each window only gets the permissions it needs.

**Location:** `src-tauri/capabilities/default.json`

```json
{
  "identifier": "main-capability",
  "windows": ["main"],
  "permissions": ["core:window:allow-minimize", "fs:default"]
}
```

**Key rules:**

- Use specific window labels, not `["*"]`
- Only add permissions actually needed
- Remote content (if any) should have minimal permissions

### Content Security Policy

CSP prevents XSS attacks. Configuration is in `src-tauri/tauri.conf.json`.

**Rules:**

- Never load scripts from CDNs - bundle everything locally
- Avoid `'unsafe-eval'` unless absolutely necessary
- Images: restrict to specific domains when possible

### Secure Storage

| Data Type       | Storage                       | Security Level |
| --------------- | ----------------------------- | -------------- |
| API tokens/keys | OS keychain (`keyring` crate) | High           |
| App preferences | App data directory (JSON)     | Medium         |
| User content    | App data directory/SQLite     | Medium         |

Never store sensitive tokens in `tauri-plugin-store` (plain JSON on disk). See [external-apis.md](./external-apis.md) for keychain patterns.

### Rust-First Security

All file operations happen in Rust with built-in validation:

```rust
fn is_blocked_directory(path: &Path) -> bool {
    let blocked_patterns = ["/System/", "/usr/", "/etc/", "/.ssh/"];
    blocked_patterns.iter().any(|pattern| path.starts_with(pattern))
}
```

### Input Sanitization

```rust
pub fn sanitize_filename(filename: &str) -> String {
    filename.chars()
        .filter(|c| !['/', '\\', ':', '*', '?', '"', '<', '>', '|'].contains(c))
        .collect()
}
```

### Atomic File Operations

All disk writes use atomic operations to prevent corruption:

```rust
// Write to temp file, then rename (atomic)
std::fs::write(&temp_path, content)?;
std::fs::rename(&temp_path, &final_path)?;
```

See [Tauri Security Documentation](https://v2.tauri.app/security/) for detailed guidance.

## Type-Safe Tauri Commands

All Tauri commands use [tauri-specta](https://github.com/specta-rs/tauri-specta) for type safety:

```typescript
// ✅ GOOD: Type-safe with autocomplete
import { commands } from '@/lib/tauri-bindings'

const result = await commands.loadPreferences()
if (result.status === 'ok') {
  console.log(result.data.theme)
}

// ❌ BAD: String-based invoke (no type safety)
const prefs = await invoke<AppPreferences>('load_preferences')
```

See [tauri-commands.md](./tauri-commands.md) for adding new commands.

## Quality Gates

Before any changes are committed:

```bash
npm run check:all
```

See [static-analysis.md](./static-analysis.md) for all tools included.

## Anti-Patterns to Avoid

| Anti-Pattern                    | Why It's Bad                        | Do This Instead               |
| ------------------------------- | ----------------------------------- | ----------------------------- |
| State in wrong layer            | Confuses ownership, breaks patterns | Follow the onion model        |
| Direct Rust-React coupling      | Tight coupling, hard to maintain    | Use command system and events |
| Store subscription in callbacks | Causes render cascades              | Use `getState()` pattern      |
| Skipping input validation       | Security vulnerabilities            | Always validate in Rust       |
| Magic/implicit patterns         | Hard for AI and humans to follow    | Prefer explicit, clear code   |

## Adding New Features

1. **Commands** - Add to appropriate command group file
2. **State** - Choose appropriate layer (useState/Zustand/TanStack Query)
3. **UI** - Follow component architecture
4. **Persistence** - Use established [data-persistence.md](./data-persistence.md) patterns
5. **Testing** - Add tests following [testing.md](./testing.md) patterns
6. **Documentation** - Update relevant docs
