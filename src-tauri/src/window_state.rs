use std::{
    fs,
    path::PathBuf,
    sync::{Arc, Condvar, Mutex},
    time::{Duration, Instant},
};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, WebviewWindow};

#[derive(Clone, Copy, Deserialize, PartialEq, Serialize)]
struct Position {
    x: i32,
    y: i32,
}

impl From<PhysicalPosition<i32>> for Position {
    fn from(position: PhysicalPosition<i32>) -> Self {
        Self {
            x: position.x,
            y: position.y,
        }
    }
}

#[derive(Clone, Deserialize, PartialEq, Serialize)]
struct SavedState {
    width: u32,
    height: u32,
    #[serde(default)]
    maximized: bool,
    #[serde(default)]
    fullscreen: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    maximized_position: Option<Position>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    maximized_scale_factor: Option<f64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    restore_position: Option<Position>,
}

impl SavedState {
    fn clear_normal_positions(&mut self) {
        if !self.maximized || self.fullscreen {
            self.maximized = false;
            self.maximized_position = None;
            self.maximized_scale_factor = None;
            self.restore_position = None;
        }
    }
}

struct TrackedState {
    saved: SavedState,
    normal_position: Position,
    mode_intent: Option<ModeIntent>,
}

struct ModeIntent {
    maximized: Option<bool>,
    fullscreen: bool,
    started: Instant,
}

impl TrackedState {
    fn update(
        &mut self,
        size: PhysicalSize<u32>,
        position: PhysicalPosition<i32>,
        maximized: bool,
        fullscreen: bool,
    ) {
        let maximized = maximized && !fullscreen;

        if !fullscreen && !maximized && size.width > 0 && size.height > 0 {
            self.saved.width = size.width;
            self.saved.height = size.height;
            self.normal_position = position.into();
        }
        self.saved.maximized = maximized;
        self.saved.fullscreen = fullscreen;
        self.saved.maximized_position = maximized.then_some(position.into());
        self.saved.restore_position = maximized.then_some(self.normal_position);
        if !maximized {
            self.saved.maximized_scale_factor = None;
        }
    }
}

struct MainWindowState {
    tracked: Mutex<TrackedState>,
    save_signal: Arc<(Mutex<Option<Instant>>, Condvar)>,
}

fn start_save_worker(app: &AppHandle, signal: Arc<(Mutex<Option<Instant>>, Condvar)>) {
    let app = app.clone();
    std::thread::spawn(move || loop {
        let (deadline, changed) = &*signal;
        let mut deadline = deadline.lock().unwrap();

        loop {
            match *deadline {
                None => deadline = changed.wait(deadline).unwrap(),
                Some(time) if time > Instant::now() => {
                    deadline = changed
                        .wait_timeout(deadline, time.saturating_duration_since(Instant::now()))
                        .unwrap()
                        .0;
                }
                Some(_) => {
                    *deadline = None;
                    break;
                }
            }
        }
        drop(deadline);

        let handle = app.clone();
        if let Err(error) = app.run_on_main_thread(move || {
            if let Err(error) = settle_and_save(&handle) {
                log::warn!("Failed to persist main window state: {error}");
            }
        }) {
            log::warn!("Failed to schedule main window persistence: {error}");
            break;
        }
    });
}

fn state_path(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_config_dir()
        .map(|directory| directory.join("main-window-state.json"))
        .map_err(|error| error.to_string())
}

fn load(app: &AppHandle) -> Result<Option<SavedState>, String> {
    let path = state_path(app)?;
    let mut saved = match fs::read(&path) {
        Ok(bytes) => serde_json::from_slice::<SavedState>(&bytes)
            .map(Some)
            .map_err(|error| error.to_string())?,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            let legacy_path = path.with_file_name(tauri_plugin_window_state::DEFAULT_FILENAME);
            match fs::read(legacy_path) {
                Ok(bytes) => {
                    let legacy: serde_json::Value =
                        serde_json::from_slice(&bytes).map_err(|error| error.to_string())?;
                    legacy
                        .get("main")
                        .map(|value| {
                            let mut state: SavedState = serde_json::from_value(value.clone())
                                .map_err(|error| error.to_string())?;
                            let position = |x, y| {
                                Some(Position {
                                    x: i32::try_from(value.get(x)?.as_i64()?).ok()?,
                                    y: i32::try_from(value.get(y)?.as_i64()?).ok()?,
                                })
                            };
                            state.maximized_position = position("x", "y");
                            state.restore_position = position("prev_x", "prev_y");
                            Ok::<_, String>(state)
                        })
                        .transpose()?
                }
                Err(error) if error.kind() == std::io::ErrorKind::NotFound => None,
                Err(error) => return Err(error.to_string()),
            }
        }
        Err(error) => return Err(error.to_string()),
    };

    if let Some(state) = &mut saved {
        state.clear_normal_positions();
        state.maximized_scale_factor = state
            .maximized_scale_factor
            .filter(|factor| factor.is_finite() && *factor > 0.0);
    }

    Ok(saved.filter(|state| state.width > 0 && state.height > 0))
}

pub(crate) fn set_size(window: &WebviewWindow, size: PhysicalSize<u32>) -> tauri::Result<()> {
    #[cfg(target_os = "macos")]
    {
        use tauri_nspanel::{NSPoint, NSSize, NSWindow};

        let pointer = window.ns_window()?;
        let size = size.to_logical::<f64>(window.scale_factor()?);
        let native = unsafe { &*(pointer as *const NSWindow) };
        let frame = native.frame();
        // Cocoa preserves the bottom-left corner when its content size changes.
        native.setContentSize(NSSize::new(size.width, size.height));
        native.setFrameTopLeftPoint(NSPoint::new(
            frame.origin.x,
            frame.origin.y + frame.size.height,
        ));
        Ok(())
    }
    #[cfg(not(target_os = "macos"))]
    window.set_size(size)
}

pub(crate) fn set_position(
    window: &WebviewWindow,
    position: PhysicalPosition<i32>,
    scale_factor: f64,
) -> tauri::Result<()> {
    #[cfg(target_os = "macos")]
    {
        use tauri_nspanel::{NSPoint, NSWindow};

        let primary_height = window
            .primary_monitor()?
            .map(|monitor| f64::from(monitor.size().height) / monitor.scale_factor())
            .unwrap_or_default();
        let pointer = window.ns_window()?;
        let position = position.to_logical::<f64>(scale_factor);
        // Tao queues its Cocoa setters; startup must commit geometry before showing the window.
        unsafe { &*(pointer as *const NSWindow) }
            .setFrameTopLeftPoint(NSPoint::new(position.x, primary_height - position.y));
        Ok(())
    }
    #[cfg(target_os = "linux")]
    {
        window.set_position(position.to_logical::<f64>(scale_factor))
    }
    #[cfg(not(any(target_os = "macos", target_os = "linux")))]
    {
        let _ = scale_factor;
        window.set_position(position)
    }
}

pub(crate) fn center(window: &WebviewWindow) -> tauri::Result<()> {
    let Some(monitor) = window.primary_monitor()? else {
        return Ok(());
    };
    let area = monitor.work_area();
    set_position(window, area.position, monitor.scale_factor())?;
    crate::fit_main_window(window, true)?;
    let size = window.outer_size()?;

    set_position(
        window,
        PhysicalPosition::new(
            area.position.x + area.size.width.saturating_sub(size.width) as i32 / 2,
            area.position.y + area.size.height.saturating_sub(size.height) as i32 / 2,
        ),
        monitor.scale_factor(),
    )
}

fn maximized_monitor(
    window: &WebviewWindow,
    position: Option<Position>,
    saved_scale: Option<f64>,
) -> tauri::Result<Option<tauri::Monitor>> {
    let monitors = window.available_monitors()?;
    #[cfg(target_os = "linux")]
    let scale = match saved_scale {
        Some(scale) => scale,
        None => window.scale_factor()?,
    };
    let monitor = position.and_then(|position| {
        #[cfg(target_os = "macos")]
        {
            monitors.into_iter().find(|monitor| {
                let scale = saved_scale.unwrap_or(monitor.scale_factor());
                let position =
                    PhysicalPosition::new(position.x, position.y).to_logical::<f64>(scale);
                let origin = monitor.position().to_logical::<f64>(monitor.scale_factor());
                let size = monitor.size().to_logical::<f64>(monitor.scale_factor());
                position.x >= origin.x
                    && position.y >= origin.y
                    && position.x < origin.x + size.width
                    && position.y < origin.y + size.height
            })
        }
        #[cfg(target_os = "linux")]
        {
            let position = PhysicalPosition::new(position.x, position.y).to_logical::<f64>(scale);
            monitors
                .into_iter()
                .map(|monitor| {
                    let origin = monitor
                        .work_area()
                        .position
                        .to_logical::<f64>(monitor.scale_factor());
                    let distance = (position.x - origin.x).abs() + (position.y - origin.y).abs();
                    (distance, monitor)
                })
                .min_by(|(left, _), (right, _)| left.total_cmp(right))
                .map(|(_, monitor)| monitor)
        }
        #[cfg(not(any(target_os = "macos", target_os = "linux")))]
        {
            let _ = saved_scale;
            monitors.into_iter().min_by_key(|monitor| {
                let origin = monitor.work_area().position;
                (i64::from(position.x) - i64::from(origin.x)).abs()
                    + (i64::from(position.y) - i64::from(origin.y)).abs()
            })
        }
    });
    Ok(monitor.or(window.primary_monitor()?))
}

fn restore_saved_geometry(window: &WebviewWindow, saved: &SavedState) -> Result<Position, String> {
    let monitor = if saved.maximized {
        maximized_monitor(
            window,
            saved.maximized_position,
            saved.maximized_scale_factor,
        )
        .map_err(|error| error.to_string())?
    } else {
        None
    };
    #[cfg(not(target_os = "macos"))]
    if saved.maximized && !saved.fullscreen {
        let normal_position = saved.restore_position.unwrap_or(
            window
                .outer_position()
                .map_err(|error| error.to_string())?
                .into(),
        );
        let size = PhysicalSize::new(saved.width, saved.height);
        if let Some(monitor) = monitor {
            let outer_size = crate::fit_main_window_on_monitor(
                window,
                &monitor,
                size,
                monitor.scale_factor(),
                false,
            )
            .map_err(|error| error.to_string())?;
            #[cfg(target_os = "linux")]
            let scale = monitor.scale_factor();
            #[cfg(not(target_os = "linux"))]
            let scale = 1.0;
            let monitor_origin = monitor.position().to_logical::<f64>(scale);
            let left = f64::from(normal_position.x) / scale;
            let top = f64::from(normal_position.y) / scale;
            let right = left + f64::from(outer_size.width) / scale;
            let bottom = top + f64::from(outer_size.height) / scale;
            let same_monitor = window
                .available_monitors()
                .map_err(|error| error.to_string())?
                .into_iter()
                .map(|candidate| {
                    #[cfg(target_os = "linux")]
                    let scale = candidate.scale_factor();
                    #[cfg(not(target_os = "linux"))]
                    let scale = 1.0;
                    let origin = candidate.position().to_logical::<f64>(scale);
                    let size = candidate.size().to_logical::<f64>(scale);
                    let width = (right.min(origin.x + size.width) - left.max(origin.x)).max(0.0);
                    let height = (bottom.min(origin.y + size.height) - top.max(origin.y)).max(0.0);
                    (width * height, origin == monitor_origin)
                })
                .max_by(|(left, _), (right, _)| left.total_cmp(right))
                .is_some_and(|(area, same)| area > 0.0 && same);
            let position = if same_monitor {
                PhysicalPosition::new(normal_position.x, normal_position.y)
            } else {
                monitor.work_area().position
            };
            set_position(window, position, monitor.scale_factor())
                .map_err(|error| error.to_string())?;
        } else {
            set_size(window, size).map_err(|error| error.to_string())?;
        }
        window.maximize().map_err(|error| error.to_string())?;
        return Ok(normal_position);
    }
    if saved.maximized {
        if let Some(position) = saved.restore_position {
            let scale = monitor
                .as_ref()
                .map(|monitor| monitor.scale_factor())
                .unwrap_or(window.scale_factor().map_err(|error| error.to_string())?);
            set_position(window, PhysicalPosition::new(position.x, position.y), scale)
                .map_err(|error| error.to_string())?;
        }
    }
    set_size(window, PhysicalSize::new(saved.width, saved.height))
        .map_err(|error| error.to_string())?;
    crate::fit_main_window(window, true).map_err(|error| error.to_string())?;
    if !saved.maximized {
        center(window).map_err(|error| error.to_string())?;
    }

    let normal_position = saved.restore_position.unwrap_or(
        window
            .outer_position()
            .map_err(|error| error.to_string())?
            .into(),
    );
    if saved.fullscreen {
        window
            .set_fullscreen(true)
            .map_err(|error| error.to_string())?;
    } else if saved.maximized {
        window.maximize().map_err(|error| error.to_string())?;
    }
    Ok(normal_position)
}

pub(crate) fn initialize(window: &WebviewWindow) -> Result<(), String> {
    let size = window.inner_size().map_err(|error| error.to_string())?;
    let saved = load(window.app_handle())
        .unwrap_or_else(|error| {
            log::warn!("Failed to load main window state: {error}");
            None
        })
        .unwrap_or(SavedState {
            width: size.width,
            height: size.height,
            maximized: false,
            fullscreen: false,
            maximized_position: None,
            maximized_scale_factor: None,
            restore_position: None,
        });
    let normal_position = restore_saved_geometry(window, &saved)?;
    let save_signal = Arc::new((Mutex::new(None), Condvar::new()));
    window.app_handle().manage(MainWindowState {
        tracked: Mutex::new(TrackedState {
            saved,
            normal_position,
            mode_intent: None,
        }),
        save_signal: save_signal.clone(),
    });
    start_save_worker(window.app_handle(), save_signal);
    Ok(())
}

pub(crate) fn prepare_target(window: &WebviewWindow) -> Result<(), String> {
    let state = window.state::<MainWindowState>();
    let saved = state
        .tracked
        .lock()
        .map_err(|error| error.to_string())?
        .saved
        .clone();

    apply_target_geometry(window, &saved)
}

fn apply_target_geometry(window: &WebviewWindow, saved: &SavedState) -> Result<(), String> {
    if saved.fullscreen {
        return Ok(());
    }
    if !saved.maximized {
        crate::fit_main_window(window, true).map_err(|error| error.to_string())?;
        center(window).map_err(|error| error.to_string())?;
        return Ok(());
    }

    #[cfg(target_os = "macos")]
    if let Some(monitor) = maximized_monitor(
        window,
        saved.maximized_position,
        saved.maximized_scale_factor,
    )
    .map_err(|error| error.to_string())?
    {
        let area = monitor.work_area();
        set_position(window, area.position, monitor.scale_factor())
            .map_err(|error| error.to_string())?;
        set_size(window, area.size).map_err(|error| error.to_string())?;
    }

    Ok(())
}

pub(crate) fn capture(window: &WebviewWindow) -> Result<(), String> {
    if !crate::commands::startup::is_complete(window.app_handle())
        || !window.is_visible().map_err(|error| error.to_string())?
        || window.is_minimized().map_err(|error| error.to_string())?
    {
        return Ok(());
    }

    let fullscreen = window.is_fullscreen().map_err(|error| error.to_string())?;
    let maximized = window.is_maximized().map_err(|error| error.to_string())?;
    let size = window.inner_size().map_err(|error| error.to_string())?;
    let position = window.outer_position().map_err(|error| error.to_string())?;
    let state = window.state::<MainWindowState>();
    let mut tracked = state.tracked.lock().map_err(|error| error.to_string())?;
    if tracked.mode_intent.is_some() {
        return Ok(());
    }

    tracked.update(size, position, maximized, fullscreen);
    if maximized && !fullscreen {
        let monitor = window
            .current_monitor()
            .map_err(|error| error.to_string())?;
        tracked.saved.maximized_position = monitor
            .as_ref()
            .map(|monitor| monitor.work_area().position.into());
        tracked.saved.maximized_scale_factor =
            monitor.as_ref().map(|monitor| monitor.scale_factor());
    }

    Ok(())
}

pub(crate) fn schedule_capture(window: &WebviewWindow) -> Result<(), String> {
    if !crate::commands::startup::is_complete(window.app_handle()) {
        return Ok(());
    }
    let state = window.state::<MainWindowState>();
    let (deadline, changed) = &*state.save_signal;
    *deadline.lock().map_err(|error| error.to_string())? =
        Some(Instant::now() + Duration::from_millis(300));
    changed.notify_one();
    Ok(())
}

pub(crate) fn save(app: &AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        capture(&window)?;
    }
    let Some(state) = app.try_state::<MainWindowState>() else {
        return Ok(());
    };
    let tracked = state.tracked.lock().map_err(|error| error.to_string())?;
    let bytes = serde_json::to_vec_pretty(&tracked.saved).map_err(|error| error.to_string())?;
    let path = state_path(app)?;
    let directory = path.parent().expect("Window state path has a parent");
    fs::create_dir_all(directory).map_err(|error| error.to_string())?;
    let temporary = path.with_extension("tmp");
    fs::write(&temporary, bytes).map_err(|error| error.to_string())?;
    fs::rename(temporary, path).map_err(|error| error.to_string())
}

pub(crate) fn begin_mode_change(
    window: &WebviewWindow,
    maximized: Option<bool>,
    fullscreen: bool,
) -> Result<bool, String> {
    let state = window.state::<MainWindowState>();
    if state
        .tracked
        .lock()
        .map_err(|error| error.to_string())?
        .mode_intent
        .is_some()
    {
        return Ok(false);
    }
    capture(window)?;
    let monitor = window
        .current_monitor()
        .map_err(|error| error.to_string())?;
    let mut tracked = state.tracked.lock().map_err(|error| error.to_string())?;
    tracked.mode_intent = Some(ModeIntent {
        maximized,
        fullscreen,
        started: Instant::now(),
    });
    tracked.saved.maximized = maximized.unwrap_or(false) && !fullscreen;
    tracked.saved.fullscreen = fullscreen;
    if tracked.saved.maximized {
        tracked.saved.maximized_position = monitor
            .as_ref()
            .map(|monitor| monitor.work_area().position.into());
        tracked.saved.maximized_scale_factor =
            monitor.as_ref().map(|monitor| monitor.scale_factor());
        tracked.saved.restore_position = Some(tracked.normal_position);
    } else {
        tracked.saved.clear_normal_positions();
    }
    Ok(true)
}

pub(crate) fn cancel_mode_change(window: &WebviewWindow) -> Result<(), String> {
    window
        .state::<MainWindowState>()
        .tracked
        .lock()
        .map_err(|error| error.to_string())?
        .mode_intent = None;
    capture(window)
}

fn settle_and_save(app: &AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let state = window.state::<MainWindowState>();
        let mut tracked = state.tracked.lock().map_err(|error| error.to_string())?;
        if let Some(intent) = &tracked.mode_intent {
            let fullscreen = window.is_fullscreen().map_err(|error| error.to_string())?;
            let maximized = window.is_maximized().map_err(|error| error.to_string())?;
            let settled = fullscreen == intent.fullscreen
                && (fullscreen
                    || intent
                        .maximized
                        .is_none_or(|expected| maximized == expected));
            if !settled && intent.started.elapsed() < Duration::from_secs(3) {
                drop(tracked);
                schedule_capture(&window)?;
                return Ok(());
            }
            tracked.mode_intent = None;
        }
    }
    save(app)
}
