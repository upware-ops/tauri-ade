/**
 * Simple logging utility for the frontend
 *
 * In development: logs to browser console
 * In production: forwards warnings and errors to the Tauri log plugin
 */
import { error as logError, warn as logWarn } from '@tauri-apps/plugin-log'

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, unknown>
}

const errorsAsStrings = (_key: string, value: unknown) =>
  value instanceof Error ? (value.stack ?? String(value)) : value

class Logger {
  private isDevelopment = import.meta.env.DEV

  /**
   * Log a trace message (most verbose)
   */
  trace(message: string, context?: Record<string, unknown>): void {
    this.log('trace', message, context)
  }

  /**
   * Log a debug message (development only)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context)
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context)
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context)
  }

  /**
   * Log an error message
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context)
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    }

    // Always log to console in development
    if (this.isDevelopment) {
      this.logToConsole(entry)
    } else if (level === 'warn' || level === 'error') {
      void this.logToBackend(entry)
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString()
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`

    const args = entry.context
      ? [prefix, entry.message, entry.context]
      : [prefix, entry.message]

    switch (entry.level) {
      case 'trace':
      case 'debug':
        console.debug(...args)
        break
      case 'info':
        console.info(...args)
        break
      case 'warn':
        console.warn(...args)
        break
      case 'error':
        console.error(...args)
        break
    }
  }

  private async logToBackend(entry: LogEntry): Promise<void> {
    try {
      const message = entry.context
        ? `${entry.message} ${JSON.stringify(entry.context, errorsAsStrings)}`
        : entry.message
      await (entry.level === 'error' ? logError : logWarn)(message)
    } catch (error) {
      console.warn('Failed to send log to backend:', error)
    }
  }
}

// Export a singleton logger instance
export const logger = new Logger()
