import { performanceMonitor } from './performance';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupErrorHandling();
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      this.error('Uncaught error', { error: event.error });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', { error: event.reason });
    });
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      data,
      error,
    };

    this.logs.push(entry);

    // Keep only the last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // Log to console in development
    if (this.isDevelopment) {
      const consoleMethod = console[level] || console.log;
      consoleMethod(`[${new Date(entry.timestamp).toISOString()}] ${message}`, data || '');
      if (error) {
        consoleMethod(error);
      }
    }

    // Send to analytics service in production
    if (!this.isDevelopment && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'log', {
        level,
        message,
        timestamp: entry.timestamp,
        data: JSON.stringify(data),
        error: error ? error.message : undefined,
      });
    }
  }

  public debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  public info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  public warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  public error(message: string, data?: any, error?: Error): void {
    this.log('error', message, data, error);
    performanceMonitor.recordMetric('error_count', 1);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  public getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.slice(-count);
  }
}

export const logger = Logger.getInstance();

// Example usage:
/*
// Debug logging
logger.debug('Component mounted', { componentId: '123' });

// Info logging
logger.info('User action', { action: 'click', button: 'submit' });

// Warning logging
logger.warn('API response slow', { endpoint: '/api/data', duration: 2000 });

// Error logging
try {
  // Some code that might throw
} catch (error) {
  logger.error('Failed to process data', { dataId: '456' }, error);
}

// Get recent logs
const recentLogs = logger.getRecentLogs();

// Get error logs
const errorLogs = logger.getLogsByLevel('error');
*/ 