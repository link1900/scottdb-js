import { loadConfigForEnvironment } from "@link1900/node-environment";
import { ScriptSetupContext } from "../setup/ScriptSetupContext";

export async function setupConfigLoading(context: ScriptSetupContext) {
  const configDir = context.args.config;
  if (configDir) {
    await loadConfigForEnvironment(configDir);
  }
}
