import { ExampleContext } from "./ExampleContext";
import { Step } from "../Step";

export class ExampleBadStep extends Step<ExampleContext> {
  run(context: ExampleContext): ExampleContext {
    throw new Error("bad step run");
  }
}
