//! System tray icon and its menu.
//!
//! The menu starts with English labels; the frontend sets translated ones via `set_tray_labels`.

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{AppHandle, Manager, Wry};

use crate::types::validate_string_input;

/// Tray menu items whose labels the frontend translates.
struct TrayMenuItems {
    show: MenuItem<Wry>,
    quit: MenuItem<Wry>,
}

/// Creates the tray icon and its Show/Quit menu.
pub fn init_tray(app: &AppHandle) -> tauri::Result<()> {
    let name = &app.package_info().name;

    let show = MenuItem::with_id(app, "tray-show", format!("Show {name}"), true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "tray-quit", format!("Quit {name}"), true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &PredefinedMenuItem::separator(app)?, &quit])?;

    let tray = TrayIconBuilder::with_id("main")
        .tooltip(name)
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "tray-show" => crate::show_main_window(app),
            "tray-quit" => app.exit(0),
            _ => {}
        });

    #[cfg(target_os = "macos")]
    let tray = tray
        .icon(tauri::include_image!("icons/tray-template@2x.png"))
        .icon_as_template(true);

    #[cfg(not(target_os = "macos"))]
    let tray = match app.default_window_icon() {
        Some(icon) => tray.icon(icon.clone()),
        None => tray,
    };

    // Linux AppIndicator emits no click events, so only Windows shows the window on left click
    #[cfg(target_os = "windows")]
    let tray = tray
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|tray, event| {
            use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};

            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                crate::show_main_window(tray.app_handle());
            }
        });

    tray.build(app)?;
    app.manage(TrayMenuItems { show, quit });

    log::info!("Tray icon created");
    Ok(())
}

/// Sets the translated labels of the tray menu items.
#[tauri::command]
#[specta::specta]
pub fn set_tray_labels(app: AppHandle, show: String, quit: String) -> Result<(), String> {
    validate_string_input(&show, 100, "Show label")?;
    validate_string_input(&quit, 100, "Quit label")?;

    let items = app
        .try_state::<TrayMenuItems>()
        .ok_or("Tray icon is not initialized")?;

    items
        .show
        .set_text(show)
        .map_err(|e| format!("Failed to set tray Show label: {e}"))?;
    items
        .quit
        .set_text(quit)
        .map_err(|e| format!("Failed to set tray Quit label: {e}"))
}
