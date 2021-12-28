import { isVariableEnabled } from "@link1900/node-environment";
import { ErrorCode, HttpStatusCode } from "@link1900/node-error";
import { uuid } from "@link1900/node-util";
import { GraphqlErrorDetail } from "./GraphqlErrorDetail";

export abstract class GraphqlErrorFormatter {
  id: string;
  enabled: boolean;

  constructor(id?: string, enabled?: boolean) {
    this.id = id ?? uuid();
    this.enabled = enabled ?? true;
  }

  abstract formatterApplies(context: GraphqlErrorDetail): boolean;

  applies(context: GraphqlErrorDetail): boolean {
    return this.enabled && this.formatterApplies(context);
  }

  abstract formatError(context: GraphqlErrorDetail): GraphqlErrorDetail;

  formatMaskedError(context: GraphqlErrorDetail): GraphqlErrorDetail {
    return {
      ...context,
      message: "There was an unexpected error",
      extensions: {
        errorId: uuid(),
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
      },
    };
  }

  run(context: GraphqlErrorDetail): GraphqlErrorDetail {
    if (isVariableEnabled("MASK_ERRORS")) {
      return this.formatMaskedError(context);
    } else {
      return this.formatError(context);
    }
  }
}
