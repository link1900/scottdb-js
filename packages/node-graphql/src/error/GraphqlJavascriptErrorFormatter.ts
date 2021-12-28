import { ErrorCode, HttpStatusCode } from "@link1900/node-error";
import { uuid } from "@link1900/node-util";
import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlErrorFormatter } from "./GraphqlErrorFormatter";

export class GraphqlJavascriptErrorFormatter extends GraphqlErrorFormatter {
  formatterApplies(ctx: GraphqlErrorDetail): boolean {
    return ctx.originalError instanceof Error;
  }

  formatError(ctx: GraphqlErrorDetail): GraphqlErrorDetail {
    if (ctx.originalError instanceof Error) {
      return {
        message: ctx.message,
        originalError: ctx.originalError,
        extensions: {
          errorId: uuid(),
          httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          errorMessage: ctx.originalError.message,
          stacktrace: ctx.originalError.stack,
        },
      };
    } else {
      return ctx;
    }
  }
}
