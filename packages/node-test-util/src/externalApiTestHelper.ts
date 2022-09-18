import nock, { ReplyHeaders, Scope } from "nock";

export interface MockApiOptions {
  baseUrl: string;
  path: string;
  method?: string;
  status?: number;
  body?: string | Record<string, any> | null;
  headers?: ReplyHeaders;
  networkErrorMessage?: string;
  requestBody?: any;
}

export interface MockScope extends Scope {
  requestHeaders?: Record<string, string>;
  requestBody?: string | Record<string, any>;
}

export function mockApi(options: MockApiOptions): MockScope {
  const {
    baseUrl,
    path,
    method = "GET",
    status = 200,
    body = {},
    headers,
    networkErrorMessage,
    requestBody,
  } = options;
  const mock = nock(baseUrl);
  if (networkErrorMessage) {
    mock.intercept(path, method, requestBody).replyWithError(networkErrorMessage);
    return mock;
  } else {
    mock.intercept(path, method, requestBody).reply(
      status,
      function mockInterceptor(uri, reqBody) {
        (mock as any).requestHeaders = this.req.headers;
        (mock as any).requestBody = reqBody;
        return body;
      },
      headers
    );
    return mock;
  }
}

export function mockApiFunctionBuilder(defaults: MockApiOptions) {
  return function builtMockApi(options?: Partial<MockApiOptions>) {
    return mockApi({
      ...defaults,
      ...options,
    });
  };
}
