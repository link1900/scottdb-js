import { ExternalApiError } from "../ExternalApiError";
import { HttpStatusCode } from "@link1900/node-error";

describe("ExternalApiError", () => {
  it("default error is created correctly", () => {
    const error = new ExternalApiError();
    expect(error.message).toEqual("external api failed");
    expect(error.code).toEqual("EXTERNAL_API_ERROR");
    expect(error.httpCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR_500);
  });

  it("error is created with options correctly", () => {
    const originalError = new Error("original error");
    const error = new ExternalApiError({
      message: "test message",
      externalHttpCode: HttpStatusCode.FORBIDDEN_403,
      externalMessage: "external message",
      originalError,
    });
    expect(error.message).toEqual("test message");
    expect(error.code).toEqual("EXTERNAL_API_ERROR");
    expect(error.httpCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR_500);
    expect(error.externalHttpCode).toEqual(HttpStatusCode.FORBIDDEN_403);
    expect(error.externalMessage).toEqual("external message");
    expect(error.originalError).toEqual(originalError);
  });
});
