import { ExampleContext } from "./ExampleContext";
import { Step } from "../Step";

export class ExampleSkipStep extends Step<ExampleContext> {
  applies(context: ExampleContext): boolean {
    return super.applies(context) && context.count === 0;
  }

  run(context: ExampleContext): ExampleContext {
    context.count = context.count + 1;
    return context;
  }
}
