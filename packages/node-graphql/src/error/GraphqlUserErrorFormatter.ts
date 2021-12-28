import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlErrorFormatter } from "./GraphqlErrorFormatter";

export abstract class GraphqlUserErrorFormatter extends GraphqlErrorFormatter {
  formatMaskedError(context: GraphqlErrorDetail): GraphqlErrorDetail {
    const fullError = this.formatError(context);
    delete fullError.extensions.stacktrace;
    return fullError;
  }
}
