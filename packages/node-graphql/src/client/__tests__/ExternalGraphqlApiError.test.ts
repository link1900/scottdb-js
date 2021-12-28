import { ExternalGraphqlApiError } from "../ExternalGraphqlApiError";
import { HttpStatusCode } from "@link1900/node-error";

describe("ExternalGraphqlApiError", () => {
  it("default error is created correctly", () => {
    const error = new ExternalGraphqlApiError();
    expect(error.message).toEqual("external api failed");
    expect(error.code).toEqual("EXTERNAL_API_ERROR");
    expect(error.httpCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(error.externalHttpCode).toEqual(undefined);
    expect(error.externalMessage).toEqual(undefined);
    expect(error.originalError).toEqual(undefined);
    expect(error.graphqlErrorType).toEqual("resolver");
    expect(error.externalGraphqlErrors).toEqual([]);
  });

  it("error is created with options correctly", () => {
    const originalError = new Error("original error");
    const error = new ExternalGraphqlApiError({
      message: "test message",
      externalHttpCode: HttpStatusCode.NOT_FOUND,
      externalMessage: "external message",
      originalError,
      graphqlErrorType: "network",
      externalGraphqlErrors: [],
    });
    expect(error.message).toEqual("test message");
    expect(error.code).toEqual("EXTERNAL_API_ERROR");
    expect(error.httpCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(error.externalHttpCode).toEqual(HttpStatusCode.NOT_FOUND);
    expect(error.externalMessage).toEqual("external message");
    expect(error.originalError).toEqual(originalError);
    expect(error.graphqlErrorType).toEqual("network");
    expect(error.externalGraphqlErrors).toEqual([]);
  });
});
