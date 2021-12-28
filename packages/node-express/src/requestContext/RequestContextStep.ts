import { StepFunction, uuid } from "@link1900/node-util";
import { ExpressRequestContext } from "./ExpressRequestContext";
import { RequestContext } from "./RequestContext";

export const requestContextStep = new StepFunction<
  ExpressRequestContext & RequestContext
>((ctx) => {
  const { express } = ctx;
  if (express && express.req && (express.req as any).requestId) {
    ctx.requestId = (express.req as any).requestId;
  } else {
    ctx.requestId = uuid();
  }
  return ctx;
});
