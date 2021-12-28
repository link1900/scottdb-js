import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlErrorFormatter } from "./GraphqlErrorFormatter";

export class GraphqlErrorFormatterRegistry {
  formatters: GraphqlErrorFormatter[];

  constructor(formatters?: Array<GraphqlErrorFormatter>) {
    this.formatters = [];
    if (formatters !== undefined) {
      this.addFormatters(formatters);
    }
  }

  addFormatter(formatter: GraphqlErrorFormatter) {
    this.formatters.push(formatter);
  }

  addFormatters(formatters: Array<GraphqlErrorFormatter>) {
    formatters.forEach((formatter) => this.addFormatter(formatter));
  }

  removeFormatter(formatter: GraphqlErrorFormatter) {
    this.removeFormatterById(formatter.id);
  }

  removeFormatterById(formatterId: string) {
    this.formatters = this.formatters.filter((s) => s.id !== formatterId);
  }

  clearFormatters() {
    this.formatters = [];
  }

  formatError(initContext: GraphqlErrorDetail) {
    for (let formatter of this.formatters) {
      if (formatter.applies(initContext)) {
        return formatter.run(initContext);
      }
    }
    return initContext;
  }
}
