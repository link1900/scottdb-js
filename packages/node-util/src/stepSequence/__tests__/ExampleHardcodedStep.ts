import { ExampleContext } from "./ExampleContext";
import { Step } from "../Step";

export class ExampleHardcodedStep extends Step<ExampleContext> {
  run(context: ExampleContext): ExampleContext {
    context.count = 15;
    return context;
  }
}
