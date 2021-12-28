import { ServerError } from "../ServerError";
import { ErrorCode } from "../ErrorCode";
import { HttpStatusCode } from "../HttpStatusCode";

describe("ServerError", () => {
  it("has the correct properties", () => {
    const serverError = new ServerError(
      "test message",
      ErrorCode.INTERNAL_SERVER_ERROR,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(serverError.message).toEqual("test message");
    expect(serverError.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
    expect(serverError.httpCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
  });

  it("allows any string code", () => {
    const serverError = new ServerError(
      "test message",
      "SPECIFIC_CODE",
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
    expect(serverError.message).toEqual("test message");
    expect(serverError.code).toEqual("SPECIFIC_CODE");
    expect(serverError.httpCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
  });
});
