import { CommandDefinition } from "./ArgSetupContext";

export type ScriptSetupArgFunction = (
  program: CommandDefinition
) => void | Promise<void>;
