import { setVariable, getVariable } from "@link1900/node-environment";
import { logger } from "@link1900/node-logger-api";
import { ScriptSetupContext } from "../setup/ScriptSetupContext";

export function setupLogLevel(context: ScriptSetupContext) {
  if (context.args.logLevel) {
    setVariable("LOG_LEVEL", context.args.logLevel);
  }
  setVariable("LOG_LEVEL", "info", true);
  logger.setLevel(getVariable("LOG_LEVEL") as any);
}
