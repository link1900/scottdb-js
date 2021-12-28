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
    if (express && express.req && (express.req as any).requestId) {
      context.requestId = (express.req as any).requestId;
    } else {
      context.requestId = uuid();
    }
    return context;
  }
}
