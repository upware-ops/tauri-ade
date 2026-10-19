# Logging

Simple logging setup for both Rust backend and TypeScript frontend.

## Quick Start

### Rust (Backend)

```rust
log::info!("Application starting up");
log::debug!("Debug info: {}", some_value);
log::warn!("Something unexpected happened");
log::error!("Error occurred: {}", error);
```

### TypeScript (Frontend)

```typescript
import { logger } from '@/lib/logger'

logger.info('User action completed')
logger.debug('Debug data', { userId: 123, action: 'click' })
logger.warn('Performance warning')
logger.error('Request failed', { error: response.error })
```

## Configuration

### Rust Backend

- Uses `tauri-plugin-log` with standard Rust `log` crate
- **Development**: Debug level
- **Production**: Info level
- Both modes log to stdout and the app log directory; non-Linux builds also configure the Webview target
- Configuration in `src-tauri/src/lib.rs`

### TypeScript Frontend

- **Development**: All logs go to browser console
- **Production**: `warn` and `error` are forwarded to the Rust log through `@tauri-apps/plugin-log`, which needs `log:default` in the window's capability; other levels are dropped
- Pass raw errors in context, for example `logger.error('Action failed', { error })`. Production serialization preserves each `Error`'s stack, falling back to `String(error)` when no stack is available
- Logger utility at `src/lib/logger.ts`

## Log Levels

| Level   | When to Use            | Rust dev | Rust prod | TypeScript dev | TypeScript prod |
| ------- | ---------------------- | -------- | --------- | -------------- | --------------- |
| `trace` | Most verbose debugging | ❌       | ❌        | ✅             | ❌              |
| `debug` | Development debugging  | ✅       | ❌        | ✅             | ❌              |
| `info`  | General information    | ✅       | ✅        | ✅             | ❌              |
| `warn`  | Warning conditions     | ✅       | ✅        | ✅             | ✅              |
| `error` | Error conditions       | ✅       | ✅        | ✅             | ✅              |

## Where Logs Appear

### Development

- **Rust**: Terminal (stdout) + log file in app log directory
- **TypeScript**: Browser DevTools console

### Production

- **Rust**: Terminal (stdout) + log file in app log directory
- **TypeScript**: `warn`/`error` in the same log file

The log file is `Tauri ADE.log` in:

- **macOS:** `~/Library/Logs/com.upware-ops.tauri-ade/`
- **Windows:** `%LOCALAPPDATA%\com.upware-ops.tauri-ade\logs\`
- **Linux:** `~/.local/share/com.upware-ops.tauri-ade/logs/`

## Examples

### Rust Tauri Commands

```rust
#[tauri::command]
async fn save_data(data: MyData) -> Result<(), String> {
    log::info!("Saving data for user: {}", data.user_id);

    match save_to_disk(&data).await {
        Ok(_) => {
            log::info!("Data saved successfully");
            Ok(())
        }
        Err(e) => {
            log::error!("Failed to save data: {}", e);
            Err(format!("Save failed: {}", e))
        }
    }
}
```

### TypeScript React Components

```typescript
import { logger } from '@/lib/logger'

function MyComponent() {
  const handleClick = () => {
    logger.debug('Button clicked', { component: 'MyComponent' })

    try {
      performAction()
      logger.info('Action completed successfully')
    } catch (error) {
      logger.error('Action failed', { error })
    }
  }

  return <button onClick={handleClick}>Click me</button>
}
```

## Best Practices

1. **Use appropriate log levels** - Don't log everything as `info`
2. **Include context** - Add relevant data to help debugging
3. **Log errors with details** - Include error messages and context
4. **Keep messages concise** - But descriptive enough to be useful
5. **Use structured logging** - Include objects/context for complex data

See [error-handling.md](./error-handling.md) for patterns on when to log vs show errors to users.

## Production Considerations

- Rust logs go to the app's log directory (platform-specific location)
- No sensitive data should be logged (passwords, tokens, etc.)
- The plugin supports log rotation when files reach size limits
- Frontend `warn`/`error` reach the log file in production builds; import `{ logger }`, since there are no standalone `info`/`warn` exports
