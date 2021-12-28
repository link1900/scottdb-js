import { ErrorCode, HttpStatusCode } from "@link1900/node-error";
import { uuid } from "@link1900/node-util";
import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlUserErrorFormatter } from "./GraphqlUserErrorFormatter";

export class GraphqlUnauthenticatedErrorFormatter extends GraphqlUserErrorFormatter {
  formatterApplies(ctx: GraphqlErrorDetail): boolean {
    return (
      ctx.originalError instanceof Error &&
      ctx.originalError.message.startsWith("Access denied!")
    );
  }

  formatError(ctx: GraphqlErrorDetail): GraphqlErrorDetail {
    if (ctx.originalError instanceof Error) {
      return {
        ...ctx,
        extensions: {
          httpStatusCode: HttpStatusCode.UNAUTHORIZED,
          errorId: uuid(),
          code: ErrorCode.UNAUTHORIZED_ERROR,
          errorMessage: ctx.originalError.message,
          stacktrace: ctx.originalError.stack,
        },
      };
    } else {
      return ctx;
    }
  }
}
