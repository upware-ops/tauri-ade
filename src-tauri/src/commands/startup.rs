#[cfg(desktop)]
use std::sync::atomic::{AtomicU8, Ordering};

use tauri::{AppHandle, WebviewWindow};
#[cfg(desktop)]
use tauri::{Emitter, Manager};

#[cfg(desktop)]
const MAIN_READY: u8 = 1;
#[cfg(desktop)]
const SPLASH_READY: u8 = 2;
#[cfg(desktop)]
const COMPLETE: u8 = 4;
#[cfg(desktop)]
const PAINTED: u8 = 8;
#[cfg(desktop)]
const WAITING_PAINT: u8 = 16;

#[cfg(desktop)]
#[derive(Default)]
pub(crate) struct StartupState {
    flags: AtomicU8,
}

#[cfg(desktop)]
pub(crate) fn is_complete(app: &AppHandle) -> bool {
    app.try_state::<StartupState>()
        .is_some_and(|state| state.flags.load(Ordering::Acquire) & COMPLETE != 0)
}

#[cfg(desktop)]
pub(crate) fn main_ready(app: &AppHandle) -> bool {
    app.state::<StartupState>().flags.load(Ordering::Acquire) & MAIN_READY != 0
}

#[cfg(desktop)]
pub(crate) fn force_complete(app: &AppHandle) {
    let handle = app.clone();
    if let Err(error) = app.run_on_main_thread(move || {
        if let Err(error) = finish_startup(&handle) {
            log::warn!("Failed to finish startup: {error}");
        }
    }) {
        log::warn!("Failed to schedule startup completion: {error}");
    }
}

#[cfg(desktop)]
fn hide_splash(app: &AppHandle) -> Result<(), String> {
    if let Some(splash) = app.get_webview_window("splash") {
        splash.hide().map_err(|error| error.to_string())?;
        if let Err(error) = splash.close() {
            log::warn!("Failed to close the hidden splash window: {error}");
        }
    }
    Ok(())
}

#[cfg(desktop)]
pub(crate) fn wait_for_main_paint(app: &AppHandle) {
    let state = app.state::<StartupState>();
    if app.get_webview_window("splash").is_none()
        || state.flags.fetch_or(WAITING_PAINT, Ordering::AcqRel) & WAITING_PAINT != 0
    {
        return;
    }

    let handle = app.clone();
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_secs(3));
        let app = handle.clone();
        if let Err(error) = handle.run_on_main_thread(move || {
            if app.state::<StartupState>().flags.load(Ordering::Acquire) & PAINTED == 0 {
                log::warn!("Main window paint acknowledgement timed out");
                if let Err(error) = hide_splash(&app) {
                    log::warn!("Failed to hide timed-out splash: {error}");
                }
                if let Err(error) = app.emit_to("main", "startup-reveal", ()) {
                    log::warn!("Failed to retry main window reveal: {error}");
                }
            }
        }) {
            log::warn!("Failed to schedule splash paint fallback: {error}");
        }
    });
}

#[cfg(desktop)]
async fn on_main_thread<T: Send + 'static>(
    app: &AppHandle,
    action: impl FnOnce(&AppHandle) -> Result<T, String> + Send + 'static,
) -> Result<T, String> {
    let (sender, mut receiver) = tauri::async_runtime::channel(1);
    let handle = app.clone();

    app.run_on_main_thread(move || {
        let _ = sender.try_send(action(&handle));
    })
    .map_err(|error| error.to_string())?;

    receiver
        .recv()
        .await
        .ok_or_else(|| "Startup main-thread operation was interrupted".to_string())?
}

#[cfg(desktop)]
fn finish_startup(app: &AppHandle) -> Result<(), String> {
    if is_complete(app) {
        return Ok(());
    }

    let main = app
        .get_webview_window("main")
        .ok_or_else(|| "Main window not found".to_string())?;
    let result = crate::window_state::prepare_target(&main);
    app.state::<StartupState>()
        .flags
        .fetch_or(COMPLETE, Ordering::AcqRel);
    crate::show_main_window(app);

    result
}

#[tauri::command]
#[specta::specta]
pub async fn complete_startup(app: AppHandle, window: WebviewWindow) -> Result<(), String> {
    #[cfg(desktop)]
    {
        let ready = match window.label() {
            "main" => MAIN_READY,
            "splash" => SPLASH_READY,
            _ => return Err("Only startup windows can complete startup".into()),
        };

        on_main_thread(&app, move |app| {
            let state = app.state::<StartupState>();
            let flags = state.flags.fetch_or(ready, Ordering::AcqRel) | ready;
            log::debug!("Startup window ready: {}, state={flags}", window.label());

            if flags & COMPLETE != 0 {
                if ready == MAIN_READY {
                    app.emit_to("main", "startup-reveal", ())
                        .map_err(|error| error.to_string())?;
                }
                return Ok(());
            }

            if flags & (MAIN_READY | SPLASH_READY) == (MAIN_READY | SPLASH_READY) {
                finish_startup(app)?;
            }

            Ok(())
        })
        .await
    }

    #[cfg(mobile)]
    {
        let _ = (app, window);
        Ok(())
    }
}

#[tauri::command]
#[specta::specta]
pub async fn acknowledge_startup_paint(
    app: AppHandle,
    window: WebviewWindow,
) -> Result<(), String> {
    if window.label() != "main" {
        return Err("Only the main window can acknowledge startup paint".into());
    }

    #[cfg(desktop)]
    {
        on_main_thread(&app, |app| {
            if !is_complete(app) {
                return Err("Startup is not complete".into());
            }
            hide_splash(app)?;
            app.state::<StartupState>()
                .flags
                .fetch_or(PAINTED, Ordering::AcqRel);
            Ok(())
        })
        .await
    }

    #[cfg(mobile)]
    {
        let _ = app;
        Ok(())
    }
}

#[tauri::command]
#[specta::specta]
pub async fn toggle_main_window_maximize(
    app: AppHandle,
    window: WebviewWindow,
) -> Result<(), String> {
    if window.label() != "main" {
        return Err("Only the main window can change its maximized state".into());
    }
    #[cfg(desktop)]
    {
        on_main_thread(&app, move |_| {
            let maximized = window.is_maximized().map_err(|error| error.to_string())?;
            let fullscreen = window.is_fullscreen().map_err(|error| error.to_string())?;
            if !crate::window_state::begin_mode_change(&window, Some(!maximized), fullscreen)? {
                return Ok(());
            }
            let result = if maximized {
                window.unmaximize()
            } else {
                window.maximize()
            };
            if let Err(error) = result {
                crate::window_state::cancel_mode_change(&window)?;
                return Err(error.to_string());
            }
            crate::window_state::schedule_capture(&window)
        })
        .await
    }
    #[cfg(mobile)]
    {
        let _ = app;
        Err("Native window modes are unavailable on mobile".into())
    }
}

#[tauri::command]
#[specta::specta]
pub async fn set_main_window_fullscreen(
    app: AppHandle,
    window: WebviewWindow,
    fullscreen: bool,
) -> Result<(), String> {
    if window.label() != "main" {
        return Err("Only the main window can change its fullscreen state".into());
    }
    #[cfg(desktop)]
    {
        on_main_thread(&app, move |_| {
            if window.is_fullscreen().map_err(|error| error.to_string())? == fullscreen {
                return Ok(());
            }
            if !crate::window_state::begin_mode_change(&window, None, fullscreen)? {
                return Ok(());
            }
            if let Err(error) = window.set_fullscreen(fullscreen) {
                crate::window_state::cancel_mode_change(&window)?;
                return Err(error.to_string());
            }
            crate::window_state::schedule_capture(&window)
        })
        .await
    }
    #[cfg(mobile)]
    {
        let _ = (app, fullscreen);
        Err("Native window modes are unavailable on mobile".into())
    }
}
