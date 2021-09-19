import { InternalServerError } from "@link1900/node-error";
import { logger } from "@link1900/node-logger";
import { readJsonFileFromDisk } from "@link1900/node-util";
import * as path from "path";

export function findVariable(key: string): string | undefined {
  return process.env[key];
}

export function getVariable(key: string, defaultValue?: string): string {
  const envVar = findVariable(key);
  if (!envVar) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new InternalServerError(`Environment variable ${key} was not found`);
  }
  return envVar;
}

export function getVariableAsInteger(key: string): number {
  const stringValue = getVariable(key);
  const result = parseInt(stringValue, 10);
  if (!Number.isInteger(result)) {
    throw new InternalServerError(`Environment variable ${key} was not a valid integer`);
  }
  return result;
}

export function isVariableEnabled(key: string): boolean {
  try {
    const result = getVariable(key);
    return result.trim().toLowerCase() === "true";
  } catch (err) {
    return false;
  }
}

export function setVariable(envVarName: string, envVarValue: string, disableOverride: boolean = false): boolean {
  if (process.env[envVarName] !== undefined && disableOverride) {
    return false;
  }

  process.env[envVarName] = envVarValue;
  return true;
}

export async function loadConfigFile(filePath: string, override: boolean = false): Promise<boolean> {
  try {
    const configToLoad = await readJsonFileFromDisk(filePath);
    logger.trace(`Loading environment variables from config file ${filePath}`);
    return loadConfigObject(configToLoad, override);
  } catch (error) {
    logger.warn(`Unable to load config from config file ${filePath}`);
    return false;
  }
}

export function loadConfigObject(configToLoad: object, override: boolean = false): boolean {
  Object.keys(configToLoad).forEach((key) => {
    setVariable(key, configToLoad[key], !override);
  });
  return true;
}

export async function loadConfigForEnvironment(configPath: string) {
  const executionEnvironment = findVariable("EXECUTION_ENVIRONMENT");
  if (executionEnvironment) {
    logger.info(`Loading environment variables for ${executionEnvironment}`);
    const configFilePath = path.join(configPath, `${executionEnvironment}.env.json`);
    await loadConfigFile(configFilePath);
  } else {
    logger.info("No environment was set for EXECUTION_ENVIRONMENT");
  }
  await loadConfigFile(path.join(configPath, "env.json"));
}
