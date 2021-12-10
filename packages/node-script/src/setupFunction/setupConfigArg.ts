import { CommandDefinition } from "../setup/ArgSetupContext";

export function setupConfigArg(program: CommandDefinition) {
  program.option("-c, --config <value>", "Sets config loading directory");
}
