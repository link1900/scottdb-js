import {
  ExternalApiError,
  ExternalApiErrorOptions,
} from "@link1900/node-http-client";
import { GraphqlErrorResponse } from "./GraphqlErrorResponse";

export type GraphqlErrorType = "network" | "resolver";

export interface ExternalGraphqlApiErrorOptions
  extends ExternalApiErrorOptions {
  graphqlErrorType?: GraphqlErrorType;
  externalGraphqlErrors?: GraphqlErrorResponse[];
}

export class ExternalGraphqlApiError extends ExternalApiError {
  graphqlErrorType: GraphqlErrorType;
  externalGraphqlErrors: GraphqlErrorResponse[];

  constructor(options: ExternalGraphqlApiErrorOptions = {}) {
    const {
      graphqlErrorType = "resolver",
      externalGraphqlErrors = [],
      ...otherOptions
    } = options;
    super(otherOptions);
    this.graphqlErrorType = graphqlErrorType;
    this.externalGraphqlErrors = externalGraphqlErrors;
  }
}
