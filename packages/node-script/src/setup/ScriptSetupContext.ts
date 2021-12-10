import { CommandDefinition } from "./ArgSetupContext";

export interface ScriptSetupContext {
  program: CommandDefinition;
  args: Record<string, string>;
}
