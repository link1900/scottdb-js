import { Command } from "commander";

export type CommandDefinition = Command;

export interface ArgSetupContext {
  program: CommandDefinition;
}
