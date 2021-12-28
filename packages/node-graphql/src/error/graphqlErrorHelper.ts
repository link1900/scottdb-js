import { logger } from "@link1900/node-logger";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { GraphqlErrorDetail } from "./GraphqlErrorDetail";
import { GraphqlErrorFormatter } from "./GraphqlErrorFormatter";
import { GraphqlErrorFormatterRegistry } from "./GraphqlErrorFormatterRegistry";

let graphqlErrorFormatterRegistry: GraphqlErrorFormatterRegistry | undefined;

export function registerGraphqlErrorFormatters(
  formatters: Array<GraphqlErrorFormatter>
) {
  graphqlErrorFormatterRegistry = new GraphqlErrorFormatterRegistry(formatters);
}

export function resetGraphqlErrorFormattersRegister() {
  graphqlErrorFormatterRegistry = undefined;
}

export function formatGraphqlError(
  originalErrorDetail: GraphqlErrorDetail
): GraphqlErrorDetail {
  if (
    graphqlErrorFormatterRegistry === undefined ||
    graphqlErrorFormatterRegistry.formatters.length === 0
  ) {
    throw new Error(
      "registerGraphqlErrorFormatters() must be called before calling formatGraphqlError()"
    );
  }

  return graphqlErrorFormatterRegistry.formatError(originalErrorDetail);
}

export function handleGraphqlError<GraphqlErrorContext>(
  graphqlError: GraphQLError
): GraphQLFormattedError {
  const {
    originalError,
    message,
    locations,
    path,
    extensions = {},
  } = graphqlError;
  logger.error("graphql resolver failed", originalError ?? graphqlError);
  const formattedGraphqlError = formatGraphqlError({
    message,
    originalError,
    extensions,
  });
  const returnedError = {
    message: formattedGraphqlError.message,
    locations,
    path,
    extensions: formattedGraphqlError.extensions,
  };
  logger.error("returning graphql error", undefined, { error: returnedError });
  return returnedError;
}
