import { setVariable, getVariable } from "@link1900/node-environment";
import { logger, LogTypes } from "@link1900/node-logger";
import { ScriptSetupContext } from "../setup/ScriptSetupContext";

export function setupLogLevel(context: ScriptSetupContext) {
  if (context.args.logLevel) {
    setVariable("LOG_LEVEL", context.args.logLevel);
  }
  setVariable("LOG_LEVEL", "info", true);
  logger.level = getVariable("LOG_LEVEL") as LogTypes;
}
