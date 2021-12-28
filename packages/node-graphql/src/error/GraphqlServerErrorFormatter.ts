import { ServerError } from "@link1900/node-error";
import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlErrorFormatter } from "./GraphqlErrorFormatter";

export class GraphqlServerErrorFormatter extends GraphqlErrorFormatter {
  formatterApplies(ctx: GraphqlErrorDetail): boolean {
    return ctx.originalError instanceof ServerError;
  }

  formatError(ctx: GraphqlErrorDetail): GraphqlErrorDetail {
    if (ctx.originalError instanceof ServerError) {
      return {
        ...ctx,
        extensions: {
          errorId: ctx.originalError.errorId,
          httpStatusCode: ctx.originalError.httpCode,
          code: ctx.originalError.code,
          errorMessage: ctx.originalError.message,
          stacktrace: ctx.originalError.stack,
        },
      };
    } else {
      return ctx;
    }
  }
}
