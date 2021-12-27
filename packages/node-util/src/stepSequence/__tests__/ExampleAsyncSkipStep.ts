import { ExampleContext } from "./ExampleContext";
import { Step } from "../Step";

export class ExampleAsyncSkipStep extends Step<ExampleContext> {
  async applies(context: ExampleContext): Promise<boolean> {
    return super.applies(context) && context.count === 0;
  }

  run(context: ExampleContext): ExampleContext {
    context.count = context.count + 1;
    return context;
  }
}
