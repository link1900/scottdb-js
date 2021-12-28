import { uuid } from "@link1900/node-util";
import { ArgumentValidationError } from "type-graphql";
import { ErrorCode, HttpStatusCode } from "@link1900/node-error";
import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlUserErrorFormatter } from "./GraphqlUserErrorFormatter";

export class GraphqlArgumentErrorFormatter extends GraphqlUserErrorFormatter {
  formatterApplies(ctx: GraphqlErrorDetail): boolean {
    return ctx.originalError instanceof ArgumentValidationError;
  }

  formatError(ctx: GraphqlErrorDetail): GraphqlErrorDetail {
    if (ctx.originalError instanceof ArgumentValidationError) {
      return {
        ...ctx,
        extensions: {
          errorId: uuid(),
          httpStatusCode: HttpStatusCode.BAD_REQUEST,
          code: ErrorCode.USER_INPUT_ERROR,
          errorMessage: ctx.originalError.message,
          validationErrors: ctx.originalError.validationErrors,
        },
      };
    } else {
      return ctx;
    }
  }
}
