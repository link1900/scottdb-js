import { chainPromiseFunctions, PromiseErrorOptions } from "../promiseHelper";
import { Step } from "./Step";

/**
 * every - will run for every step if applies is true
 * first - will run only the first which has applies true
 */
export type StepSequenceOptions = {
  sequenceMode?: "every" | "first";
};

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

  async runSteps(
    initContext: Context,
    options: StepSequenceOptions & PromiseErrorOptions = {}
  ): Promise<Context> {
    const {
      sequenceMode = "every",
      errorStrategy = "throw",
      errorHandler,
    } = options;
    if (sequenceMode === "every") {
      return chainPromiseFunctions<Context>(
        initContext,
        this.steps.map((step) => {
          return async (ctx: Context) => {
            const doesApply = await step.applies(ctx);
            if (!doesApply) {
              return ctx;
            }
            return step.run(ctx);
          };
        }),
        { errorStrategy, errorHandler }
      );
    }

    if (sequenceMode === "first") {
      for (let step of this.steps) {
        try {
          const doesApply = await step.applies(initContext);
          if (doesApply) {
            return await step.run(initContext);
          }
        } catch (error) {}
      }

      return initContext;
    }

    return initContext;
  }
}
