# UI Patterns

## Overview

This app uses a modern CSS stack optimized for Tauri desktop applications:

- **Tailwind CSS v4** with CSS-based configuration
- **shadcn/ui v4** component library
- **OKLCH color space** for perceptually uniform colors
- **Desktop-specific defaults** for native app feel

## Tailwind v4 Configuration

Tailwind v4 uses CSS-based configuration instead of `tailwind.config.js`.

### File Structure

```
src/
├── App.css              # Main window styles + Tailwind imports
├── quick-pane.css       # Quick pane window styles
└── theme-variables.css  # Shared theme variables (colors, radii)
```

**Multi-window theming**: `theme-variables.css` is imported by both `App.css` and `quick-pane.css` so all windows share the same theme tokens. When adding new color variables, add them to `theme-variables.css`.

### Structure

```css
@import 'tailwindcss'; /* Core Tailwind */
@import 'tw-animate-css'; /* Animation utilities */

@custom-variant dark (&:is(.dark *)); /* Dark mode variant */

@theme inline {
  /* Map CSS variables to Tailwind tokens */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... */
}

:root {
  /* Light mode values */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}

.dark {
  /* Dark mode overrides */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}

@layer base {
  /* Global base styles */
}
```

### Key Concepts

| Directive              | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `@theme inline`        | Maps CSS variables to Tailwind's design token system |
| `@custom-variant dark` | Enables `dark:` prefix based on `.dark` class        |
| `@layer base`          | Base styles that apply globally                      |

### Adding Custom Colors

To add a new semantic color:

```css
@theme inline {
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
}

:root {
  --success: oklch(0.7 0.15 145);
  --success-foreground: oklch(1 0 0);
}

.dark {
  --success: oklch(0.6 0.15 145);
  --success-foreground: oklch(1 0 0);
}
```

Then use with Tailwind: `bg-success text-success-foreground`

## Dark Mode

### How It Works

1. **ThemeProvider** (`src/components/ThemeProvider.tsx`) manages theme state
2. Adds `.dark` class to `<html>` element when dark mode is active
3. CSS variables in `.dark` override `:root` values
4. Tailwind's `dark:` variant applies styles conditionally

### Theme Options

- `light` - Force light mode
- `dark` - Force dark mode
- `system` - Follow OS preference (default)

### Using in Components

```tsx
// Access theme in components
import { useTheme } from '@/hooks/use-theme'

function MyComponent() {
  const { theme, setTheme } = useTheme()

  return <button onClick={() => setTheme('dark')}>Current: {theme}</button>
}
```

### Why `.dark` Class (Not `light-dark()`)

This app uses the `.dark` class approach rather than CSS `light-dark()` because:

- Standard pattern for shadcn/ui ecosystem
- JavaScript control over theme switching
- Supports "system" preference detection
- Compatible with all shadcn components

## OKLCH Colors

All colors use the OKLCH color space for perceptual uniformity.

### Format

```css
oklch(lightness chroma hue)
oklch(0.7 0.15 250)  /* L: 0-1, C: 0-0.4, H: 0-360 */
```

### Why OKLCH

- **Perceptually uniform** - Equal steps in values = equal perceived change
- **Wide gamut** - Access to P3 display colors
- **Intuitive** - Lightness is predictable (unlike HSL)

### Color Palette Structure

| Token                                    | Purpose                   |
| ---------------------------------------- | ------------------------- |
| `--background` / `--foreground`          | Page background and text  |
| `--card` / `--card-foreground`           | Card surfaces             |
| `--primary` / `--primary-foreground`     | Primary actions           |
| `--secondary` / `--secondary-foreground` | Secondary actions         |
| `--muted` / `--muted-foreground`         | Subdued elements          |
| `--accent` / `--accent-foreground`       | Highlights                |
| `--destructive`                          | Destructive actions (red) |
| `--border` / `--input` / `--ring`        | Borders and focus rings   |

## Desktop-Specific Styles

The `@layer base` section includes styles that make the app feel native on desktop.

### Text Selection

```css
body {
  user-select: none; /* Disable by default */
}

input,
textarea,
[contenteditable='true'] {
  user-select: text !important; /* Enable in editable areas */
}
```

**Why:** Desktop apps typically don't allow selecting UI text, only content.

### Cursor

```css
* {
  cursor: default; /* Arrow cursor everywhere */
}

input,
textarea {
  cursor: text !important;
}

.cursor-pointer {
  cursor: pointer !important;
}
```

**Why:** Native apps use arrow cursor, not text cursor on labels.

### Scroll Behavior

```css
body {
  overscroll-behavior: none; /* Prevent bounce/refresh */
  overflow: hidden; /* Prevent body scroll */
}
```

**Why:** Prevents pull-to-refresh and elastic scrolling that feels wrong in desktop apps.

### Drag Regions

```css
*[data-tauri-drag-region] {
  -webkit-app-region: drag;
  app-region: drag;
}
```

Apply `data-tauri-drag-region` to elements that should drag the window (like title bars).

## Component Organization

```
src/components/
├── layout/           # App structure
│   ├── MainWindow.tsx
│   ├── LeftSideBar.tsx
│   ├── RightSideBar.tsx
│   └── MainWindowContent.tsx
├── titlebar/         # Window chrome
│   ├── TitleBar.tsx
│   ├── MacOSWindowControls.tsx
│   └── WindowsWindowControls.tsx
├── ui/               # shadcn primitives
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
├── command-palette/  # Command palette feature
├── preferences/      # Preferences dialog
├── ThemeProvider.tsx
└── ErrorBoundary.tsx
```

### Conventions

- **layout/** - Structural components that define app regions
- **titlebar/** - Platform-specific window controls
- **ui/** - shadcn/ui primitives (don't modify directly)
- **Feature folders** - Group related components together

## shadcn/ui Usage

### Adding Components

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

Components are copied to `src/components/ui/` and can be customized.

### Customizing Components

shadcn components are yours to modify. Common customizations:

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva('...', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      // Add custom variant
      success: 'bg-success text-success-foreground',
    },
  },
})
```

### Available Components

This app includes commonly needed components. Run `npx shadcn@latest add [component]` to add more from [ui.shadcn.com](https://ui.shadcn.com/docs/components).

## The `cn()` Utility

All components use the `cn()` utility for conditional classes:

```tsx
import { cn } from '@/lib/utils'

function MyComponent({ className, disabled }) {
  return (
    <div
      className={cn(
        'base-styles here',
        disabled && 'opacity-50',
        className // Allow overrides
      )}
    >
      ...
    </div>
  )
}
```

**Pattern:** Always accept `className` prop and merge with `cn()` for flexibility.

## Component Patterns

### Layout Components

Layout components should:

- Accept `children` and `className` props
- Use flexbox with `overflow-hidden` to prevent content bleed
- Not set external margins (let parent control spacing)

```tsx
interface SideBarProps {
  children?: React.ReactNode
  className?: string
}

export function LeftSideBar({ children, className }: SideBarProps) {
  return (
    <div className={cn('flex flex-col h-full overflow-hidden', className)}>
      {children}
    </div>
  )
}
```

### Visibility with CSS

For panels that toggle visibility, prefer CSS over conditional rendering:

```tsx
// Good: Preserves component state
;<ResizablePanel className={cn(!visible && 'hidden')}>
  <SideBar />
</ResizablePanel>

// Avoid: Loses component state on hide/show
{
  visible && <SideBar />
}
```

This preserves scroll position, form state, and resize dimensions.

## Best Practices

### Do

- Use semantic color tokens (`bg-background`, `text-foreground`)
- Accept `className` prop on components
- Use `cn()` for conditional classes
- Keep desktop UX conventions (cursor, selection, scroll)
- Follow existing patterns in codebase

### Don't

- Use raw color values (`bg-white`, `text-gray-900`)
- Hardcode light/dark specific values
- Override shadcn components in place (copy and modify instead)
- Add `cursor-pointer` everywhere (only for actual clickable elements)
- Use viewport-based responsive design (this is a fixed-size desktop app)

## Component Library Playground

The main window starts on `HomeScreen`, preserving the empty greeting and latest quick-pane entry. `useUIStore.activeView` switches between Home and the interactive library from `src/components/component-library/`; this navigation state is not persisted. `AppNavigation` lists the library beside Settings, and the title bar, command palette and macOS app menu also expose it. The library's section links and token inspector appear on its screen; Home keeps the original empty right panel.

The same library components are available at `/library.html` in the Vite frontend, without native IPC. Mock state stays local to each example; **Reset demo** remounts the examples without changing project data or preferences. Leaving the library unmounts its examples.

Settings remains the shared `PreferencesDialog` overlay. Its General, Appearance and Advanced tabs use the design-system primitives and remain visible at narrow window sizes; the content area scrolls independently of the dialog header and tabs. `SettingsField` associates labels and descriptions with each control, and `preferences.css` uses the shared surface, grain and typography tokens.

The floating quick pane uses the shared `InputGroup` and `Kbd` components over the main grain surface. Enter still submits its text through `quick-pane-submit`; Home retains the latest entry while switching screens.

The shared primitives include the reference Avatar, FilterChip, InputOTP, Progress, Slider, Tabs, StatusIcon and Throbber. Existing Radix controls retain their APIs.

`theme-variables.css` contains the warm neutral design tokens. Inter and Geist Mono are bundled under `public/fonts/`. Grain is a repeating background texture beneath content: XS for controls, SM for sidebars, MD for workspace backgrounds, and LG for comparison. The four PNGs are derived from the reference `grain-presets.glsl`; they do not require one WebGL context per control.

`SplashArtwork` is shared by the native startup splash and the playground and uses the main area's `--background` and `--grain-main` material. The neural mesh and its static RGBA fallback are transparent, so both themes use that same surface. `ShaderSurface` hides the fallback while WebGL renders, pauses offscreen and hidden animations, respects reduced motion, and releases its GPU resources on unmount. Keep the five-second readiness gate in `SplashScreen`; `StartupSplash` forwards readiness, and `App` owns main readiness and reveal events.

The splash uses a centered 1000×700 logical-pixel default, scaled down uniformly to fit within 80% of the primary monitor's usable work area. The first-run main window starts centered at 1280×800 logical pixels, capped to the usable work area, with the same 1280×800 resize minimum unless the monitor is smaller. Splash artwork keeps a centered 10:7 composition inside its background surface, so the mesh, text and fallback retain their proportions even when the containing area has a different shape. Startup waits for at least 5 visible seconds and the shader's first completed animation period.

Rust applies the main window's final bounds while hidden, then shows it without animated resizing. AppKit's automatic show/hide animations are also disabled on macOS to keep the first visible bounds at their final size. The main window is rendered underneath an opaque matching grain cover from its first paint. After the main window is shown, `App` waits two animation frames and acknowledges its paint to Rust, which hides and closes the splash. `StartupReveal` keeps the final-size cover opaque for 300ms, then fades it over 300ms with ease-in-out timing and enables the already-mounted content. Reduced motion skips the hold and fade; bounded native and frontend fallbacks keep a failed handoff from trapping the window behind the cover.

`window_state.rs` persists the main window's normal size in `main-window-state.json`. Normal windows start centered on the primary monitor; ordinary moves stay in memory and never enter the saved record. Maximized windows also save their monitor position and normal restore position. Fullscreen is tracked separately and keeps the last normal size without saving a position. The previous window-state plugin record is read only when migrating existing settings; the splash is excluded from persistence. The native main window caps both dimensions to the monitor work area and clamps restored positions so its header remains reachable; minimum dimensions shrink when the available area is smaller. Event-driven fitting runs at `MainEventsCleared`, while startup commits Cocoa geometry before showing the main window. Move-only event batches refresh size constraints without clamping the drag position, so a small monitor's limits do not remain after moving to a larger screen. Batches with resize, scale or focus events also fit the window's placement.

`MainWindow` keeps the viewport fixed while its content pane scrolls. Dialogs, sheets and popovers constrain their height and scroll their contents; the splash preview preserves its aspect ratio inside the available height.

Control backgrounds use the opaque `--control` composite of the reference base and ghost tint, so workspace grain cannot show through the control's XS material. Shader drawing buffers use untransformed canvas client dimensions, so a modal's entrance zoom does not leave the shader undersampled.
