import { mockApi, MockApiOptions } from "./externalApiTestHelper";

export interface MockGraphqlApiOptions extends MockApiOptions {
  data?: Record<string, any>;
  errors?: Record<string, any>[];
}

export function mockGraphqlApi(options: MockGraphqlApiOptions) {
  const graphqlBody: {
    data?: Record<string, any>;
    errors?: Record<string, any>[];
  } = {};
  if (options.data) {
    graphqlBody.data = options.data;
  }
  if (options.errors) {
    graphqlBody.errors = options.errors;
  }
  const body = options.body ? options.body : graphqlBody;
  return mockApi({
    method: "POST",
    status: 200,
    body,
    ...options,
  });
}
