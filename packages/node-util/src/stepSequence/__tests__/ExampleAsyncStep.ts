import { ExampleContext } from "./ExampleContext";
import { Step } from "../Step";

export class ExampleAsyncStep extends Step<ExampleContext> {
  async run(context: ExampleContext): Promise<ExampleContext> {
    context.count = context.count + 1;
    return context;
  }
}
