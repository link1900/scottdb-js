import { UserInputError } from "@link1900/node-error";
import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlUserErrorFormatter } from "./GraphqlUserErrorFormatter";

export class GraphqlUserInputErrorFormatter extends GraphqlUserErrorFormatter {
  formatterApplies(ctx: GraphqlErrorDetail): boolean {
    return ctx.originalError instanceof UserInputError;
  }

  formatError(ctx: GraphqlErrorDetail): GraphqlErrorDetail {
    if (ctx.originalError instanceof UserInputError) {
      return {
        ...ctx,
        extensions: {
          httpStatusCode: ctx.originalError.httpCode,
          errorId: ctx.originalError.errorId,
          code: ctx.originalError.code,
          errorMessage: ctx.originalError.message,
          invalidField: ctx.originalError.invalidField,
          invalidReason: ctx.originalError.invalidReason,
        },
      };
    } else {
      return ctx;
    }
  }
}
