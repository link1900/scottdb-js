import * as log from "loglevel";
import { Logger } from "loglevel";
import stringify from "json-stringify-safe";
import { LoggerInterface, LogLevel, LogOptions } from "@link1900/node-logger-interface";

export class ObjectLogger implements LoggerInterface {
  public innerLogger: Logger;
  public enabled: boolean;
  public context: Object | undefined;
  public metaHooks: Array<() => object>;

  constructor(options: LogOptions = {}) {
    const {
      enabled = true,
      name = "default",
      level = "info",
      context = undefined,
    } = options;
    this.innerLogger = log.getLogger(name);
    this.innerLogger.setLevel(level, false);
    this.enabled = enabled;
    this.context = context;
    this.metaHooks = [];
  }

  public formatMessage(level: string, message: string, meta?: object): string {
    const hookMeta = this.getMetaDataForHooks();

    // using safe stringify, as log message fields can contain circular structures that can break JSON.stringify
    return stringify({
      message,
      ...hookMeta,
      ...meta,
      timestamp: new Date().toISOString(),
      level,
    });
  }

  public getMetaDataForHooks(): object {
    if (this.metaHooks.length === 0) {
      return {};
    }
    return this.metaHooks
      .map((hook) => hook())
      .reduce((parent, item) => {
        return {
          ...parent,
          ...item,
        };
      }, {});
  }

  public trace(message: string, meta?: object): string | undefined {
    return this.log("trace", message, meta);
  }

  public debug(message: string, meta?: object) {
    return this.log("debug", message, meta);
  }

  public info(message: string, meta?: object) {
    return this.log("info", message, meta);
  }

  public warn(message: string, meta?: object) {
    return this.log("warn", message, meta);
  }

  public error(message: string, error?: Error | unknown, meta: any = {}) {
    if (error && error instanceof Error) {
      // pulling message out to ensure it is at the start of the meta object
      const { message: errorMessage, ...errorFields } = error;
      meta.error = {
        message: errorMessage,
        type: error.name,
        stacktrace: error.stack,
        ...errorFields,
      };
    }
    return this.log("error", message, meta);
  }

  public log(
    level: LogLevel,
    message: string,
    meta?: object
  ): string | undefined {
    const messageMeta = this.context
      ? {
          ...meta,
          ...this.context,
        }
      : meta;
    if (!this.enabled) {
      return undefined;
    }
    const logMessage = this.formatMessage(level, message, messageMeta);
    this.innerLogger[level](logMessage);
    return logMessage;
  }

  public updateContext(context: Object) {
    this.context = {
      ...this.context,
      ...context,
    };
  }

  public addMetaHook(hook: () => object) {
    this.metaHooks.push(hook);
  }

  public clearMetaHooks() {
    this.metaHooks = [];
  }

  configure(options: LogOptions): void {
    const { enabled, name, level, context } = options;
    if (name) {
      this.innerLogger = log.getLogger(name);
    }

    if (level) {
      this.innerLogger.setLevel(level, false);
    }

    if (enabled !== undefined) {
      this.enabled = enabled;
    }

    if (context) {
      this.context = context;
    }
  }

  get level(): LogLevel {
    return this.getLevel();
  }

  getLevel(): LogLevel {
    switch (this.innerLogger.getLevel()) {
      case log.levels.TRACE:
        return "trace";
      case log.levels.DEBUG:
        return "debug";
      case log.levels.INFO:
        return "info";
      case log.levels.WARN:
        return "warn";
      case log.levels.ERROR:
        return "error";
      case log.levels.SILENT:
        return "silent";
    }
  }

  set level(level: LogLevel) {
    this.innerLogger.setLevel(level, false);
  }

  setLevel(newLevel: LogLevel): void {
    this.innerLogger.setLevel(newLevel, false);
  }
}
