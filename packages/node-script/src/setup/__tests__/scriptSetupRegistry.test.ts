import { Command } from "commander";
import {
  getScriptArgStepSequence,
  getScriptStepSequence,
  registerArgSetupStep,
  registerSetupStep,
  resetScriptArgStepSequence,
  resetScriptStepSequence,
  runArgumentSetupSteps,
  runSetupSteps,
} from "../scriptSetupRegistry";

describe("scriptSetupRegistry", () => {
  beforeEach(() => {
    resetScriptArgStepSequence();
    resetScriptStepSequence();
  });

  it("registers the arg step correctly", async () => {
    registerArgSetupStep(() => {});
    expect(getScriptArgStepSequence().steps.length).toEqual(1);
  });

  it("registers the setup step correctly", async () => {
    registerSetupStep(() => {});
    expect(getScriptStepSequence().steps.length).toEqual(1);
  });

  it("clears the arg step correctly", async () => {
    registerArgSetupStep(() => {});
    resetScriptArgStepSequence();
    expect(getScriptArgStepSequence().steps.length).toEqual(0);
  });

  it("clears the setup step correctly", async () => {
    registerSetupStep(() => {});
    resetScriptStepSequence();
    expect(getScriptStepSequence().steps.length).toEqual(0);
  });

  it("runs the arg step correctly", async () => {
    let count = 0;
    registerArgSetupStep(() => {
      count++;
    });
    await runArgumentSetupSteps({ program: new Command() });
    expect(count).toEqual(1);
  });

  it("runs the setup step correctly", async () => {
    let count = 0;
    registerSetupStep(() => {
      count++;
    });
    await runSetupSteps({ program: new Command(), args: {} });
    expect(count).toEqual(1);
  });
});
