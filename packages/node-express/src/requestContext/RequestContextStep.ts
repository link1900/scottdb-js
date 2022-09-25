import { Step, uuid } from "@link1900/node-util";
import { ExpressRequestContext } from "./ExpressRequestContext";
import { RequestContext } from "./RequestContext";

export class RequestContextStep extends Step<
  ExpressRequestContext & RequestContext
> {
  run(
    context: ExpressRequestContext & RequestContext
  ):
    | Promise<ExpressRequestContext & RequestContext>
    | (ExpressRequestContext & RequestContext) {
    const { express } = context;
    context.requestId = express?.res?.locals?.requestId ?? uuid();
    return context;
  }
}
