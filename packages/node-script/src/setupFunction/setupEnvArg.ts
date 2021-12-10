import { CommandDefinition } from "../setup/ArgSetupContext";

export function setupEnvArg(program: CommandDefinition) {
  program.option(
    "-e, --env <value>",
    "Sets the execution environment",
    "local"
  );
}
