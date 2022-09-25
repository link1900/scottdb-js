import { LoggerInterface } from "@link1900/node-logger-interface";
import { EmptyLogger } from "./EmptyLogger";

export {
  LogLevel,
  LogOptions,
  LoggerInterface
} from "@link1900/node-logger-interface";
export * from "./EmptyLogger";

const getExistingNodeLoggerImplementation = () => {
  try {
    return require("@link1900/node-logger");
  } catch (e) {
    return undefined;
  }
};

const existingLogger = getExistingNodeLoggerImplementation();

/**
 * Will use the logger exported by @link1900/node-logger as the logger if one exists otherwise it will be
 * an empty logger
 */
export const logger: LoggerInterface = existingLogger
  ? existingLogger.logger
  : new EmptyLogger();
