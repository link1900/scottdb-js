import * as log from 'loglevel';
import { Logger } from 'loglevel';

export type LogTypes = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export type LogOptions = {
  name?: string;
  enabled?: boolean;
  level?: LogTypes;
  context?: Object;
};

export class ObjectLogger {
  public innerLogger: Logger;
  public enabled: boolean;
  public context: Object | undefined;

  constructor(options: LogOptions = {}) {
    const { enabled = true, name = 'default', level = 'info', context = undefined } = options;
    this.innerLogger = log.getLogger(name);
    this.innerLogger.setLevel(level, false);
    this.enabled = enabled;
    this.context = context;
  }

  public formatMessage(level: string, message: string, meta?: object): string {
    return JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta
    });
  }

  public trace(message: string, meta?: object): string | undefined {
    return this.log('trace', message, meta);
  }

  public debug(message: string, meta?: object) {
    return this.log('debug', message, meta);
  }

  public info(message: string, meta?: object) {
    return this.log('info', message, meta);
  }

  public warn(message: string, meta?: object) {
    return this.log('warn', message, meta);
  }

  public error(message: string, error?: Error, meta: any = {}) {
    if (error) {
      meta.error = {
        type: error.name,
        message: error.message,
        stacktrace: error.stack,
        ...error
      };
    }
    return this.log('error', message, meta);
  }

  public log(level: LogTypes, message: string, meta?: object): string | undefined {
    const messageMeta = this.context
      ? {
          ...meta,
          ...this.context
        }
      : meta;
    if (!this.enabled) {
      return undefined;
    }
    const logMessage = this.formatMessage(level, message, messageMeta);
    this.innerLogger[level](logMessage);
    return logMessage;
  }

  get level(): LogTypes {
    switch (this.innerLogger.getLevel()) {
      case log.levels.TRACE:
        return 'trace';
      case log.levels.DEBUG:
        return 'debug';
      case log.levels.INFO:
        return 'info';
      case log.levels.WARN:
        return 'warn';
      case log.levels.ERROR:
        return 'error';
      case log.levels.SILENT:
        return 'info';
    }
  }

  set level(level: LogTypes) {
    this.innerLogger.setLevel(level, false);
  }

  public updateContext(context: Object) {
    this.context = {
      ...this.context,
      ...context
    };
  }
}
