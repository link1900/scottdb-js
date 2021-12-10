import { StepSequence, StepFunction } from "@link1900/node-util";
import { ArgSetupContext } from "./ArgSetupContext";
import { ScriptSetupArgFunction } from "./ScriptSetupArgFunction";
import { ScriptSetupContext } from "./ScriptSetupContext";
import { ScriptSetupFunction } from "./ScriptSetupFunction";

let scriptArgStepSequence = new StepSequence<ArgSetupContext>();
let scriptStepSequence = new StepSequence<ScriptSetupContext>();

export function registerArgSetupStep(func: ScriptSetupArgFunction) {
  scriptArgStepSequence.addStep(
    new StepFunction((ctx) => {
      func(ctx.program);
      return ctx;
    })
  );
}

export function registerSetupStep(func: ScriptSetupFunction) {
  scriptStepSequence.addStep(
    new StepFunction(async (ctx) => {
      const result = await func(ctx);
      if (!result) {
        return ctx;
      } else {
        return result;
      }
    })
  );
}

export function getScriptArgStepSequence() {
  return scriptArgStepSequence;
}

export function resetScriptArgStepSequence() {
  scriptArgStepSequence.clearSteps();
}

export function getScriptStepSequence() {
  return scriptStepSequence;
}

export function resetScriptStepSequence() {
  scriptStepSequence.clearSteps();
}

export function runArgumentSetupSteps(initContext: ArgSetupContext) {
  return scriptArgStepSequence.runSteps(initContext, {
    errorStrategy: "throw",
  });
}

export function runSetupSteps(initContext: ScriptSetupContext) {
  return scriptStepSequence.runSteps(initContext, {
    errorStrategy: "throw",
  });
}
