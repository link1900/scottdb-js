import { executeScript, standardScriptSetup } from "../scriptHelper";
import {
  registerArgSetupStep,
  registerSetupStep,
  resetScriptArgStepSequence,
  resetScriptStepSequence,
} from "../setup/scriptSetupRegistry";
import { setupEnvArg } from "../setupFunction/setupEnvArg";
import { setupExecutionEnvironment } from "../setupFunction/setupExecutionEnvironment";
import { setupLogArg } from "../setupFunction/setupLogArg";
import { setupLogLevel } from "../setupFunction/setupLogLevel";

describe("executeScript()", () => {
  beforeEach(() => {
    resetScriptArgStepSequence();
    resetScriptStepSequence();
  });

  it("runs the script correctly", async () => {
    registerArgSetupStep(setupEnvArg);
    registerArgSetupStep(setupLogArg);
    registerSetupStep(setupExecutionEnvironment);
    registerSetupStep(setupLogLevel);
    let count = 0;
    const args: Record<string, string> = {};

    const result = await executeScript(
      () => {
        count++;
        return true;
      },
      { args }
    );
    expect(result).toEqual(true);
    expect(count).toEqual(1);
  });
});

describe("standardScriptSetup()", () => {
  beforeEach(() => {
    resetScriptArgStepSequence();
    resetScriptStepSequence();
  });

  it("runs standard script setup", async () => {
    standardScriptSetup();
    let count = 0;
    const args: Record<string, string> = {};

    const result = await executeScript(
      () => {
        count++;
        return true;
      },
      { args }
    );
    expect(result).toEqual(true);
    expect(count).toEqual(1);
  });
});
