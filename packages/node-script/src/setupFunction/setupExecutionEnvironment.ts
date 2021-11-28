import { setVariable } from "@link1900/node-environment";
import { ScriptSetupContext } from "../setup/ScriptSetupContext";

export function setupExecutionEnvironment(context: ScriptSetupContext) {
  setVariable("EXECUTION_ENVIRONMENT", context.args.env ?? "local");
}
