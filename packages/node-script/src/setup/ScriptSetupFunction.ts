import { ScriptSetupContext } from "./ScriptSetupContext";

export type ScriptSetupFunction = (
  context: ScriptSetupContext
) =>
  | void
  | undefined
  | ScriptSetupContext
  | Promise<void | undefined | ScriptSetupContext>;
