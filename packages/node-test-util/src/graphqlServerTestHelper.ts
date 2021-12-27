import assert from "assert";
import { get, has } from "lodash";
import { ApiOptions, callPostEndpoint } from "./serverTestHelper";

export interface GraphqlApiOptions extends Omit<ApiOptions, "url"> {
  query: string;
  variables: object;
  expectGraphqlErrors?: boolean;
}

export function checkResponseForGraphqlError(
  response: any,
  expectError: boolean
) {
  const errors = response?.body?.errors ?? [];
  const hasGraphqlErrors = errors.length > 0;
  if (expectError) {
    assert(
      hasGraphqlErrors,
      `Expected graphql call to return graphql errors and no errors were found. Result: ${JSON.stringify(
        response
      )}.`
    );
  } else {
    assert(
      !hasGraphqlErrors,
      `Expected graphql call to not return errors but errors were found. \nErrors: ${JSON.stringify(
        errors
      )}`
    );
  }
}

export async function callGraphqlEndpoint(options: GraphqlApiOptions) {
  const {
    query,
    variables,
    expectGraphqlErrors = false,
    ...apiOptions
  } = options;
  const body = {
    query,
    variables,
  };
  const response = await callPostEndpoint({
    ...apiOptions,
    url: "/graphql",
    body,
  });
  checkResponseForGraphqlError(response, expectGraphqlErrors);
  return response.body;
}

export function buildApiQueryFunction(query: string, resultKey: string) {
  return async function builtRunQuery(
    variables: object = {},
    expectError: boolean = false,
    authToken: string | undefined = undefined
  ) {
    const result = await callGraphqlEndpoint({
      query,
      variables,
      expectGraphqlErrors: expectError,
      authToken,
    });

    if (expectError) {
      const { errors = [] } = result;
      return errors[0];
    }

    const { data } = result;

    if (!data || !has(data, resultKey)) {
      throw new Error("Cannot find result data");
    }
    return get(data, resultKey);
  };
}
