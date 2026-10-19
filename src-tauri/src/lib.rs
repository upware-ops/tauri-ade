//! Tauri application library entry point.
//!
//! This module serves as the main entry point for the Tauri application.
//! Command implementations are organized in the `commands` module,
//! and shared types are in the `types` module.

mod bindings;
mod commands;
mod types;
mod utils;
#[cfg(desktop)]
mod window_state;

use std::sync::atomic::{AtomicBool, Ordering};

use tauri::{AppHandle, Emitter, Manager, RunEvent, WindowEvent};

// Re-export only what's needed externally
pub use types::DEFAULT_QUICK_PANE_SHORTCUT;

/// Set once the user has focused or closed the main window, so the boot watchdog leaves it alone.
static MAIN_WINDOW_SEEN: AtomicBool = AtomicBool::new(false);

#[cfg(desktop)]
static MAIN_WINDOW_FIT_PENDING: AtomicBool = AtomicBool::new(false);
#[cfg(desktop)]
static MAIN_WINDOW_STATE_PENDING: AtomicBool = AtomicBool::new(false);

#[cfg(desktop)]
fn default_window_size(
    available: tauri::PhysicalSize<u32>,
    scale_factor: f64,
) -> tauri::LogicalSize<f64> {
    let scale = 1.0_f64
        .min(f64::from(available.width) / scale_factor * 0.8 / 1000.0)
        .min(f64::from(available.height) / scale_factor * 0.8 / 700.0);

    tauri::LogicalSize::new(1000.0 * scale, 700.0 * scale)
}

#[cfg(desktop)]
fn fit_main_window(window: &tauri::WebviewWindow, fit_position: bool) -> tauri::Result<()> {
    if window.is_fullscreen()? {
        return Ok(());
    }

    let monitor = match window.current_monitor()? {
        Some(monitor) => monitor,
        None => match window.primary_monitor()? {
            Some(monitor) => monitor,
            None => return Ok(()),
        },
    };
    if window.is_maximized()? {
        #[cfg(target_os = "macos")]
        {
            let work_area = monitor.work_area();
            if fit_position
                && !window.is_decorated()?
                && window.outer_position()? != work_area.position
            {
                window_state::set_position(window, work_area.position, monitor.scale_factor())?;
            }
        }
        return Ok(());
    }

    fit_main_window_on_monitor(
        window,
        &monitor,
        window.inner_size()?,
        window.scale_factor()?,
        fit_position,
    )
    .map(|_| ())
}

#[cfg(desktop)]
fn fit_main_window_on_monitor(
    window: &tauri::WebviewWindow,
    monitor: &tauri::Monitor,
    inner_size: tauri::PhysicalSize<u32>,
    scale_factor: f64,
    fit_position: bool,
) -> tauri::Result<tauri::PhysicalSize<u32>> {
    let work_area = monitor.work_area();
    let current_size = window.inner_size()?;
    let outer_size = window.outer_size()?;
    let frame_width = outer_size.width.saturating_sub(current_size.width);
    let frame_height = outer_size.height.saturating_sub(current_size.height);
    let max_width = work_area.size.width.saturating_sub(frame_width).max(1);
    let max_height = work_area.size.height.saturating_sub(frame_height).max(1);
    let min_width = ((1280.0 * scale_factor).round() as u32).clamp(1, max_width);
    let min_height = ((800.0 * scale_factor).round() as u32).clamp(1, max_height);

    #[cfg(target_os = "linux")]
    let constraint = |value| tauri::LogicalUnit::new(f64::from(value) / scale_factor).into();
    #[cfg(not(target_os = "linux"))]
    let constraint = |value| tauri::PhysicalUnit::new(value as i32).into();
    window.set_size_constraints(tauri::WindowSizeConstraints {
        min_width: Some(constraint(min_width)),
        min_height: Some(constraint(min_height)),
        max_width: Some(constraint(max_width)),
        max_height: Some(constraint(max_height)),
    })?;

    let width = inner_size.width.clamp(min_width, max_width);
    let height = inner_size.height.clamp(min_height, max_height);
    if width != current_size.width
        || height != current_size.height
        || window.scale_factor()? != scale_factor
    {
        #[cfg(target_os = "linux")]
        window.set_size(tauri::PhysicalSize::new(width, height).to_logical::<f64>(scale_factor))?;
        #[cfg(not(target_os = "linux"))]
        window_state::set_size(window, tauri::PhysicalSize::new(width, height))?;
    }

    let outer_size = tauri::PhysicalSize::new(
        width.saturating_add(frame_width),
        height.saturating_add(frame_height),
    );
    if !fit_position {
        return Ok(outer_size);
    }

    let position = window.outer_position()?;
    let max_x =
        work_area.position.x + work_area.size.width.saturating_sub(width + frame_width) as i32;
    let max_y =
        work_area.position.y + work_area.size.height.saturating_sub(height + frame_height) as i32;
    let x = position.x.clamp(work_area.position.x, max_x);
    let y = position.y.clamp(work_area.position.y, max_y);
    if x != position.x || y != position.y {
        window_state::set_position(
            window,
            tauri::PhysicalPosition::new(x, y),
            monitor.scale_factor(),
        )?;
    }

    Ok(outer_size)
}

/// Shows, unminimizes, restores the saved state of and focuses the main window.
#[cfg(desktop)]
pub(crate) fn show_main_window(app: &AppHandle) {
    let handle = app.clone();
    if let Err(e) = app.run_on_main_thread(move || {
        if !commands::startup::is_complete(&handle) {
            if let Some(splash) = handle.get_webview_window("splash") {
                if splash.is_visible().unwrap_or(false) || splash.is_minimized().unwrap_or(false) {
                    let _ = splash.show();
                    let _ = splash.unminimize();
                    let _ = splash.set_focus();
                }
            }
            return;
        }

        let initial_handoff = handle.get_webview_window("splash").is_some();
        restore_main_window(&handle, !initial_handoff);

        if handle
            .get_webview_window("main")
            .is_some_and(|window| window.is_visible().unwrap_or(false))
        {
            if let Err(error) = handle.emit_to("main", "startup-reveal", ()) {
                log::warn!("Failed to reveal main window content: {error}");
            }
            commands::startup::wait_for_main_paint(&handle);
        }
    }) {
        log::warn!("Failed to schedule showing the main window: {e}");
    }
}

#[cfg(desktop)]
fn restore_main_window(app: &AppHandle, refit_on_reopen: bool) {
    let Some(window) = app.get_webview_window("main") else {
        log::warn!("Main window not found");
        return;
    };

    let was_hidden = !window.is_visible().unwrap_or(true);

    if refit_on_reopen {
        if let Err(e) = fit_main_window(&window, true) {
            log::warn!("Failed to fit main window to the monitor work area: {e}");
        }
    }
    if was_hidden
        && refit_on_reopen
        && !window.is_fullscreen().unwrap_or(false)
        && !window.is_maximized().unwrap_or(false)
    {
        if let Err(error) = window_state::center(&window) {
            log::warn!("Failed to center the main window: {error}");
        }
    }

    if let Err(e) = window.show() {
        log::warn!("Failed to show main window: {e}");
    }
    if let Err(e) = window.unminimize() {
        log::warn!("Failed to unminimize main window: {e}");
    }

    if let Err(e) = window.set_focus() {
        log::warn!("Failed to focus main window: {e}");
    }

    log::debug!(
        "Main window shown: size={:?}, position={:?}",
        window.inner_size(),
        window.outer_position()
    );
}

/// Application entry point. Sets up all plugins and initializes the app.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = bindings::generate_bindings();

    // Export TypeScript bindings in debug builds
    #[cfg(debug_assertions)]
    bindings::export_ts_bindings();

    // Build with common plugins
    let mut app_builder = tauri::Builder::default();

    // Single instance plugin must be registered FIRST
    // When user tries to open a second instance, show the existing window instead
    #[cfg(desktop)]
    {
        app_builder = app_builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            show_main_window(app);
        }));
    }

    // Updater plugin for in-app updates
    #[cfg(desktop)]
    {
        app_builder = app_builder.plugin(tauri_plugin_updater::Builder::new().build());
    }

    app_builder = app_builder
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_notification::init())
        .plugin({
            #[allow(unused_mut)]
            let mut targets = vec![
                // Always log to stdout for development
                tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout),
                // Write a log file to the app's log directory
                tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
                    file_name: None,
                }),
            ];
            // Log to webview console — excluded on Linux where the WebKitGTK webview
            // doesn't exist during setup(), causing app.emit() to deadlock on the IPC socket.
            #[cfg(not(target_os = "linux"))]
            targets.push(tauri_plugin_log::Target::new(
                tauri_plugin_log::TargetKind::Webview,
            ));
            tauri_plugin_log::Builder::new()
                // Use Debug level in development, Info in production
                .level(if cfg!(debug_assertions) {
                    log::LevelFilter::Debug
                } else {
                    log::LevelFilter::Info
                })
                .targets(targets)
                .build()
        });

    // macOS: Add NSPanel plugin for native panel behavior
    #[cfg(target_os = "macos")]
    {
        app_builder = app_builder.plugin(tauri_nspanel::init());
    }

    app_builder
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            log::info!("Application starting up");
            log::debug!(
                "App handle initialized for package: {}",
                app.package_info().name
            );

            #[cfg(desktop)]
            {
                app.manage(commands::startup::StartupState::default());

                let mut main_config = app
                    .config()
                    .app
                    .windows
                    .iter()
                    .find(|window| window.label == "main")
                    .expect("Main window configuration is required")
                    .clone();

                if let Some(monitor) = app.primary_monitor()? {
                    let work_area = monitor.work_area();
                    let scale = monitor.scale_factor();
                    let size = default_window_size(work_area.size, scale);
                    main_config.width = size.width;
                    main_config.height = size.height;
                    main_config.x = Some(
                        f64::from(work_area.position.x) / scale
                            + (f64::from(work_area.size.width) / scale - size.width) / 2.0,
                    );
                    main_config.y = Some(
                        f64::from(work_area.position.y) / scale
                            + (f64::from(work_area.size.height) / scale - size.height) / 2.0,
                    );
                    main_config.center = false;
                }

                main_config.visible = false;

                log::debug!(
                    "Startup default bounds: {}x{} logical at ({:?}, {:?})",
                    main_config.width,
                    main_config.height,
                    main_config.x,
                    main_config.y
                );

                let window =
                    tauri::WebviewWindowBuilder::from_config(app, &main_config)?.build()?;
                window_state::initialize(&window)?;

                let mut splash_config = main_config;
                splash_config.label = "splash".into();
                splash_config.url = tauri::WebviewUrl::App("splash.html".into());
                splash_config.min_width = None;
                splash_config.min_height = None;
                splash_config.max_width = None;
                splash_config.max_height = None;
                splash_config.decorations = false;
                splash_config.resizable = false;
                splash_config.skip_taskbar = true;

                let splash =
                    tauri::WebviewWindowBuilder::from_config(app, &splash_config)?.build()?;
                #[cfg(target_os = "macos")]
                {
                    use tauri_nspanel::{objc2_app_kit::NSWindowAnimationBehavior, NSWindow};

                    for window in [&window, &splash] {
                        let pointer = window.ns_window()?;
                        // AppKit's automatic show animation scales an otherwise correctly sized window.
                        unsafe { &*(pointer as *const NSWindow) }
                            .setAnimationBehavior(NSWindowAnimationBehavior::None);
                    }
                }
                log::debug!(
                    "Splash window prepared: size={:?}, position={:?}",
                    splash.inner_size(),
                    splash.outer_position()
                );
            }

            // Set up global shortcut plugin (without any shortcuts - we register them separately)
            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::Builder;

                app.handle().plugin(Builder::new().build())?;
            }

            // Load saved preferences and register the quick pane shortcut
            #[cfg(desktop)]
            {
                let saved_shortcut = commands::preferences::load_quick_pane_shortcut(app.handle());
                let shortcut_to_register = saved_shortcut
                    .as_deref()
                    .unwrap_or(DEFAULT_QUICK_PANE_SHORTCUT);

                log::info!("Registering quick pane shortcut: {shortcut_to_register}");
                if let Err(e) = commands::quick_pane::register_quick_pane_shortcut(
                    app.handle(),
                    shortcut_to_register,
                ) {
                    log::warn!("Failed to register quick pane shortcut: {e}");
                }
            }

            // Create the quick pane window (hidden) - must be done on main thread
            if let Err(e) = commands::quick_pane::init_quick_pane(app.handle()) {
                log::error!("Failed to create quick pane: {e}");
                // Non-fatal: app can still run without quick pane
            }

            #[cfg(desktop)]
            {
                if let Err(e) = commands::tray::init_tray(app.handle()) {
                    log::error!("Failed to create tray icon: {e}");
                }
            }

            #[cfg(desktop)]
            {
                let app_handle = app.handle().clone();
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_secs(10));

                    let hidden = app_handle
                        .get_webview_window("main")
                        .is_some_and(|window| !window.is_visible().unwrap_or(true));
                    let splash_visible =
                        app_handle
                            .get_webview_window("splash")
                            .is_some_and(|window| {
                                window.is_visible().unwrap_or(false)
                                    || window.is_minimized().unwrap_or(false)
                            });

                    if commands::startup::main_ready(&app_handle) && splash_visible {
                        return;
                    }

                    if hidden && !MAIN_WINDOW_SEEN.load(Ordering::Relaxed) {
                        log::warn!("Main window still hidden 10s after startup, showing it");
                        commands::startup::force_complete(&app_handle);
                    }
                });
            }

            // NOTE: Application menu is built from JavaScript for i18n support
            // See src/lib/menu.ts for the menu implementation

            Ok(())
        })
        .invoke_handler(builder.invoke_handler())
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| match &event {
            RunEvent::WindowEvent {
                label,
                event: WindowEvent::Focused(true),
                ..
            } if label == "main" => {
                MAIN_WINDOW_SEEN.store(true, Ordering::Relaxed);
                #[cfg(desktop)]
                MAIN_WINDOW_FIT_PENDING.store(true, Ordering::Relaxed);
            }

            #[cfg(desktop)]
            RunEvent::WindowEvent {
                label,
                event: WindowEvent::Resized(_) | WindowEvent::ScaleFactorChanged { .. },
                ..
            } if label == "main" => MAIN_WINDOW_FIT_PENDING.store(true, Ordering::Relaxed),

            #[cfg(desktop)]
            RunEvent::WindowEvent {
                label,
                event: WindowEvent::Moved(_) | WindowEvent::Focused(false),
                ..
            } if label == "main" => MAIN_WINDOW_STATE_PENDING.store(true, Ordering::Relaxed),

            #[cfg(desktop)]
            RunEvent::MainEventsCleared => {
                let fit = MAIN_WINDOW_FIT_PENDING.swap(false, Ordering::Relaxed);
                let capture = MAIN_WINDOW_STATE_PENDING.swap(false, Ordering::Relaxed) || fit;
                if let Some(window) = capture
                    .then(|| app_handle.get_webview_window("main"))
                    .flatten()
                {
                    if commands::startup::is_complete(app_handle)
                        && window.is_visible().unwrap_or(false)
                    {
                        // Native setters can queue placement until the window is shown.
                        if let Err(e) = fit_main_window(&window, fit) {
                            log::warn!("Failed to fit main window to the monitor work area: {e}");
                        }
                    }
                    if let Err(error) = window_state::schedule_capture(&window) {
                        log::warn!("Failed to capture main window state: {error}");
                    }
                }
            }

            // Closing the main window hides it on every platform. The dock, the tray and a
            // relaunch show it again, and the quick-pane shortcut keeps working meanwhile.
            RunEvent::WindowEvent {
                label,
                event: WindowEvent::CloseRequested { api, .. },
                ..
            } if label == "main" => {
                #[cfg(desktop)]
                {
                    api.prevent_close();
                    MAIN_WINDOW_SEEN.store(true, Ordering::Relaxed);

                    if let Err(e) = window_state::save(app_handle) {
                        log::warn!("Failed to save window state: {e}");
                    }

                    // Hide the window, not the app. app_handle.hide() calls NSApplication.hide()
                    // which sets system-level hidden state — showing an NSPanel while hidden
                    // causes macOS to unhide the entire app, including the main window.
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.hide();
                        log::info!("Main window hidden");
                    }
                }
            }

            // macOS: Dock icon clicked — reopen the main window if it was hidden
            #[cfg(target_os = "macos")]
            RunEvent::Reopen { .. } => {
                if let Some(window) = app_handle.get_webview_window("main") {
                    if !window.is_visible().unwrap_or(true) {
                        show_main_window(app_handle);
                        log::info!("Main window reopened from dock");
                    }
                }
            }

            // Cleanup on actual exit (Cmd+Q, Dock, tray or palette Quit).
            // RunEvent::Exit fires reliably before the process exits, unlike ExitRequested
            // which doesn't fire for Cmd+Q on macOS (tauri-apps/tauri#9198).
            RunEvent::Exit => {
                log::info!("Application exiting — performing cleanup");
                #[cfg(desktop)]
                if let Err(error) = window_state::save(app_handle) {
                    log::warn!("Failed to save main window state on exit: {error}");
                }

                // Hide the quick-pane panel to prevent crashes during teardown
                #[cfg(target_os = "macos")]
                {
                    use tauri_nspanel::ManagerExt;
                    if let Ok(panel) = app_handle.get_webview_panel("quick-pane") {
                        panel.hide();
                    }
                }

                // Unregister global shortcuts
                #[cfg(desktop)]
                {
                    use tauri_plugin_global_shortcut::GlobalShortcutExt;
                    if let Err(e) = app_handle.global_shortcut().unregister_all() {
                        log::warn!("Failed to unregister global shortcuts: {e}");
                    }
                }

                log::info!("Cleanup complete");
            }

            _ => {}
        });
}
