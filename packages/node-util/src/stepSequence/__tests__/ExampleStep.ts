import { ExampleContext } from "./ExampleContext";
import { Step } from "../Step";

export class ExampleStep extends Step<ExampleContext> {
  run(context: ExampleContext): ExampleContext {
    context.count = context.count + 1;
    return context;
  }
}
