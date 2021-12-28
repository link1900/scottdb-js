import { Step } from "./Step";

export type StepFunc<Context> = (
  context: Context
) => Context | Promise<Context>;

export type StepFuncApplies<Context> = (
  context: Context
) => boolean | Promise<boolean>;

export class StepFunction<Context> extends Step<Context> {
  func: StepFunc<Context>;
  applicabilityChecker: StepFuncApplies<Context> | undefined;
  constructor(
    func: StepFunc<Context>,
    applicabilityChecker?: StepFuncApplies<Context>
  ) {
    super();
    this.func = func;
    this.applicabilityChecker = applicabilityChecker;
  }

  async applies(context: Context) {
    if (this.applicabilityChecker) {
      const doesApply = await this.applicabilityChecker(context);
      return this.enabled && doesApply;
    } else {
      return this.enabled;
    }
  }

  async run(context: Context): Promise<Context> {
    return this.func(context);
  }
}
