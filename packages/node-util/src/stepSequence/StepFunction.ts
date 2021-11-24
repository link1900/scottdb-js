import { Step } from "./Step";

export type StepFunc<Context> = (
  context: Context
) => Context | Promise<Context>;

export class StepFunction<Context> extends Step<Context> {
  func: StepFunc<Context>;
  constructor(func: StepFunc<Context>) {
    super();
    this.func = func;
  }

  async run(context: Context): Promise<Context> {
    return this.func(context);
  }
}
