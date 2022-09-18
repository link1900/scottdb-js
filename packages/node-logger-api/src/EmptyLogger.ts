import {
  LoggerInterface,
  LogLevel,
  LogOptions
} from "@link1900/node-logger-interface";

export class EmptyLogger implements LoggerInterface {
  configure(options: LogOptions): void {}

  formatMessage(level: string, message: string, meta?: object): string {
    return "";
  }
  updateContext(context: Object): void {}
  getMetaDataForHooks(): object {
    return {};
  }

  addMetaHook(hook: () => object): void {}

  clearMetaHooks(): void {}

  getLevel(): LogLevel {
    return "silent";
  }

  setLevel(newLevel: LogLevel): void {}

  log(level: LogLevel, message: string, meta?: object): string | undefined {
    return undefined;
  }

  trace(message: string, meta?: object): string | undefined {
    return undefined;
  }

  debug(message: string, meta?: object): string | undefined {
    return undefined;
  }

  info(message: string, meta?: object): string | undefined {
    return undefined;
  }

  warn(message: string, meta?: object): string | undefined {
    return undefined;
  }

  error(message: string, error?: unknown, meta?: any): string | undefined {
    return undefined;
  }
}
