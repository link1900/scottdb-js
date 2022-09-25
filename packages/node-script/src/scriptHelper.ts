import { Command } from "commander";
import { logger } from "@link1900/node-logger-api";
import {
  getBenchmarkStartTime,
  getBenchmarkEndTimeString,
} from "@link1900/node-util";
import { ScriptSetupContext } from "./setup/ScriptSetupContext";
import {
  registerArgSetupStep,
  registerSetupStep,
  runArgumentSetupSteps,
  runSetupSteps,
} from "./setup/scriptSetupRegistry";
import { setupEnvArg } from "./setupFunction/setupEnvArg";
import { setupExecutionEnvironment } from "./setupFunction/setupExecutionEnvironment";
import { setupLogLevel } from "./setupFunction/setupLogLevel";
import { setupLogArg } from "./setupFunction/setupLogArg";
import { setupConfigArg } from "./setupFunction/setupConfigArg";
import { setupConfigLoading } from "./setupFunction/setupConfigLoading";

export type ScriptFunctionReturnType = void | boolean | Promise<void | boolean>;
export type ScriptFunctionWithoutContext = () => ScriptFunctionReturnType;
export type ScriptFunctionWithContext = (
  context: ScriptSetupContext
) => ScriptFunctionReturnType;
export type ScriptFunction =
  | ScriptFunctionWithoutContext
  | ScriptFunctionWithContext;

export type ExecuteScriptOptions = {
  args?: Record<string, string>;
};

export type StandardScriptSetupOptions = {
  configPath?: string;
};

export function standardScriptSetup(options?: StandardScriptSetupOptions) {
  registerArgSetupStep(setupEnvArg);
  registerArgSetupStep(setupLogArg);
  registerArgSetupStep(setupConfigArg);
  registerSetupStep((context) => {
    if (!context.args.config && options?.configPath) {
      context.args.config = options?.configPath;
    }
  });
  registerSetupStep(setupExecutionEnvironment);
  registerSetupStep(setupConfigLoading);
  registerSetupStep(setupLogLevel);
}

export async function executeScript(
  scriptFunction: ScriptFunction,
  options?: ExecuteScriptOptions
) {
  logger.debug("running arg setup");
  const program = new Command();
  const argContext = await runArgumentSetupSteps({ program });
  const args = options?.args ?? argContext.program.parse().opts();

  logger.debug("running script setup");
  const context = await runSetupSteps({ program: argContext.program, args });

  logger.debug("running script function");
  return scriptFunction(context);
}

/* istanbul ignore next */
export function runScript(scriptFunction: ScriptFunction) {
  logger.info("script starting");
  const startAt = getBenchmarkStartTime();

  executeScript(scriptFunction)
    .then(() => {
      logger.info(`script finished in ${getBenchmarkEndTimeString(startAt)}`);
      process.exit(0);
    })
    .catch((err) => {
      logger.error("error running script", err);
      logger.info(`script failed in ${getBenchmarkEndTimeString(startAt)}`);
      process.exit(1);
    });
}
