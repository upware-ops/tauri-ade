# Tauri ADE User Guide

## Getting Started

This guide covers the core features available in Tauri ADE.

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut        | Mac          | Windows/Linux | Action                |
| --------------- | ------------ | ------------- | --------------------- |
| Command Palette | Cmd+K        | Ctrl+K        | Open command palette  |
| Preferences     | Cmd+,        | Ctrl+,        | Open preferences      |
| Quick Pane      | Configurable | Configurable  | Open quick entry pane |
| Left Sidebar    | Cmd+1        | Ctrl+1        | Toggle left sidebar   |
| Right Sidebar   | Cmd+2        | Ctrl+2        | Toggle right sidebar  |
| Full Screen     | Ctrl+Cmd+F   | F11           | Toggle full screen    |

## Core Features

### Home and Component Library

The app opens on Home, showing an empty greeting or your latest quick-pane entry. Use **Home** in the left sidebar to return here.

**Component library** is beside **Settings** at the bottom of the sidebar and in the title bar. It opens the interactive design-system examples, including forms, overlays, materials and the splash preview. The command palette also includes **Go to Home** and **Open Component Library**. Library examples use mock data; leaving the screen resets their local state.

### Command Palette

Press **Cmd+K** to open the command palette - a quick way to find and run commands, including **About**, **Check for Updates** and **Quit**. Start typing to search through available commands.

### Quick Pane

The Quick Pane is a small floating window that can be summoned with a global keyboard shortcut, even when the app is in the background. Type a note and press Enter to send it to the main window; press Escape or click outside to close it. On Linux the shortcut works only in X11 sessions.

Configure the Quick Pane shortcut in **Preferences → Keyboard Shortcuts**.

### Preferences

Press **Cmd+,** to open preferences:

- **Theme**: Light, Dark, or System
- **Language**: Select your preferred language
- **Keyboard Shortcuts**: Customize the Quick Pane shortcut

### Native Menus

On macOS, the menu bar has:

- **App Menu**: About, Check for Updates, Preferences, Component library, Hide, Quit
- **Edit Menu**: Undo, Redo, Cut, Copy, Paste, Select All
- **View Menu**: Home, Toggle sidebars
- **Window Menu**: Minimize, Zoom, Toggle Full Screen, Close Window

Windows and Linux have no menu bar. Use the title bar buttons and the command palette instead.

## Layout

- **Title Bar**: Window controls and app title
- **Left Sidebar**: Collapsible panel (Cmd+1)
- **Main Content**: Primary app content
- **Right Sidebar**: Collapsible panel (Cmd+2)

## Closing and Quitting

Closing the window hides it. Tauri ADE keeps running, and the Quick Pane shortcut still works.

- **Show the window**: launch Tauri ADE again, choose **Show** in the tray icon menu (on Windows, left-click the icon), or on macOS click the Dock icon
- **Quit**: choose **Quit** in the tray icon menu or in the command palette, or on macOS press **Cmd+Q** or use the Dock menu
- On GNOME without the AppIndicator extension there is no tray icon. Launch the app again, then run **Quit** from the command palette

## Updates

Tauri ADE checks GitHub Releases shortly after it starts. You can also check from the command palette or, on macOS, App menu → Check for Updates.

- When an update is available, Tauri ADE asks before installing it
- On macOS and Linux it then asks whether to restart now. Closing the window doesn't apply the update; quit and reopen the app
- On Windows the app closes while the update installs, then reopens
