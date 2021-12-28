import { ExternalApiError } from "@link1900/node-http-client";
import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlErrorFormatter } from "./GraphqlErrorFormatter";

export class GraphqlExternalApiErrorFormatter extends GraphqlErrorFormatter {
  formatterApplies(ctx: GraphqlErrorDetail): boolean {
    return ctx.originalError instanceof ExternalApiError;
  }

  formatError(ctx: GraphqlErrorDetail): GraphqlErrorDetail {
    if (ctx.originalError instanceof ExternalApiError) {
      return {
        ...ctx,
        extensions: {
          errorId: ctx.originalError.errorId,
          httpStatusCode: ctx.originalError.httpCode,
          code: ctx.originalError.code,
          externalHttpCode: ctx.originalError.externalHttpCode,
          externalMessage: ctx.originalError.externalMessage,
          errorMessage: ctx.originalError.message,
          stacktrace: ctx.originalError.stack,
        },
      };
    } else {
      return ctx;
    }
  }
}
