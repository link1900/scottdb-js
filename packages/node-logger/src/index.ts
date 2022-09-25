export {
  LoggerInterface,
  LogOptions,
  LogLevel
} from "@link1900/node-logger-interface";

import { ObjectLogger } from "./objectLogger";
export * from "./objectLogger";

export const logger = new ObjectLogger();
