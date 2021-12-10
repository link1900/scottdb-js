#!/usr/bin/env ts-node

import {
  registerArgSetupStep,
  registerSetupStep,
  runScript,
  setupEnvArg,
  setupExecutionEnvironment,
} from "../src";

import { logger } from "@link1900/node-logger";

async function main() {
  logger.info(
    `the current environment is: ${process.env.EXECUTION_ENVIRONMENT}`
  );
}

registerArgSetupStep(setupEnvArg);
registerSetupStep(setupExecutionEnvironment);
runScript(main);
