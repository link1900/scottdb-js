export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "silent";

export type LogOptions = {
  name?: string;
  enabled?: boolean;
  level?: LogLevel;
  context?: Object;
};

export interface LoggerInterface {
  configure(options: LogOptions): void;

  formatMessage(level: string, message: string, meta?: object): string;

  updateContext(context: Object): void;

  getMetaDataForHooks(): object;

  addMetaHook(hook: () => object): void;

  clearMetaHooks(): void;

  getLevel(): LogLevel;

  setLevel(newLevel: LogLevel): void;

  log(level: LogLevel, message: string, meta?: object): string | undefined;

  trace(message: string, meta?: object): string | undefined;

  debug(message: string, meta?: object): string | undefined;

  info(message: string, meta?: object): string | undefined;

  warn(message: string, meta?: object): string | undefined;

  error(
    message: string,
    error?: Error | unknown,
    meta?: any
  ): string | undefined;
}
