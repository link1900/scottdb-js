import { chainPromiseFunctions, PromiseErrorOptions } from "../promiseHelper";
import { Step } from "./Step";

export class StepSequence<Context> {
  steps: Step<Context>[];

  constructor(steps?: Array<Step<Context>>) {
    this.steps = [];
    if (steps !== undefined) {
      this.addSteps(steps);
    }
  }

  addStep(step: Step<Context>) {
    this.steps.push(step);
  }

  addSteps(steps: Array<Step<Context>>) {
    steps.forEach((step) => this.addStep(step));
  }

  removeStep(step: Step<Context>) {
    this.removeStepById(step.id);
  }

  removeStepById(stepId: string) {
    this.steps = this.steps.filter((s) => s.id !== stepId);
  }

  clearSteps() {
    this.steps = [];
  }

  runSteps(
    initContext: Context,
    options: PromiseErrorOptions = { errorStrategy: "throw" }
  ): Context | Promise<Context> {
    return chainPromiseFunctions<Context>(
      initContext,
      this.steps.map((step) => {
        return (ctx: Context) => {
          return step.run(ctx);
        };
      }),
      options
    );
  }
}
