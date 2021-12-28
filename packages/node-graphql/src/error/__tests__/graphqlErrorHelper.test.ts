import { setVariable } from "@link1900/node-environment";
import {
  ErrorCode,
  HttpStatusCode,
  InvalidFieldReason,
  ServerError,
  UserInputError,
} from "@link1900/node-error";
import { ExternalApiError } from "@link1900/node-http-client";
import { GraphQLError } from "graphql";
import {
  formatGraphqlError,
  handleGraphqlError,
  registerGraphqlErrorFormatters,
  resetGraphqlErrorFormattersRegister,
} from "../graphqlErrorHelper";
import { GraphqlExternalApiErrorFormatter } from "../GraphqlExternalApiErrorFormatter";
import { GraphqlJavascriptErrorFormatter } from "../GraphqlJavascriptErrorFormatter";
import { GraphqlServerErrorFormatter } from "../GraphqlServerErrorFormatter";
import { GraphqlUnauthenticatedErrorFormatter } from "../GraphqlUnauthenticatedErrorFormatter";
import { GraphqlUserInputErrorFormatter } from "../GraphqlUserInputErrorFormatter";

function getMockGraphqlError(overrides?: Partial<GraphQLError>): GraphQLError {
  return {
    locations: undefined,
    name: "",
    nodes: undefined,
    path: undefined,
    positions: undefined,
    source: undefined,
    stack: "",
    message: "some error",
    originalError: new Error("some bad error"),
    extensions: {},
    ...overrides,
  };
}

function getAllGraphqlErrorFormatters() {
  return [
    new GraphqlUserInputErrorFormatter(),
    new GraphqlExternalApiErrorFormatter(),
    new GraphqlServerErrorFormatter(),
    new GraphqlUnauthenticatedErrorFormatter(),
    new GraphqlJavascriptErrorFormatter(),
  ];
}

describe("formatGraphqlError", () => {
  beforeEach(() => {
    resetGraphqlErrorFormattersRegister();
  });

  it("formats the graphql error", () => {
    registerGraphqlErrorFormatters([new GraphqlJavascriptErrorFormatter()]);
    const result = formatGraphqlError({
      message: "some error",
      originalError: new Error("some bad error"),
      extensions: {},
    });
    expect(result.message).toEqual("some error");
    expect(result.extensions.code).toEqual("INTERNAL_SERVER_ERROR");
    expect(result.extensions.errorId).toHaveLength(36);
    expect(result.extensions.errorMessage).toEqual("some bad error");
    expect(result.extensions.httpStatusCode).toEqual(500);
    expect(result.extensions.stacktrace).not.toBeUndefined();
  });
});

describe("handleGraphqlError", () => {
  beforeEach(() => {
    resetGraphqlErrorFormattersRegister();
  });

  it("formats user input error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(
      getMockGraphqlError({
        originalError: new UserInputError(
          "name is missing",
          "name",
          InvalidFieldReason.REQUIRED
        ),
      })
    );
    expect(result.message).toEqual("some error");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.stacktrace).toBeUndefined();
    expect(result?.extensions?.errorMessage).toEqual("name is missing");
    expect(result?.extensions?.code).toEqual("USER_INPUT_ERROR");
    expect(result?.extensions?.httpStatusCode).toEqual(400);

    expect(result?.extensions?.invalidField).toEqual("name");
    expect(result?.extensions?.invalidReason).toEqual("REQUIRED");
  });

  it("formats server error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(
      getMockGraphqlError({
        originalError: new ServerError(
          "too long",
          ErrorCode.TIMEOUT,
          HttpStatusCode.GATEWAY_TIMEOUT
        ),
      })
    );

    expect(result.message).toEqual("some error");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.stacktrace).not.toBeUndefined();
    expect(result?.extensions?.errorMessage).toEqual("too long");
    expect(result?.extensions?.code).toEqual("TIMEOUT");
    expect(result?.extensions?.httpStatusCode).toEqual(504);
  });

  it("formats external api error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(
      getMockGraphqlError({
        originalError: new ExternalApiError({
          message: "api failed",
          externalHttpCode: HttpStatusCode.TOO_MANY_REQUESTS,
          externalMessage: "too many calls",
          originalError: new Error("failed to call"),
        }),
      })
    );

    expect(result.message).toEqual("some error");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.stacktrace).not.toBeUndefined();
    expect(result?.extensions?.code).toEqual("EXTERNAL_API_ERROR");
    expect(result?.extensions?.errorMessage).toEqual("api failed");
    expect(result?.extensions?.httpStatusCode).toEqual(500);

    expect(result?.extensions?.externalHttpCode).toEqual(429);
    expect(result?.extensions?.externalMessage).toEqual("too many calls");
  });

  it("formats unauthenticated error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(
      getMockGraphqlError({
        originalError: new Error("Access denied!"),
      })
    );

    expect(result.message).toEqual("some error");
    expect(result?.extensions?.code).toEqual("UNAUTHORIZED");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.errorMessage).toEqual("Access denied!");
    expect(result?.extensions?.httpStatusCode).toEqual(401);
    expect(result?.extensions?.stacktrace).not.toBeUndefined();
  });

  it("formats javascript error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(getMockGraphqlError());
    expect(result.message).toEqual("some error");
    expect(result?.extensions?.code).toEqual("INTERNAL_SERVER_ERROR");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.errorMessage).toEqual("some bad error");
    expect(result?.extensions?.httpStatusCode).toEqual(500);
    expect(result?.extensions?.stacktrace).not.toBeUndefined();
  });
});

describe("handleGraphqlError masked", () => {
  beforeAll(() => {
    setVariable("MASK_ERRORS", "true");
  });

  afterAll(() => {
    setVariable("MASK_ERRORS", "false");
  });

  beforeEach(() => {
    resetGraphqlErrorFormattersRegister();
  });

  it("formats user input error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(
      getMockGraphqlError({
        originalError: new UserInputError(
          "name is missing",
          "name",
          InvalidFieldReason.REQUIRED
        ),
      })
    );
    expect(result.message).toEqual("some error");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.stacktrace).toBeUndefined();
    expect(result?.extensions?.errorMessage).toEqual("name is missing");
    expect(result?.extensions?.code).toEqual("USER_INPUT_ERROR");
    expect(result?.extensions?.httpStatusCode).toEqual(400);

    expect(result?.extensions?.invalidField).toEqual("name");
    expect(result?.extensions?.invalidReason).toEqual("REQUIRED");
  });

  it("formats server error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(
      getMockGraphqlError({
        originalError: new ServerError(
          "too long",
          ErrorCode.TIMEOUT,
          HttpStatusCode.GATEWAY_TIMEOUT
        ),
      })
    );

    expect(result.message).toEqual("There was an unexpected error");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.stacktrace).toBeUndefined();
    expect(result?.extensions?.code).toEqual("INTERNAL_SERVER_ERROR");
    expect(result?.extensions?.httpStatusCode).toEqual(500);
  });

  it("formats external api error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(
      getMockGraphqlError({
        originalError: new ExternalApiError({
          message: "api failed",
          externalHttpCode: HttpStatusCode.TOO_MANY_REQUESTS,
          externalMessage: "too many calls",
          originalError: new Error("failed to call"),
        }),
      })
    );

    expect(result.message).toEqual("There was an unexpected error");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.stacktrace).toBeUndefined();
    expect(result?.extensions?.code).toEqual("INTERNAL_SERVER_ERROR");
    expect(result?.extensions?.httpStatusCode).toEqual(500);
  });

  it("formats unauthenticated error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(
      getMockGraphqlError({
        originalError: new Error("Access denied!"),
      })
    );

    expect(result.message).toEqual("some error");
    expect(result?.extensions?.code).toEqual("UNAUTHORIZED");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.errorMessage).toEqual("Access denied!");
    expect(result?.extensions?.httpStatusCode).toEqual(401);
    expect(result?.extensions?.stacktrace).toBeUndefined();
  });

  it("formats javascript error", () => {
    registerGraphqlErrorFormatters(getAllGraphqlErrorFormatters());
    const result = handleGraphqlError(getMockGraphqlError());
    expect(result.message).toEqual("There was an unexpected error");
    expect(result?.extensions?.errorId).toHaveLength(36);
    expect(result?.extensions?.stacktrace).toBeUndefined();
    expect(result?.extensions?.code).toEqual("INTERNAL_SERVER_ERROR");
    expect(result?.extensions?.httpStatusCode).toEqual(500);
  });
});
