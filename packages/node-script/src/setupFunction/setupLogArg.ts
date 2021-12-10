import { CommandDefinition } from "../setup/ArgSetupContext";

export function setupLogArg(program: CommandDefinition) {
  program.option("-l, --log-level <value>", "Set the log level", "info");
}
